"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { money } from "@/lib/products";
import type { ApiProduct } from "@/lib/serialize-product";
import { useCart } from "@/context/CartContext";

export function WishlistView({ products }: { products: ApiProduct[] }) {
  const { liked, toggleLike, addToCart } = useCart();
  const items = products.filter((product) => liked.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Your wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 py-16 text-center">
          <Heart size={40} className="text-neutral-300" />
          <p className="text-sm font-bold text-neutral-500">Nothing saved yet — tap the heart on any product to add it here.</p>
          <Link href="/" className="mt-2 bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {items.map((product) => (
            <article key={product.id} className="group">
              <div className="relative aspect-[.78] overflow-hidden bg-neutral-200">
                <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </Link>
                <button
                  onClick={() => toggleLike(product.id)}
                  aria-label="Remove from wishlist"
                  className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white"
                >
                  <Heart size={16} fill="#e66855" className="text-[#e66855]" />
                </button>
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-0 left-0 right-0 z-10 bg-black py-3 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Add to bag
                </button>
              </div>
              <Link href={`/product/${product.id}`} className="block pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{product.category}</p>
                <h3 className="mt-1 text-sm font-bold">{product.name}</h3>
                <div className="mt-2 flex gap-2 text-sm font-black">
                  <span>{money(product.price)}</span>
                  {product.oldPrice && <span className="font-normal text-neutral-400 line-through">{money(product.oldPrice)}</span>}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
