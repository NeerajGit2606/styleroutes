import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { embed } from "@/lib/voyage";
import { serializeProduct } from "@/lib/serialize-product";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const [vector] = await embed([q], "query");
    const literal = `[${vector.join(",")}]`;

    // Cosine distance (<=>) ranks by meaning, not exact word match.
    const matches = await db.$queryRaw<{ id: number }[]>`
      SELECT id FROM products
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${literal}::vector
      LIMIT 12
    `;

    if (matches.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const ids = matches.map((m) => m.id);
    const products = await db.product.findMany({ where: { id: { in: ids } } });
    // Preserve the similarity-ranked order — findMany doesn't guarantee it.
    const byId = new Map(products.map((p) => [p.id, p]));
    const ordered = ids.map((id) => byId.get(id)).filter((p) => p != null);

    return NextResponse.json({ products: ordered.map(serializeProduct) });
  } catch (error) {
    console.error("Semantic search failed", error);
    return NextResponse.json({ products: [], error: "search_unavailable" }, { status: 502 });
  }
}
