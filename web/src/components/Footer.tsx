"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { SocialIcon } from "@/components/SocialIcon";
import { BrandMark } from "@/components/BrandMark";
import { SOCIAL_LINKS } from "@/lib/config";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Track Order", href: "/orders" },
      { label: "My Account", href: "/account" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Policy",
    links: [
      { label: "Privacy Policy", href: "/policy/privacy" },
      { label: "Return & Exchange Policy", href: "/policy/returns" },
      { label: "Terms & Conditions", href: "/policy/terms" },
      { label: "Shipping Policy", href: "/policy/shipping" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Newborn", href: "/newborn" },
      { label: "Toddler", href: "/toddler" },
      { label: "Kids", href: "/kids" },
      { label: "Looks", href: "/looks" },
    ],
  },
];

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer className="relative mt-16 overflow-hidden bg-brand-navy text-white">
      <BrandMark
        size={260}
        className="pointer-events-none absolute -bottom-16 -right-16 text-white opacity-5"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 md:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide">{column.title}</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide">
            Subscribe and Enjoy Shopping
          </h3>
          <p className="mb-4 text-sm text-neutral-300">
            Sign up and be the first to know about new collections, campaigns, sale and more.
          </p>
          {subscribed ? (
            <p className="border-b border-neutral-500 pb-2 text-sm font-bold text-brand-gold">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border-b border-neutral-500 pb-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full bg-transparent text-sm placeholder:text-neutral-500 focus:outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="text-brand-gold">
                →
              </button>
            </form>
          )}

          <div className="mt-8 flex gap-4">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Style Route on Facebook" className="hover:text-brand-gold">
              <SocialIcon name="facebook" />
            </a>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" aria-label="Style Route on X" className="hover:text-brand-gold">
              <SocialIcon name="twitter" />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Style Route on Instagram" className="hover:text-brand-gold">
              <SocialIcon name="instagram" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-x-3 border-t border-white/10 px-4 py-4 text-center text-xs text-neutral-400">
        <span>© {new Date().getFullYear()} Style Route. All rights reserved.</span>
        <Link href="/admin/login" className="text-neutral-500 hover:text-brand-gold">
          Admin
        </Link>
      </div>
    </footer>
  );
}
