import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";

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
        <Link href="/" className="text-2xl font-black tracking-tight">
          STYLE<span className="text-orange-600">ROUTE</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col items-center text-sm font-semibold uppercase tracking-wide text-neutral-900 hover:text-orange-600"
            >
              {link.tag && (
                <span className="mb-1 rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {link.tag}
                </span>
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-neutral-700">
          <Link href="/account" className="flex flex-col items-center text-[11px]">
            <User size={20} />
            My account
          </Link>
          <Link href="/search" className="flex flex-col items-center text-[11px]">
            <Search size={20} />
            Search
          </Link>
          <Link href="/wishlist" className="flex flex-col items-center text-[11px]">
            <Heart size={20} />
            Wishlist
          </Link>
          <Link href="/cart" className="flex flex-col items-center text-[11px]">
            <ShoppingBag size={20} />
            Bag
          </Link>
        </div>
      </div>
    </header>
  );
}
