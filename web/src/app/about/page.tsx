import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      <section className="bg-brand-cream py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-[1fr_1.2fr]">
          <div className="relative mx-auto aspect-[7/10] w-full max-w-sm overflow-hidden rounded-sm shadow-xl md:mx-0">
            <Image src="/brand/hero-lion.jpeg" alt="Style Route — comfort with character" fill sizes="(max-width: 768px) 90vw, 420px" className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[.2em] text-brand-gold">OUR STORY</p>
            <h1 className="mt-2 text-4xl font-black uppercase leading-none tracking-[-.05em]">The way of<br />comfort.</h1>
            <p className="mt-5 max-w-md leading-7 text-neutral-600">
              Style Route was built on a simple belief: kids should never have to choose between comfort and character. Every piece is designed to survive playground days, family outings, and everything in between — without losing its shape, its color, or its charm.
            </p>
            <p className="mt-4 max-w-md leading-7 text-neutral-600">
              From soft, breathable fabrics to fits that move the way kids do, we obsess over the details so parents don&rsquo;t have to.
            </p>
            <Link href="/#new-arrivals" className="mt-6 inline-flex w-fit items-center gap-2 bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-wider text-white hover:bg-black">
              Shop the collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-8 text-center sm:grid-cols-3">
          {[
            { title: "Comfort-first fabrics", body: "Soft, breathable, and built to move — tested for the playground, not just the photoshoot." },
            { title: "Made to last", body: "Reinforced seams and honest stitching, so pieces survive more than one season of adventure." },
            { title: "Easy on parents", body: "Simple sizing, easy exchanges, and styles that mix and match without a second thought." },
          ].map((item) => (
            <div key={item.title} className="px-4">
              <div className="mx-auto mb-4 flex w-fit text-brand-gold">
                {Array.from({ length: 3 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <h3 className="text-sm font-black uppercase tracking-wide">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-navy py-16 text-center text-white">
        <p className="text-xs font-bold tracking-[.2em] text-brand-gold">GOT QUESTIONS?</p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-[-.03em]">We&rsquo;d love to hear from you</h2>
        <Link href="/contact" className="mt-6 inline-flex items-center gap-2 bg-brand-gold px-6 py-4 text-sm font-black uppercase tracking-wider text-black hover:bg-white">
          Contact us <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
