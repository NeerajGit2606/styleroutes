import Link from "next/link";
import type { Metadata } from "next";
import { User } from "lucide-react";

export const metadata: Metadata = {
  title: "My Account — StyleRoute",
};

export default function AccountPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 py-24 text-center">
      <User size={40} className="text-neutral-300" />
      <h1 className="text-2xl font-black uppercase tracking-[-.04em]">Accounts are coming soon</h1>
      <p className="max-w-sm text-sm text-neutral-500">Sign-in, order history, and saved addresses are on the way. For now, browse and shop as a guest.</p>
      <Link href="/" className="mt-2 bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
        Continue shopping
      </Link>
    </div>
  );
}
