"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, money } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, setQuantity, total } = useCart();
  const shipping = total === 0 || total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">
        Your bag ({cart.reduce((count, line) => count + line.quantity, 0)})
      </h1>

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
            {cart.map((line, index) => (
              <div className="flex gap-4 py-5" key={`${line.product.id}-${line.size}-${index}`}>
                <div className="relative h-28 w-24 shrink-0 overflow-hidden">
                  <Image src={line.product.image} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-neutral-500">SIZE {line.size}</p>
                  <h3 className="mt-1 text-sm font-bold">{line.product.name}</h3>
                  <p className="mt-2 font-black">{money(line.product.price)}</p>

                  <div className="mt-3 inline-flex items-center gap-3 border border-neutral-300 px-2 py-1">
                    <button
                      onClick={() => setQuantity(index, line.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="text-neutral-500 hover:text-black"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-sm font-bold">{line.quantity}</span>
                    <button
                      onClick={() => setQuantity(index, line.quantity + 1)}
                      aria-label="Increase quantity"
                      className="text-neutral-500 hover:text-black"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(index)} className="self-start text-xs underline">Remove</button>
              </div>
            ))}
          </div>

          <div className="h-fit border border-neutral-200 p-6">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-neutral-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : money(shipping)}</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-bold">
              <span>Total</span>
              <span>{money(total + shipping)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-5 block w-full bg-brand-gold py-4 text-center text-sm font-black uppercase tracking-wider hover:bg-black hover:text-white"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
