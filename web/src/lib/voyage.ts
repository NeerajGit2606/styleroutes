const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";

type InputType = "document" | "query";

// Voyage AI is Anthropic's recommended embeddings partner — Claude itself
// has no embeddings endpoint. "document" vs "query" input_type improves
// retrieval quality for asymmetric search (short query vs longer product text).
export async function embed(texts: string[], inputType: InputType): Promise<number[][]> {
  const response = await fetch(VOYAGE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: texts,
      model: "voyage-4-lite",
      input_type: inputType,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Voyage embeddings request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { data: { embedding: number[] }[] };
  return data.data.map((entry) => entry.embedding);
}

export function productEmbeddingText(product: {
  name: string;
  category: string;
  ageGroup: string;
  description: string;
}): string {
  return `${product.name}. ${product.category}, ${product.ageGroup}. ${product.description}`;
}
