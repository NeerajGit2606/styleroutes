import { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { CategoryGrid } from "@/components/CategoryGrid";

export const metadata: Metadata = {
  title: "Baby Boy Clothing (6-24 Months) — StyleRoute",
  description: "Soft, comfortable rompers, onesies, and everyday wear for baby boys aged 6-24 months.",
};

// Product list is admin-editable, so this can't be statically generated.
export const dynamic = "force-dynamic";

export default async function BabyBoyPage() {
  const products = await db.product.findMany({ where: { ageGroup: "Baby Boy" }, orderBy: { id: "asc" } });

  return (
    <Suspense>
      <CategoryGrid title="Baby Boy" tag="6-24 Months" products={products.map(serializeProduct)} />
    </Suspense>
  );
}
