import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
      <Compass size={44} className="text-neutral-300" />
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Page not found</h1>
      <p className="text-sm text-neutral-500">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Link href="/" className="mt-2 bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
        Back to home
      </Link>
    </div>
  );
}
