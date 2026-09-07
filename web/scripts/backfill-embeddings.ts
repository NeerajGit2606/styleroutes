import "dotenv/config";
import { db } from "../src/lib/db";
import { backfillMissingEmbeddings } from "../src/lib/product-embeddings";

backfillMissingEmbeddings()
  .then((result) => console.log(`Backfilled ${result.updated} product(s).`))
  .catch((err) => {
    console.error("FAILED:", err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
