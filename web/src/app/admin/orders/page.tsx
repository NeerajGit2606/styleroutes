import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Package } from "lucide-react";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminOrderRow } from "@/components/AdminOrderRow";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export const metadata: Metadata = {
  title: "Admin — Orders — StyleRoute",
};

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-[-.04em]">All orders</h1>
          <p className="mt-1 text-sm text-neutral-500">{orders.length} order{orders.length === 1 ? "" : "s"} total</p>
        </div>
        <AdminLogoutButton />
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
          <Package size={40} className="text-neutral-300" />
          <p className="text-sm font-bold text-neutral-500">No orders placed yet.</p>
        </div>
      ) : (
        <div className="mt-9 space-y-6">
          {orders.map((order) => (
            <AdminOrderRow
              key={order.id}
              id={order.id}
              orderNumber={order.orderNumber}
              createdAt={order.createdAt.toISOString()}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              items={order.items as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              customer={order.customer as any}
              total={Number(order.total)}
              status={order.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
