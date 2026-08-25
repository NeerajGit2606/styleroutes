import { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { CategoryGrid } from "@/components/CategoryGrid";

export const metadata: Metadata = {
  title: "Kids Clothing (4-14 Yrs) — StyleRoute",
  description: "Shop comfortable, stylish clothing for kids aged 4-14 years at StyleRoute.",
};

// Product list is admin-editable, so this can't be statically generated.
export const dynamic = "force-dynamic";

export default async function KidsPage() {
  const products = await db.product.findMany({ where: { ageGroup: "Kids" }, orderBy: { id: "asc" } });

  return (
    <Suspense>
      <CategoryGrid title="Kids" tag="4-14 Yrs" products={products.map(serializeProduct)} />
    </Suspense>
  );
}
