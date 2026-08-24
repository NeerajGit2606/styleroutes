import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { serializeProduct } from "@/lib/serialize-product";
import { AdminNav } from "@/components/AdminNav";
import { ProductForm } from "@/components/ProductForm";

export const metadata: Metadata = {
  title: "Admin — Edit Product — StyleRoute",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const product = await db.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <AdminNav active="products" />
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Edit product</h1>
      <ProductForm product={serializeProduct(product)} />
    </div>
  );
}
