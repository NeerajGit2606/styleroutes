"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const DISMISSED_KEY = "sr_enquiry_dismissed";
const OPEN_DELAY_MS = 800;

export function EnquiryModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const location = useRef<{ latitude: number; longitude: number } | null>(null);

  const skip = pathname?.startsWith("/admin");

  useEffect(() => {
    if (skip) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Asking for location here (rather than only on submit) is what
    // triggers the browser's native "share your location" permission
    // prompt as soon as the enquiry card appears, not buried in a click.
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        location.current = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      },
      () => {},
      { timeout: 8000 },
    );

    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [skip]);

  const dismiss = () => {
    setOpen(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !contact.trim()) {
      setError("Please share your name and a way to reach you.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          message: message.trim() || undefined,
          ...location.current,
        }),
      });
      if (!res.ok) throw new Error();

      setSubmitted(true);
      localStorage.setItem(DISMISSED_KEY, "1");
      setTimeout(() => setOpen(false), 1800);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || skip) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4" onClick={dismiss}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-sm bg-white p-7 shadow-2xl"
      >
        <button onClick={dismiss} aria-label="Close" className="absolute right-4 top-4 text-neutral-400 hover:text-black">
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <p className="text-lg font-black uppercase tracking-tight">Thank you!</p>
            <p className="mt-2 text-sm text-neutral-500">We&apos;ve got your details and will be in touch soon.</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold tracking-[.2em] text-brand-gold">GET IN TOUCH</p>
            <h2 className="mt-2 text-2xl font-black uppercase leading-none tracking-[-.03em]">
              Let&apos;s stay<br />in touch
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Share your details and we&apos;ll reach out with the latest drops and offers.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="Phone or email"
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="What are you looking for? (optional)"
                rows={2}
                className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />

              {error && <p className="text-xs font-bold text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-gold py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-black hover:text-white disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Submit"}
              </button>
              <button type="button" onClick={dismiss} className="w-full text-center text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black">
                Maybe later
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
