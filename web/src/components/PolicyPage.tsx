import Link from "next/link";
import { FileText } from "lucide-react";

export function PolicyPage({ title }: { title: string }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-5 py-24 text-center">
      <FileText size={40} className="text-neutral-300" />
      <h1 className="text-2xl font-black uppercase tracking-[-.04em]">{title}</h1>
      <p className="max-w-md text-sm text-neutral-500">This policy is being finalized. In the meantime, reach out to us directly and we&rsquo;ll help with any questions.</p>
      <Link href="/contact" className="mt-2 bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
        Contact us
      </Link>
    </div>
  );
}
