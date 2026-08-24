import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminNav } from "@/components/AdminNav";
import { ProductForm } from "@/components/ProductForm";

export const metadata: Metadata = {
  title: "Admin — Add Product — StyleRoute",
};

export default async function NewProductPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <AdminNav active="products" />
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Add product</h1>
      <ProductForm />
    </div>
  );
}
