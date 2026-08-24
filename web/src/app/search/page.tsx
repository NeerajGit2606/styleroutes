import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { SearchView } from "@/components/SearchView";

// Product list is admin-editable, so this can't be statically generated.
export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const products = await db.product.findMany({ orderBy: { id: "asc" } });
  return <SearchView products={products.map(serializeProduct)} />;
}
