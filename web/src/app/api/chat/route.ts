import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { db } from "@/lib/db";
import { embed } from "@/lib/voyage";
import { serializeProduct } from "@/lib/serialize-product";

const client = new Anthropic();

const ChatReplySchema = z.object({
  reply: z.string(),
  // Model may only recommend from the candidates it was shown — enforced
  // again server-side below, since a schema constraint alone doesn't stop
  // the model from inventing an id that looks plausible.
  recommended_ids: z.array(z.number()),
});

type Candidate = {
  id: number;
  name: string;
  category: string;
  ageGroup: string;
  price: number;
  description: string;
};

const HistoryMessage = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const historyResult = z.array(HistoryMessage).max(10).safeParse(body?.history ?? []);
  if (!message || message.length > 500 || !historyResult.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const history = historyResult.data;

  try {
    // Retrieve — the "R" in RAG. Find products relevant to this message via
    // the same pgvector search built for Step 2, so the assistant can only
    // talk about products that actually exist in the catalog.
    const [vector] = await embed([message], "query");
    const literal = `[${vector.join(",")}]`;
    const candidates = await db.$queryRaw<Candidate[]>`
      SELECT id, name, category, age_group AS "ageGroup", price::float AS price, description
      FROM products
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${literal}::vector
      LIMIT 8
    `;

    if (candidates.length === 0) {
      return NextResponse.json({
        reply: "I couldn't find anything in the catalog for that — could you try describing it differently?",
        products: [],
      });
    }

    // Generate — hand the retrieved products to Claude as grounding context.
    const catalogContext = candidates
      .map((c) => `id=${c.id} | ${c.name} | ${c.category}, ${c.ageGroup} | ₹${c.price} | ${c.description}`)
      .join("\n");

    const response = await client.messages.parse({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      system:
        "You are StyleRoute's shopping assistant for a kidswear brand. " +
        "Recommend ONLY from the CATALOG list below — never invent a product or id that isn't listed. " +
        "If nothing in the list genuinely fits, say so honestly instead of forcing a recommendation. " +
        "Keep replies to 2-3 short sentences, warm and concise, no markdown.\n\nCATALOG:\n" +
        catalogContext,
      messages: [
        ...history.map((h) => ({ role: h.role, content: h.content }) as const),
        { role: "user" as const, content: message },
      ],
      output_config: { format: zodOutputFormat(ChatReplySchema) },
    });

    if (!response.parsed_output) {
      return NextResponse.json({ error: "AI returned an invalid response" }, { status: 502 });
    }

    const candidateIds = new Set(candidates.map((c) => c.id));
    const safeIds = response.parsed_output.recommended_ids.filter((id) => candidateIds.has(id));
    const recommended = candidates.filter((c) => safeIds.includes(c.id));

    const products = await db.product.findMany({ where: { id: { in: recommended.map((r) => r.id) } } });
    const byId = new Map(products.map((p) => [p.id, p]));
    const ordered = safeIds.map((id) => byId.get(id)).filter((p) => p != null);

    return NextResponse.json({
      reply: response.parsed_output.reply,
      products: ordered.map(serializeProduct),
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Assistant is busy, try again in a moment" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: "Assistant is temporarily unavailable" }, { status: 502 });
    }
    console.error("Chat request failed", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
