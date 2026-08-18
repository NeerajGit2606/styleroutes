"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { PRODUCTS, money } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((item) => item.id === Number(id));
  const { liked, toggleLike, addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <nav className="mb-8 text-xs font-bold uppercase tracking-widest text-neutral-500">
        <Link href="/" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <span>{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[.85] overflow-hidden bg-neutral-200">
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          {product.badge && <span className="absolute left-4 top-4 bg-white px-2 py-1 text-[10px] font-black tracking-wider">{product.badge}</span>}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-gold">{product.category}</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-[-.04em]">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-brand-gold">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            <span className="text-xs font-bold text-neutral-500">(128 reviews)</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-black">{money(product.price)}</span>
            {product.oldPrice && <span className="text-base font-normal text-neutral-400 line-through">{money(product.oldPrice)}</span>}
          </div>

          <p className="mt-6 max-w-md leading-7 text-neutral-600">{product.description}</p>

          <div className="mt-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest">Select size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold ${selectedSize === size ? "border-black bg-black text-white" : "border-neutral-300 text-neutral-700 hover:border-black"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => addToCart(product, selectedSize)}
              className="flex flex-1 items-center justify-center gap-2 bg-black py-4 text-sm font-black uppercase tracking-wider text-white hover:bg-neutral-800"
            >
              <ShoppingBag size={18} /> Add to bag
            </button>
            <button
              onClick={() => toggleLike(product.id)}
              aria-label="Add to wishlist"
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-neutral-300 hover:border-black"
            >
              <Heart size={20} fill={liked.includes(product.id) ? "#e66855" : "none"} className={liked.includes(product.id) ? "text-[#e66855]" : "text-black"} />
            </button>
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-neutral-500">Free shipping on orders above ₹999 · Easy 7-day exchange</p>
        </div>
      </div>
    </div>
  );
}
