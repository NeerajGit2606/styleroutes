import type { ReactNode } from "react";

export function PolicyPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">{title}</h1>
      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-400">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
      <div className="prose-policy mt-8 space-y-6 text-sm leading-7 text-neutral-700">{children}</div>
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-black uppercase tracking-wide text-black">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
