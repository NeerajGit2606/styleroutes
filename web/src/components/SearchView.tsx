"use client";

import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { money } from "@/lib/products";
import type { ApiProduct } from "@/lib/serialize-product";

export function SearchView({ products }: { products: ApiProduct[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return products.filter((product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term));
  }, [query, products]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Search</h1>

      <div className="mt-6 flex items-center gap-3 border-b border-neutral-300 pb-3">
        <SearchIcon size={20} className="text-neutral-400" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for tees, shorts, joggers…"
          className="w-full text-lg outline-none placeholder:text-neutral-400"
        />
      </div>

      {query.trim() && results.length === 0 && (
        <p className="mt-10 text-sm font-bold text-neutral-500">No products found for &ldquo;{query}&rdquo;.</p>
      )}

      {results.length > 0 && (
        <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {results.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group block">
              <div className="relative aspect-[.78] overflow-hidden bg-neutral-200">
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{product.category}</p>
                <h3 className="mt-1 text-sm font-bold">{product.name}</h3>
                <div className="mt-2 text-sm font-black">{money(product.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
