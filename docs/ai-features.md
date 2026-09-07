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

## Step 3 — AI Shopping Assistant / RAG chatbot (planned)

**What it will do**: A chat widget where a customer asks something like "suggest a gift for a 3-year-old boy" and gets a natural-language recommendation grounded in the actual product catalog (not hallucinated).

**Concepts to learn**: RAG (Retrieval-Augmented Generation) — retrieve relevant products via the Step 2 vector search, then hand them to Claude as context to generate a grounded answer; function calling (letting the AI trigger real actions, e.g. add-to-cart); reuses the same `pgvector` infrastructure from Step 2.

**Why this order**: Step 2 builds the vector infra Step 3 depends on, so nothing in Step 3 is built twice.

---

## Portfolio pitch (once all 3 are live)

"I built three AI features end-to-end on a live e-commerce site — from a single LLM API call, through embeddings-based semantic search, to a full RAG shopping assistant — covering LLM integration, vector databases, and retrieval-augmented generation." Live demo links + this repo double as proof of work for freelance bids.
