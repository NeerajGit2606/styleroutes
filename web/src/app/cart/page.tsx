"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { money } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, total } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Your bag ({cart.length})</h1>

      {cart.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 py-16 text-center">
          <ShoppingBag size={40} className="text-neutral-300" />
          <p className="text-sm font-bold text-neutral-500">Your bag is waiting for a great look.</p>
          <Link href="/" className="mt-2 bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-9 grid gap-10 md:grid-cols-[1fr_320px]">
          <div className="divide-y">
            {cart.map((product, index) => (
              <div className="flex gap-4 py-5" key={`${product.id}-${index}`}>
                <div className="relative h-28 w-24 shrink-0 overflow-hidden">
                  <Image src={product.image} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-neutral-500">SIZE 8–9Y</p>
                  <h3 className="mt-1 text-sm font-bold">{product.name}</h3>
                  <p className="mt-2 font-black">{money(product.price)}</p>
                </div>
                <button onClick={() => removeFromCart(index)} className="self-start text-xs underline">Remove</button>
              </div>
            ))}
          </div>

          <div className="h-fit border border-neutral-200 p-6">
            <div className="mb-4 flex justify-between font-bold">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <button className="w-full bg-brand-gold py-4 text-sm font-black uppercase tracking-wider">Proceed to checkout</button>
            <p className="mt-3 text-center text-xs text-neutral-500">Secure checkout comes in the next phase.</p>
          </div>
        </div>
      )}
    </div>
  );
}
