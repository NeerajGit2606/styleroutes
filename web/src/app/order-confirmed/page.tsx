import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmedPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
      <CheckCircle2 size={48} className="text-brand-gold" />
      <h1 className="text-2xl font-black uppercase tracking-[-.04em]">Order request sent</h1>
      <p className="text-sm text-neutral-600">
        We&rsquo;ve opened WhatsApp with your order details — send that message to confirm.
        Our team will get back to you shortly to confirm delivery and payment.
      </p>
      <Link href="/" className="mt-2 bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
        Continue shopping
      </Link>
    </div>
  );
}
