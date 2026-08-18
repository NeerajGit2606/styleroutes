"use client";

import Link from "next/link";
import { Heart, Menu, Plus, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const NAV_LINKS = [
  {
    label: "Boys",
    href: "/boys",
    tag: "2-16 Yrs",
    children: ["T-Shirts", "Shirts", "Shorts", "Bottoms"],
  },
  {
    label: "Baby Boy",
    href: "/baby-boy",
    tag: "6-24 Months",
    children: ["Rompers", "Onesies", "Dungarees", "Sleepsuits", "T-Shirts", "Shorts"],
  },
  { label: "Looks", href: "/looks" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setExpandedLabel(null);
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
            <div key={link.href} className="group relative">
              <Link
                href={link.href}
                className="flex flex-col items-center text-sm font-semibold uppercase tracking-wide text-neutral-900 hover:text-brand-gold"
              >
                {link.tag && (
                  <span className="mb-1 rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-bold text-white">
                    {link.tag}
                  </span>
                )}
                {link.label}
              </Link>

              {link.children && (
                <div className="pointer-events-none absolute left-1/2 top-full z-40 w-48 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="flex flex-col divide-y divide-neutral-100 border border-neutral-200 bg-white py-2 shadow-xl">
                    {link.children.map((child) => (
                      <Link
                        key={child}
                        href={`${link.href}?category=${encodeURIComponent(child)}`}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-700 hover:bg-brand-cream hover:text-brand-navy"
                      >
                        {child}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 md:hidden ${mobileMenuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          onClick={closeMenu}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between bg-brand-navy px-5 py-4 text-white">
            <span className="text-sm font-bold uppercase tracking-widest">Menu</span>
            <button type="button" aria-label="Close menu" onClick={closeMenu}>
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col divide-y divide-neutral-200">
            {NAV_LINKS.map((link) => {
              const isExpanded = expandedLabel === link.label;
              return (
                <div key={link.href}>
                  <div className="flex items-center justify-between px-5 py-4">
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-900"
                    >
                      {link.label}
                      {link.tag && (
                        <span className="rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-bold text-white">
                          {link.tag}
                        </span>
                      )}
                    </Link>

                    {link.children && (
                      <button
                        type="button"
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${link.label}`}
                        aria-expanded={isExpanded}
                        onClick={() => setExpandedLabel(isExpanded ? null : link.label)}
                        className="p-1 text-neutral-500"
                      >
                        <Plus
                          size={16}
                          className={`transition-transform duration-200 ${isExpanded ? "rotate-45" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {link.children && (
                    <div
                      className="grid transition-all duration-300 ease-in-out"
                      style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col bg-neutral-50 pb-2">
                          {link.children.map((child) => (
                            <Link
                              key={child}
                              href={`${link.href}?category=${encodeURIComponent(child)}`}
                              onClick={closeMenu}
                              className="px-8 py-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-600"
                            >
                              {child}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
