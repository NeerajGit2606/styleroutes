import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { HomeView } from "@/components/HomeView";

// Product list is admin-editable, so this can't be statically generated
// at build time — it has to reflect the database on every request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const newArrivals = await db.product.findMany({ where: { ageGroup: "Boys" }, orderBy: { id: "asc" } });

  return <HomeView newArrivals={newArrivals.map(serializeProduct)} />;
}
