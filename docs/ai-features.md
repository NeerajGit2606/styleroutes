# AI Features — StyleRoute (learning + portfolio log)

Built as a staged path so each step teaches one new AI concept before the next builds on it. Goal: usable, demoable features for freelance bids (RAG, vector DB, LLM integration, agents), even starting from zero AI knowledge.

Model: **Claude Haiku 4.5** (`claude-haiku-4-5`) — cheapest tier, plenty capable for these tasks. Billing: prepaid credits via [console.anthropic.com](https://console.anthropic.com) (no fixed monthly plan — pay only for what's used).

---

## Step 1 — AI Product Description Generator ✅ Live

**What it does**: In the admin product form (`/admin/products/new` and the edit page), admin fills in Name / Category / Age group / Sizes, clicks **"✨ Generate with AI"**, and Claude drafts a 2–3 sentence product description. Admin can edit it before saving.

**Files**:
- [`web/src/app/api/admin/generate-description/route.ts`](../web/src/app/api/admin/generate-description/route.ts) — server-side API route, admin-auth gated, calls Claude
- [`web/src/components/ProductForm.tsx`](../web/src/components/ProductForm.tsx) — the button + fetch call

**Concepts learned**:
- A basic LLM API call = one request (prompt) → one response (text). No memory, no database — the simplest AI building block.
- **System prompt** vs **user message**: system prompt sets the AI's role/rules ("you are a copywriter for X"); user message carries the actual per-request input.
- Why the call happens **server-side** (API route), never in the browser — keeps the API key secret. The client only ever talks to our own `/api/...` route, never directly to Anthropic.

**Cost**: ~₹0.13 per generation (Haiku 4.5 rates). Effectively free at this feature's expected volume.

---

## Step 2 — Semantic Product Search ✅ Live

**What it does**: Search page (`/search`) now ranks results by *meaning*, not just exact keyword match. A query like "warm clothes for winter" correctly surfaces "Cozy Jogger Pants" and "Soft Fleece Sleepsuit" — neither product name/description contains the words "warm" or "winter". Instant keyword results show first (zero latency); semantic results replace them ~350ms later once the ranked search comes back.

**Files**:
- [`web/prisma/schema.prisma`](../web/prisma/schema.prisma) — added `embedding Unsupported("vector(1024)")?` on `Product`
- [`web/src/lib/voyage.ts`](../web/src/lib/voyage.ts) — calls Voyage AI's embeddings API (Anthropic's recommended partner; Claude itself has no embeddings endpoint)
- [`web/src/lib/product-embeddings.ts`](../web/src/lib/product-embeddings.ts) — writes/backfills embeddings via raw SQL (Prisma can't type-check an `Unsupported` column)
- [`web/src/app/api/search/semantic/route.ts`](../web/src/app/api/search/semantic/route.ts) — embeds the query, ranks products by pgvector cosine distance (`<=>`)
- [`web/src/components/SearchView.tsx`](../web/src/components/SearchView.tsx) — debounced fetch, semantic results replace the instant keyword fallback
- New products get embedded automatically on create/update (`api/products/route.ts`, `api/products/[id]/route.ts`); `scripts/backfill-embeddings.ts` catches up any that predate this feature or were bulk-imported

**Concepts learned**:
- **Embeddings**: text → a list of numbers (a vector) that captures meaning, so "cozy jogger" and "warm winter clothes" land close together in that number-space even sharing no words.
- **`input_type: "document"` vs `"query"`**: Voyage embeds a short search query and a longer product description slightly differently for better matching — this is called *asymmetric retrieval*.
- **pgvector**: a Postgres extension that stores vectors as a native column type and can sort by distance (`<=>` = cosine distance) directly in SQL — no separate vector database service needed since the app already runs on Postgres.
- **Batching**: embedding one product at a time hit Voyage's 3-requests/minute limit (no payment method on file yet); batching all texts into a single API call fixed it — a real lesson in API rate limits.

**Cost**: ~₹0 so far (well within Voyage's free tier for a 23-product catalog; ongoing cost is one embedding call per product save, negligible).

---

## Step 3 — AI Shopping Assistant (RAG chatbot) ✅ Live

**What it does**: A chat widget (bottom-left, every page except `/admin`) where a customer asks something like "something warm for a newborn" and gets a natural-language recommendation grounded in the real catalog, with clickable product cards — not hallucinated products.

**Files**:
- [`web/src/app/api/chat/route.ts`](../web/src/app/api/chat/route.ts) — the RAG pipeline
- [`web/src/components/ChatWidget.tsx`](../web/src/components/ChatWidget.tsx) — floating chat UI

**How the RAG pipeline works (Retrieval-Augmented Generation)**:
1. **Retrieve**: embed the customer's message (Voyage, same as Step 2), find the top 8 most relevant products via pgvector cosine similarity.
2. **Augment**: hand those 8 products (id, name, category, price, description) to Claude as context in the system prompt, with an explicit instruction to recommend *only* from that list.
3. **Generate**: Claude (Haiku 4.5) replies with a structured response — `{ reply: string, recommended_ids: number[] }`, enforced via a Zod schema (`output_config.format`) so the response always parses cleanly instead of scraping free text.
4. **Guard against hallucination**: even though the prompt says "only recommend from the list," the server re-checks `recommended_ids` against the actual retrieved candidate ids and silently drops anything that doesn't match — a model can't be fully trusted to follow instructions, so the code enforces it too.

**Concepts learned**:
- **RAG** = Retrieval (search) + Augmented (inject real data into the prompt) + Generation (LLM writes the answer) — this is *why* the assistant can't invent a product that doesn't exist: it's never asked to write facts from memory, only to talk about what's in the retrieved list.
- **Structured outputs**: `client.messages.parse()` + a Zod schema guarantees the model's response deserializes into a typed object, instead of parsing free-form text and hoping for the best.
- **Defense in depth**: never trust the model's output for anything that touches real data (ids, prices) — validate/filter server-side even when the prompt already asked nicely.
- **UI layering gotcha**: the site's existing "stay in touch" popup uses a full-screen overlay above the chat button's z-index — not a bug, just something to route around (or dismiss first) when testing.

**Cost**: a chat reply costs roughly the same as one Step-1 description generation call (~₹1-2), plus one embedding call (~₹0). Realistic monthly cost for portfolio-level demo traffic: well under ₹50.

---

## Portfolio pitch (all 3 steps live)

"I built three AI features end-to-end on a live e-commerce site — from a single LLM API call, through embeddings-based semantic search, to a full RAG shopping assistant with structured outputs and hallucination guards — covering LLM integration, vector databases, retrieval-augmented generation, and defensive AI engineering." Live demo links (styleroute.co.in — search, and the chat bubble bottom-left) + this repo double as proof of work for freelance bids.

**Possible next steps** (not built, worth mentioning as roadmap in interviews): function calling so the assistant can add a recommended item straight to the cart; conversation memory across sessions; an eval set to measure recommendation quality over time.
