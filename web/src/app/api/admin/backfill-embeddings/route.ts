import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { backfillMissingEmbeddings } from "@/lib/product-embeddings";

// One-off/occasional admin action — generates embeddings for any product
// that doesn't have one yet (new catalog imports, or the first run after
// this feature shipped).
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await backfillMissingEmbeddings();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Embedding backfill failed", error);
    return NextResponse.json({ error: "Backfill failed" }, { status: 502 });
  }
}
