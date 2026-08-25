import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { HomeView } from "@/components/HomeView";

// Product list is admin-editable, so this can't be statically generated
// at build time — it has to reflect the database on every request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const newArrivals = await db.product.findMany({ orderBy: { createdAt: "desc" }, take: 12 });

  return <HomeView newArrivals={newArrivals.map(serializeProduct)} />;
}
