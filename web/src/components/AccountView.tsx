"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { Heart, Package, ShoppingBag, User } from "lucide-react";
import { EMPTY_PROFILE, PROFILE_STORAGE_KEY, type Profile } from "@/lib/profile";
import { useCart } from "@/context/CartContext";

export function AccountView() {
  const { orders, liked } = useCart();
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    setHasLoaded(true);
  }, []);

  const updateField = (field: keyof Profile) => (event: ChangeEvent<HTMLInputElement>) => {
    setProfile((p) => ({ ...p, [field]: event.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
  };

  if (!hasLoaded) return null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex items-center gap-3">
        <User size={28} className="text-brand-gold" />
        <h1 className="text-3xl font-black uppercase tracking-[-.04em]">My account</h1>
      </div>
      <p className="mt-2 text-sm text-neutral-500">Save your details once so checkout is faster next time. No password needed — this stays saved on this device.</p>

      <div className="mt-9 grid gap-10 md:grid-cols-[1fr_280px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={profile.name} onChange={updateField("name")} full />
          <Field label="Phone number" value={profile.phone} onChange={updateField("phone")} placeholder="10-digit mobile number" />
          <Field label="Email" value={profile.email} onChange={updateField("email")} placeholder="you@example.com" />
          <Field label="Address" value={profile.address} onChange={updateField("address")} full />
          <Field label="City" value={profile.city} onChange={updateField("city")} />
          <Field label="State" value={profile.state} onChange={updateField("state")} />
          <Field label="Pincode" value={profile.pincode} onChange={updateField("pincode")} placeholder="6-digit pincode" />

          <div className="sm:col-span-2">
            <button onClick={handleSave} className="bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
              Save details
            </button>
            {saved && <span className="ml-4 text-xs font-bold text-brand-olive">Saved ✓</span>}
          </div>
        </div>

        <div className="h-fit space-y-3 border border-neutral-200 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Quick links</p>
          <Link href="/orders" className="flex items-center gap-3 text-sm font-bold hover:text-brand-gold">
            <Package size={16} /> Your orders <span className="ml-auto text-neutral-400">{orders.length}</span>
          </Link>
          <Link href="/wishlist" className="flex items-center gap-3 text-sm font-bold hover:text-brand-gold">
            <Heart size={16} /> Wishlist <span className="ml-auto text-neutral-400">{liked.length}</span>
          </Link>
          <Link href="/cart" className="flex items-center gap-3 text-sm font-bold hover:text-brand-gold">
            <ShoppingBag size={16} /> Your bag
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  full,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
      />
    </div>
  );
}
