"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { money } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export function OrdersView() {
  const { orders } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Your orders</h1>

      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 py-16 text-center">
          <Package size={40} className="text-neutral-300" />
          <p className="text-sm font-bold text-neutral-500">No orders yet — once you check out, they&rsquo;ll show up here.</p>
          <Link href="/" className="mt-2 bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-9 space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-neutral-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Order {order.id}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className="rounded-full bg-brand-cream px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-navy">
                  Awaiting confirmation
                </span>
              </div>

              <div className="mt-4 divide-y">
                {order.items.map((line, index) => (
                  <div key={`${line.product.id}-${line.size}-${index}`} className="flex gap-4 py-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden">
                      <Image src={line.product.image} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-bold">{line.product.name}</p>
                      <p className="text-xs text-neutral-500">Size {line.size} · Qty {line.quantity}</p>
                    </div>
                    <span className="text-sm font-black">{money(line.product.price * line.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-sm font-bold">
                <span>Total</span>
                <span>{money(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
