import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { ProductView } from "@/components/ProductView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((item) => item.id === Number(id));
  return {
    title: product ? `${product.name} — StyleRoute` : "Product — StyleRoute",
    description: product?.description,
  };
}

export default function ProductPage() {
  return <ProductView />;
}
