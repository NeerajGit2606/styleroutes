import { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { CategoryGrid } from "@/components/CategoryGrid";

export const metadata: Metadata = {
  title: "Toddler Clothing (1-5 Yrs) — StyleRoute",
  description: "Comfortable, durable clothing for toddlers aged 1-5 years at StyleRoute.",
};

// Product list is admin-editable, so this can't be statically generated.
export const dynamic = "force-dynamic";

export default async function ToddlerPage() {
  const products = await db.product.findMany({ where: { ageGroup: "Toddler" }, orderBy: { id: "asc" } });

  return (
    <Suspense>
      <CategoryGrid title="Toddler" tag="1-5 Yrs" products={products.map(serializeProduct)} />
    </Suspense>
  );
}
