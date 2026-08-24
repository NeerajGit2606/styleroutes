import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { ProductView } from "@/components/ProductView";

// Product data is admin-editable, so this can't be statically generated.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id: Number(id) } });
  return {
    title: product ? `${product.name} — StyleRoute` : "Product — StyleRoute",
    description: product?.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  return <ProductView product={serializeProduct(product)} />;
}
