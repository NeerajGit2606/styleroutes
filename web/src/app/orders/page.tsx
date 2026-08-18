import Link from "next/link";
import { Package } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 py-24 text-center">
      <Package size={40} className="text-neutral-300" />
      <h1 className="text-2xl font-black uppercase tracking-[-.04em]">Order tracking is coming soon</h1>
      <p className="max-w-sm text-sm text-neutral-500">Checkout and order history aren&rsquo;t live yet. For any existing order questions, reach out on the contact page.</p>
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
