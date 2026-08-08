import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

const NAV_LINKS = [
  { label: "Boys", href: "/boys", tag: "2-16 Yrs" },
  { label: "Baby Boy", href: "/baby-boy", tag: "6-24 Months" },
  { label: "Looks", href: "/looks" },
  { label: "About", href: "/about" },
];

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <BrandMark size={36} className="shrink-0 text-brand-navy" />
          <span className="flex flex-col leading-none">
            <span className="whitespace-nowrap font-serif text-lg font-bold tracking-tight text-brand-navy sm:text-2xl">
              Style Route
            </span>
            <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[.2em] text-brand-gold sm:block">
              The Way of Comfort
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col items-center text-sm font-semibold uppercase tracking-wide text-neutral-900 hover:text-brand-gold"
            >
              {link.tag && (
                <span className="mb-1 rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-bold text-white">
                  {link.tag}
                </span>
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 text-neutral-700 sm:gap-5">
          <Link href="/account" className="flex flex-col items-center text-[11px]">
            <User size={20} />
            <span className="hidden sm:block">My account</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center text-[11px]">
            <Search size={20} />
            <span className="hidden sm:block">Search</span>
          </Link>
          <Link href="/wishlist" className="flex flex-col items-center text-[11px]">
            <Heart size={20} />
            <span className="hidden sm:block">Wishlist</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center text-[11px]">
            <ShoppingBag size={20} />
            <span className="hidden sm:block">Bag</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
