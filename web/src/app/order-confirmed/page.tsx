import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed — StyleRoute",
};

export default async function OrderConfirmedPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
      <CheckCircle2 size={48} className="text-brand-gold" />
      <h1 className="text-2xl font-black uppercase tracking-[-.04em]">Order request sent</h1>
      {order && (
        <p className="rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">Order {order}</p>
      )}
      <p className="text-sm text-neutral-600">
        We&rsquo;ve opened WhatsApp with your order details — send that message to confirm.
        Our team will get back to you shortly to confirm delivery and payment.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/" className="bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
          Continue shopping
        </Link>
        <Link href="/orders" className="border border-neutral-300 px-6 py-3 text-xs font-black uppercase tracking-wider hover:border-black">
          View orders
        </Link>
      </div>
    </div>
  );
}
