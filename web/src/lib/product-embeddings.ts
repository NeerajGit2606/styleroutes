import { db } from "@/lib/db";
import { embed, productEmbeddingText } from "@/lib/voyage";

type EmbeddableProduct = {
  id: number;
  name: string;
  category: string;
  ageGroup: string;
  description: string;
};

// Prisma can't type-check writes to an Unsupported("vector") column, so this
// goes through $executeRaw with the pgvector text format: "[0.1,0.2,...]".
export async function syncProductEmbedding(product: EmbeddableProduct): Promise<void> {
  const [vector] = await embed([productEmbeddingText(product)], "document");
  const literal = `[${vector.join(",")}]`;
  await db.$executeRaw`UPDATE products SET embedding = ${literal}::vector WHERE id = ${product.id}`;
}

export async function backfillMissingEmbeddings(): Promise<{ updated: number }> {
  const products = await db.$queryRaw<EmbeddableProduct[]>`
    SELECT id, name, category, age_group AS "ageGroup", description
    FROM products
    WHERE embedding IS NULL
  `;
  if (products.length === 0) return { updated: 0 };

  // One batched call instead of one request per product — Voyage's free
  // tier without a payment method on file caps at 3 requests/minute.
  const vectors = await embed(products.map(productEmbeddingText), "document");

  for (let i = 0; i < products.length; i++) {
    const literal = `[${vectors[i].join(",")}]`;
    await db.$executeRaw`UPDATE products SET embedding = ${literal}::vector WHERE id = ${products[i].id}`;
  }

  return { updated: products.length };
}
