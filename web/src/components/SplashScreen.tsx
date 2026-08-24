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

const SLIDE_MS = 2000;
const TRANSITION_MS = 700;
const EXIT_MS = 600;

type Phase = "photos" | "exiting" | "done";

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("photos");
  const [slideIndex, setSlideIndex] = useState(0);

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
    const t = setTimeout(() => setPhase("done"), EXIT_MS);
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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#12181c",
        opacity: phase === "exiting" ? 0 : 1,
        transition: `opacity ${EXIT_MS}ms ease`,
        cursor: "pointer",
      }}
    >
      <div className="absolute inset-0">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              transitionDuration: `${TRANSITION_MS}ms`,
              opacity: i === slideIndex ? 1 : 0,
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
              style={{
                animation: "splash-kenburns ease-out forwards",
                animationDuration: `${SLIDE_MS + TRANSITION_MS}ms`,
                animationDelay: `${i * SLIDE_MS}ms`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-brand-navy/20" />
            <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-1.5">
              <Image src="/brand/logo-square.png" alt="" width={44} height={44} className="rounded-full" />
              <span className="font-serif text-lg font-bold tracking-tight text-white">Style Route</span>
              <span className="text-[10px] font-semibold uppercase tracking-[.3em] text-brand-gold">
                The Way of Comfort
              </span>
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
