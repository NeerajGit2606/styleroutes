"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

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

const LOGO_PHASE_MS = 2000;
const SLIDE_MS = 2000;
const TRANSITION_MS = 700;
const EXIT_MS = 600;

const absoluteFill: CSSProperties = { position: "absolute", inset: 0 };

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
  const onLogoPhase = phase === "logo";

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
        backgroundColor: onLogoPhase ? "#ffffff" : "#12181c",
        transition: `background-color ${TRANSITION_MS}ms ease, opacity ${EXIT_MS}ms ease`,
        opacity: phase === "exiting" ? 0 : 1,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          ...absoluteFill,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          opacity: onLogoPhase ? 1 : 0,
          transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
        }}
      >
        <div style={{ animation: "splash-logo-in 1s ease-out forwards" }}>
          <Image src="/brand/logo-square.png" alt="Style Route crest" width={96} height={96} priority style={{ borderRadius: "9999px", display: "block" }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            opacity: 0,
            animation: "splash-text-in .6s ease-out .5s forwards",
          }}
        >
          <span className="font-serif text-2xl font-bold tracking-tight" style={{ color: "#12181c" }}>
            Style Route
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[.3em] text-brand-gold">
            The Way of Comfort
          </span>
        </div>
      </div>

      <div style={{ ...absoluteFill, opacity: onLogoPhase ? 0 : 1, transition: `opacity ${TRANSITION_MS}ms ease-in-out` }}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            style={{
              ...absoluteFill,
              opacity: i === slideIndex ? 1 : 0,
              transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              style={{
                objectFit: "cover",
                animation: "splash-kenburns ease-out forwards",
                animationDuration: `${SLIDE_MS + TRANSITION_MS}ms`,
                animationDelay: `${LOGO_PHASE_MS + i * SLIDE_MS}ms`,
              }}
            />
            <div
              style={{
                ...absoluteFill,
                background: "linear-gradient(to top, rgba(18,24,28,0.8), transparent 55%, rgba(18,24,28,0.2))",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Image
                src="/brand/logo-square.png"
                alt=""
                width={44}
                height={44}
                style={{ borderRadius: "9999px", display: "block" }}
              />
              <span className="font-serif text-lg font-bold tracking-tight text-white">Style Route</span>
              <span className="text-[10px] font-semibold uppercase tracking-[.3em] text-brand-gold">
                The Way of Comfort
              </span>
            </div>
          </div>
        ))}
      </div>

      <span
        style={{ position: "absolute", bottom: 24, right: 24, color: onLogoPhase ? "rgba(18,24,28,0.5)" : "rgba(255,255,255,0.6)", transition: `color ${TRANSITION_MS}ms ease` }}
        className="text-[11px] font-semibold uppercase tracking-widest"
      >
        Tap to skip
      </span>
    </div>
  );
}
