import Link from "next/link";
import type { Metadata } from "next";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "My Orders — StyleRoute",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 py-24 text-center">
      <Package size={40} className="text-neutral-300" />
      <h1 className="text-2xl font-black uppercase tracking-[-.04em]">Order history is coming soon</h1>
      <p className="max-w-sm text-sm text-neutral-500">
        You can place an order any time from your bag — we&rsquo;ll confirm it with you over WhatsApp.
        A dedicated order-tracking page is on the way. For any existing order questions, reach out on the contact page.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/" className="bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
          Continue shopping
        </Link>
        <Link href="/contact" className="border border-neutral-300 px-6 py-3 text-xs font-black uppercase tracking-wider hover:border-black">
          Contact us
        </Link>
      </div>
    </div>
  );
}
