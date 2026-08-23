"use client";

import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function AddedToast() {
  const { toast } = useCart();

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center transition-all duration-300 ${
        toast ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      {toast && (
        <div className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xl">
          <Check size={14} className="text-brand-gold" />
          {toast}
        </div>
      )}
    </div>
  );
}
