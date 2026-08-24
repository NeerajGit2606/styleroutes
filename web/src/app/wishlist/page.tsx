import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { WishlistView } from "@/components/WishlistView";

// Product list is admin-editable, so this can't be statically generated.
export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const products = await db.product.findMany({ orderBy: { id: "asc" } });
  return <WishlistView products={products.map(serializeProduct)} />;
}
