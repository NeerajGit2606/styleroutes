"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, photo, money } from "@/lib/products";
import type { ApiProduct } from "@/lib/serialize-product";
import { useCart } from "@/context/CartContext";

type Slide = { eyebrow: string; titleLines: [string, string]; body: string; cta: string; image: string };
const SLIDES: Slide[] = [
  {
    eyebrow: "SUMMER '26",
    titleLines: ["Built for", "big days."],
    body: "Comfort-first kidswear with serious personality. Made for the sprint, the spill, and every story in between.",
    cta: "Shop new arrivals",
    image: photo("photo-1522771930-78848d9293e8"),
  },
  {
    eyebrow: "JUST DROPPED",
    titleLines: ["Play hard.", "Wash easy."],
    body: "Durable fabrics that survive playground days and still look sharp for the family photo.",
    cta: "Explore new arrivals",
    image: photo("photo-1516627145497-ae6968895b74"),
  },
  {
    eyebrow: "THE EDIT",
    titleLines: ["Dressed up,", "not dressed down."],
    body: "Smart-casual pieces that go from the school run to family outings without a wardrobe change.",
    cta: "Shop the edit",
    image: photo("photo-1503919545889-aef636e10ad4"),
  },
];

export function HomeView({ newArrivals }: { newArrivals: ApiProduct[] }) {
  const [active, setActive] = useState("All");
  const [activeSlide, setActiveSlide] = useState(0);
  const { liked, addToCart, toggleLike } = useCart();

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((current) => (current + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const shown = useMemo(() => active === "All" ? newArrivals : newArrivals.filter((item) => item.category === active), [active, newArrivals]);
  return <div className="overflow-hidden">
    <section className="relative min-h-[650px] overflow-hidden bg-neutral-900">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {SLIDES.map((slide, index) => (
          <div key={slide.eyebrow} className="relative min-h-[650px] w-full shrink-0">
            <Image src={slide.image} alt={slide.titleLines.join(" ")} fill priority={index === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
            <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-end px-5 pb-16 md:items-center md:pb-0">
              <div className="max-w-xl text-white">
                <p className="mb-5 flex items-center gap-2 text-xs font-bold tracking-[.24em]"><span className="h-px w-10 bg-brand-gold" /> {slide.eyebrow}</p>
                <h1 className="text-5xl font-black uppercase leading-[.88] tracking-[-.06em] sm:text-7xl">{slide.titleLines[0]}<br />{slide.titleLines[1]}</h1>
                <p className="mt-6 max-w-md text-base leading-7 text-white/85">{slide.body}</p>
                <a href="#new-arrivals" className="mt-8 inline-flex items-center gap-3 bg-brand-gold px-6 py-4 text-sm font-black uppercase tracking-wider text-black hover:bg-white">{slide.cta} <ArrowRight size={17} /></a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 right-5 hidden bg-white px-6 py-4 text-xs font-bold uppercase tracking-widest md:block">Free shipping on orders over ₹999</div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.eyebrow}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${index === activeSlide ? "w-6 bg-brand-gold" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>
    </section>
    <section className="border-b border-neutral-200 bg-white py-6"><div className="mx-auto grid max-w-7xl gap-5 px-5 text-center sm:grid-cols-3">{["Made for movement", "Soft on skin", "Easy 7-day exchange"].map((item, index) => <div key={item} className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest"><span className="grid h-7 w-7 place-items-center rounded-full bg-brand-gold text-[11px]">0{index + 1}</span>{item}</div>)}</div></section>
    <section className="bg-brand-cream py-20"><div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-[1fr_1.2fr]"><div className="relative mx-auto aspect-[7/10] w-full max-w-sm overflow-hidden rounded-sm shadow-xl md:mx-0"><Image src="/brand/hero-lion.jpeg" alt="Style Route campaign — comfort with character" fill sizes="(max-width: 768px) 90vw, 420px" className="object-cover" /></div><div><p className="text-xs font-bold tracking-[.2em] text-brand-gold">THE CAMPAIGN</p><h2 className="mt-2 text-4xl font-black uppercase leading-none tracking-[-.05em]">Comfort,<br />with character.</h2><p className="mt-5 max-w-md leading-7 text-neutral-600">From the studio to the schoolyard, Style Route pieces are built to keep up, look sharp, and feel like home.</p><a href="#new-arrivals" className="mt-6 inline-flex w-fit items-center gap-2 bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-wider text-white hover:bg-black">Explore the collection <ArrowRight size={16} /></a></div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20"><div className="mb-9"><p className="text-xs font-bold tracking-[.2em] text-brand-gold">DRESS THE MOOD</p><h2 className="mt-2 text-3xl font-black uppercase tracking-[-.04em]">Shop by category</h2></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{CATEGORIES.map(([name, image]) => <button key={name} onClick={() => { setActive(name); document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" }); }} className="group relative aspect-[.78] overflow-hidden text-left"><Image src={photo(image)} alt={name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" /><span className="absolute bottom-4 left-4 text-xl font-black uppercase text-white">{name}</span></button>)}</div></section>
    <section id="new-arrivals" className="bg-brand-cream py-20"><div className="mx-auto max-w-7xl px-5"><div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold tracking-[.2em] text-brand-gold">JUST DROPPED</p><h2 className="mt-2 text-3xl font-black uppercase tracking-[-.04em]">New arrivals</h2></div><div className="flex gap-2 overflow-auto">{["All", "T-Shirt", "Shirt", "Shorts", "Pants", "Sets", "Dungaree"].map((category) => <button key={category} onClick={() => setActive(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${active === category ? "bg-black text-white" : "bg-white text-neutral-600"}`}>{category}</button>)}</div></div><div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">{shown.map((product) => <article key={product.id} className="group"><div className="relative aspect-[.78] overflow-hidden bg-neutral-200"><Link href={`/product/${product.id}`} className="absolute inset-0 z-0"><Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" /></Link>{product.badge && <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-black tracking-wider">{product.badge}</span>}<button onClick={(event) => { event.preventDefault(); toggleLike(product.id); }} aria-label="Add to wishlist" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white"><Heart size={16} fill={liked.includes(product.id) ? "#e66855" : "none"} className={liked.includes(product.id) ? "text-[#e66855]" : "text-black"} /></button><button onClick={(event) => { event.preventDefault(); addToCart(product); }} className="absolute bottom-0 left-0 right-0 z-10 bg-black py-3 text-xs font-bold uppercase tracking-wider text-white">Add to bag</button></div><Link href={`/product/${product.id}`} className="block pt-3"><p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{product.category}</p><h3 className="mt-1 text-sm font-bold">{product.name}</h3><div className="mt-2 flex gap-2 text-sm font-black"><span>{money(product.price)}</span>{product.oldPrice && <span className="font-normal text-neutral-400 line-through">{money(product.oldPrice)}</span>}</div></Link></article>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20"><div className="grid gap-9 md:grid-cols-[1fr_1.5fr]"><div className="flex flex-col justify-center"><p className="text-xs font-bold tracking-[.2em] text-brand-gold">FIND THE FIT</p><h2 className="mt-2 text-4xl font-black uppercase leading-none tracking-[-.05em]">Growing up,<br />in style.</h2><p className="mt-5 max-w-sm leading-7 text-neutral-600">Every kid grows differently. Start with their age, discover the styles made to keep up.</p><Link href="/kids" className="mt-6 flex w-fit items-center gap-2 text-sm font-black uppercase tracking-wider hover:text-brand-gold">Shop by age <ArrowRight size={16} /></Link></div><div className="grid grid-cols-3 gap-3">{[["0-36 Months", "photo-1514090458221-65bb69cf63e6", "/newborn"], ["1-5 Yrs", "photo-1516627145497-ae6968895b74", "/toddler"], ["4-14 Yrs", "photo-1519340241574-2cec6aef0c01", "/kids"]].map(([age, image, href]) => <Link key={age} href={href} className="group relative aspect-[.6] overflow-hidden block"><Image src={photo(image)} alt={age} fill sizes="33vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><p className="absolute bottom-3 left-3 text-sm font-black text-white">{age}</p></Link>)}</div></div></section>
    <section className="bg-brand-navy py-20 text-white"><div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-2"><div><p className="text-xs font-bold tracking-[.2em] text-brand-gold">REAL TALK FROM PARENTS</p><blockquote className="mt-5 text-3xl font-semibold leading-tight tracking-[-.04em] md:text-4xl">“The fit is spot-on, the fabric survives playgrounds, and he actually wants to wear it.”</blockquote><div className="mt-7 flex text-brand-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div><p className="mt-2 text-sm font-bold">Riya Mehra <span className="font-normal text-white/60">• Delhi</span></p></div><div className="relative aspect-video overflow-hidden"><Image src={photo("photo-1441974231531-c6227db76b6e")} alt="Kids enjoying an afternoon outdoors" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div></div></section>
  </div>;
}
