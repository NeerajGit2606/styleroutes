import { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { CategoryGrid } from "@/components/CategoryGrid";

export const metadata: Metadata = {
  title: "Newborn Clothing (0-36 Months) — StyleRoute",
  description: "Soft, comfortable everyday wear for newborns and babies up to 36 months at StyleRoute.",
};

// Product list is admin-editable, so this can't be statically generated.
export const dynamic = "force-dynamic";

export default async function NewbornPage() {
  const products = await db.product.findMany({ where: { ageGroup: "Newborn" }, orderBy: { id: "asc" } });

  return (
    <Suspense>
      <CategoryGrid title="Newborn" tag="0-36 Months" products={products.map(serializeProduct)} />
    </Suspense>
  );
}
