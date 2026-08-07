import Link from "next/link";
import { SocialIcon } from "@/components/SocialIcon";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Track Order", href: "/orders" },
      { label: "Return & Exchange", href: "/policy/returns" },
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
      { label: "Boys", href: "/boys" },
      { label: "Baby Boy", href: "/baby-boy" },
      { label: "Looks", href: "/looks" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 md:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide">{column.title}</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
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
          <form className="flex border-b border-neutral-500 pb-2">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-transparent text-sm placeholder:text-neutral-500 focus:outline-none"
            />
            <button type="submit" aria-label="Subscribe" className="text-white">
              →
            </button>
          </form>

          <div className="mt-8 flex gap-4">
            <SocialIcon name="facebook" />
            <SocialIcon name="twitter" />
            <SocialIcon name="instagram" />
            <SocialIcon name="linkedin" />
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 px-4 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} StyleRoute. All rights reserved.
      </div>
    </footer>
  );
}
