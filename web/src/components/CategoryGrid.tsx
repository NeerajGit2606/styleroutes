"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { PRODUCTS, money, type AgeGroup } from "@/lib/products";
import { useCart } from "@/context/CartContext";

type Sort = "featured" | "price-asc" | "price-desc";

export function CategoryGrid({ title, tag, ageGroup }: { title: string; tag: string; ageGroup: AgeGroup }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "All";
  const [sort, setSort] = useState<Sort>("featured");
  const { liked, toggleLike, addToCart } = useCart();

  const ageGroupProducts = useMemo(() => PRODUCTS.filter((product) => product.ageGroup === ageGroup), [ageGroup]);

  const filters = useMemo(() => ["All", ...new Set(ageGroupProducts.map((product) => product.category))], [ageGroupProducts]);

  const products = useMemo(() => {
    const filtered = categoryFromUrl === "All" ? ageGroupProducts : ageGroupProducts.filter((product) => product.category === categoryFromUrl);
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [ageGroupProducts, categoryFromUrl, sort]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <nav className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
        <Link href="/" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black">{title}</span>
      </nav>

      <div className="mb-9 flex items-baseline gap-3">
        <h1 className="text-3xl font-black uppercase tracking-[-.04em]">{title}</h1>
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{tag}</span>
      </div>

      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Link
              key={filter}
              href={filter === "All" ? pathname : `${pathname}?category=${encodeURIComponent(filter)}`}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${categoryFromUrl === filter ? "bg-black text-white" : "bg-neutral-100 text-neutral-600"}`}
            >
              {filter}
            </Link>
          ))}
        </div>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as Sort)}
          className="w-fit border border-neutral-300 px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-sm font-bold text-neutral-500">No products found in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {products.map((product) => (
            <article key={product.id} className="group">
              <div className="relative aspect-[.78] overflow-hidden bg-neutral-200">
                <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </Link>
                {product.badge && <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-black tracking-wider">{product.badge}</span>}
                <button
                  onClick={(event) => { event.preventDefault(); toggleLike(product.id); }}
                  aria-label="Add to wishlist"
                  className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white"
                >
                  <Heart size={16} fill={liked.includes(product.id) ? "#e66855" : "none"} className={liked.includes(product.id) ? "text-[#e66855]" : "text-black"} />
                </button>
                <button
                  onClick={(event) => { event.preventDefault(); addToCart(product); }}
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
