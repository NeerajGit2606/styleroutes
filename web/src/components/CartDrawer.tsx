"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { money } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { cart, bagOpen, setBagOpen, removeFromCart, total } = useCart();
  const itemCount = cart.reduce((count, line) => count + line.quantity, 0);

  return (
    <>
      {cart.length > 0 && !bagOpen && (
        <button
          onClick={() => setBagOpen(true)}
          className="fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full bg-black px-5 py-4 text-sm font-bold text-white shadow-xl"
        >
          <ShoppingBag size={18} /> Bag ({itemCount}) <span className="text-brand-gold">{money(total)}</span>
        </button>
      )}

      {bagOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setBagOpen(false)}>
          <aside
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b pb-5">
              <h2 className="text-xl font-black uppercase">Your bag ({itemCount})</h2>
              <button onClick={() => setBagOpen(false)} aria-label="Close bag">
                <X />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="grid flex-1 place-items-center font-bold">Your bag is waiting for a great look.</div>
            ) : (
              <>
                <div className="flex-1 divide-y overflow-auto">
                  {cart.map((line, index) => (
                    <div className="flex gap-4 py-4" key={`${line.product.id}-${line.size}-${index}`}>
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden">
                        <Image src={line.product.image} alt="" fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-neutral-500">SIZE {line.size} · QTY {line.quantity}</p>
                        <h3 className="mt-1 text-sm font-bold">{line.product.name}</h3>
                        <p className="mt-2 font-black">{money(line.product.price * line.quantity)}</p>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-xs underline">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-5">
                  <div className="mb-4 flex justify-between font-bold">
                    <span>Subtotal</span>
                    <span>{money(total)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setBagOpen(false)}
                    className="block w-full bg-brand-gold py-4 text-center text-sm font-black uppercase tracking-wider hover:bg-black hover:text-white"
                  >
                    Proceed to checkout
                  </Link>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
