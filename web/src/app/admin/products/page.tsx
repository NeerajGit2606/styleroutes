import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminNav } from "@/components/AdminNav";
import { AdminProductRow } from "@/components/AdminProductRow";

export const metadata: Metadata = {
  title: "Admin — Products — StyleRoute",
};

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const products = await db.product.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <AdminNav active="products" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">{products.length} product{products.length === 1 ? "" : "s"} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-black px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800"
        >
          <Plus size={14} /> Add product
        </Link>
      </div>

      <div className="mt-9 space-y-3">
        {products.map((product) => (
          <AdminProductRow
            key={product.id}
            id={product.id}
            name={product.name}
            category={product.category}
            ageGroup={product.ageGroup}
            price={Number(product.price)}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
