"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { money } from "@/lib/products";

const STATUSES = ["Awaiting confirmation", "Confirmed", "Shipped", "Delivered", "Cancelled"];

type OrderItem = { product: { name: string; price: number }; size: string; quantity: number };
type OrderCustomer = { name: string; phone: string; address: string; city: string; state: string; pincode: string };

export function AdminOrderRow({
  id,
  orderNumber,
  createdAt,
  items,
  customer,
  total,
  status,
}: {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  customer: OrderCustomer;
  total: number;
  status: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const updateStatus = async (next: string) => {
    setSaving(true);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    router.refresh();
  };

  const deleteOrder = async () => {
    if (!confirm(`Delete order ${orderNumber}? This can't be undone.`)) return;
    setSaving(true);
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="border border-neutral-200 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Order {orderNumber}</p>
          <p className="mt-1 text-xs text-neutral-500">
            {new Date(createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            disabled={saving}
            onChange={(event) => updateStatus(event.target.value)}
            className="border border-neutral-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
          >
            {STATUSES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button
            onClick={deleteOrder}
            disabled={saving}
            aria-label="Delete order"
            className="grid h-8 w-8 place-items-center text-neutral-400 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_260px]">
        <div className="divide-y divide-neutral-100">
          {items.map((line, index) => (
            <div key={index} className="flex items-center justify-between py-2 text-sm">
              <span>{line.product.name} <span className="text-neutral-400">(Size {line.size} · Qty {line.quantity})</span></span>
              <span className="font-bold">{money(line.product.price * line.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 text-sm font-black">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>

        <div className="border border-neutral-100 bg-neutral-50 p-3 text-xs text-neutral-600">
          <p className="font-bold text-black">{customer.name}</p>
          <p className="mt-1">{customer.phone}</p>
          <p className="mt-1">{customer.address}, {customer.city}, {customer.state} - {customer.pincode}</p>
        </div>
      </div>
    </div>
  );
}
