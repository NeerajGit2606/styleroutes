import Link from "next/link";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export function AdminNav({ active }: { active: "orders" | "products" }) {
  return (
    <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-4">
      <nav className="flex gap-6">
        <Link
          href="/admin/orders"
          className={`text-xs font-bold uppercase tracking-widest ${active === "orders" ? "text-black" : "text-neutral-400 hover:text-black"}`}
        >
          Orders
        </Link>
        <Link
          href="/admin/products"
          className={`text-xs font-bold uppercase tracking-widest ${active === "products" ? "text-black" : "text-neutral-400 hover:text-black"}`}
        >
          Products
        </Link>
      </nav>
      <AdminLogoutButton />
    </div>
  );
}
