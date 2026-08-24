"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=1200&q=85",
    alt: "Boy wearing a Style Route graphic tee",
  },
  {
    src: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=85",
    alt: "Kids styled for a weekend outing",
  },
  {
    src: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=85",
    alt: "Boy styled in a smart weekend outfit",
  },
];

const LOGO_PHASE_MS = 1200;
const SLIDE_MS = 700;

type Phase = "logo" | "photos" | "exiting" | "done";

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("logo");
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (phase !== "logo") return;
    const t = setTimeout(() => setPhase("photos"), LOGO_PHASE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "photos") return;
    if (slideIndex >= SLIDES.length - 1) {
      const t = setTimeout(() => setPhase("exiting"), SLIDE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setSlideIndex((i) => i + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [phase, slideIndex]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const t = setTimeout(() => setPhase("done"), 400);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  const skip = () => setPhase((p) => (p === "exiting" ? p : "exiting"));

  return (
    <div
      role="dialog"
      aria-label="Welcome to Style Route"
      onClick={skip}
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center overflow-hidden bg-brand-navy transition-opacity duration-[400ms] ${
        phase === "exiting" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ${
          phase === "logo" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="animate-[splash-logo-in_1s_ease-out_forwards]">
          <Image
            src="/brand/logo-square.png"
            alt="Style Route crest"
            width={96}
            height={96}
            priority
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-center gap-1 opacity-0 animate-[splash-text-in_.6s_ease-out_.5s_forwards]">
          <span className="font-serif text-2xl font-bold tracking-tight text-white">Style Route</span>
          <span className="text-[10px] font-semibold uppercase tracking-[.3em] text-brand-gold">
            The Way of Comfort
          </span>
        </div>
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          phase === "logo" ? "opacity-0" : "opacity-100"
        }`}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === slideIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              className="animate-[splash-kenburns_2.2s_ease-out_forwards] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-brand-navy/20" />
            <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-1.5">
              <Image src="/brand/logo-square.png" alt="" width={40} height={40} className="rounded-full" />
              <span className="font-serif text-lg font-bold tracking-tight text-white">Style Route</span>
            </div>
          </div>
        ))}
      </div>

      <span className="absolute bottom-6 right-6 text-[11px] font-semibold uppercase tracking-widest text-white/60">
        Tap to skip
      </span>
    </div>
  );
}
