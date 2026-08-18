import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS, money, photo } from "@/lib/products";

export const metadata: Metadata = {
  title: "Looks — StyleRoute",
  description: "Curated outfit ideas, put together piece by piece so you don't have to.",
};

const LOOKS = [
  {
    title: "The Weekend Roam",
    image: photo("photo-1522771930-78848d9293e8"),
    productIds: [1, 2],
  },
  {
    title: "Smart-Casual School Run",
    image: photo("photo-1516627145497-ae6968895b74"),
    productIds: [3, 4],
  },
  {
    title: "Playground Ready",
    image: photo("photo-1517457373958-b7bdd4587205"),
    productIds: [1, 4],
  },
];

export default function LooksPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-xs font-bold tracking-[.2em] text-brand-gold">THE EDIT</p>
      <h1 className="mt-2 text-3xl font-black uppercase tracking-[-.04em]">Looks</h1>
      <p className="mt-3 max-w-md text-neutral-600">Curated outfit ideas, put together piece by piece so you don&rsquo;t have to.</p>

      <div className="mt-10 grid gap-12 md:grid-cols-3">
        {LOOKS.map((look) => {
          const items = PRODUCTS.filter((product) => look.productIds.includes(product.id));
          return (
            <div key={look.title}>
              <div className="relative aspect-[.8] overflow-hidden">
                <Image src={look.image} alt={look.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <h2 className="mt-4 text-lg font-black uppercase tracking-[-.02em]">{look.title}</h2>
              <ul className="mt-3 space-y-2">
                {items.map((product) => (
                  <li key={product.id}>
                    <Link href={`/product/${product.id}`} className="flex items-center justify-between border-b border-neutral-200 py-2 text-sm hover:text-brand-gold">
                      <span className="font-bold">{product.name}</span>
                      <span className="text-neutral-500">{money(product.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
