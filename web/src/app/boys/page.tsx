import { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { CategoryGrid } from "@/components/CategoryGrid";

export const metadata: Metadata = {
  title: "Boys Clothing (2-16 Yrs) — StyleRoute",
  description: "Shop comfortable, stylish clothing for boys aged 2-16 years at StyleRoute.",
};

// Product list is admin-editable, so this can't be statically generated.
export const dynamic = "force-dynamic";

export default async function BoysPage() {
  const products = await db.product.findMany({ where: { ageGroup: "Boys" }, orderBy: { id: "asc" } });

  return (
    <Suspense>
      <CategoryGrid title="Boys" tag="2-16 Yrs" products={products.map(serializeProduct)} />
    </Suspense>
  );
}
