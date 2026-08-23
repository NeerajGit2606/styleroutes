"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, money } from "@/lib/products";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { PROFILE_STORAGE_KEY } from "@/lib/profile";

type FormState = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY_FORM: FormState = { name: "", phone: "", address: "", city: "", state: "", pincode: "" };

// Matches the top-to-bottom order fields appear in the form, so the first
// error found here is also the first one the customer would see on screen.
const FIELD_ORDER: (keyof FormState)[] = ["name", "phone", "pincode", "address", "city", "state"];

export default function CheckoutPage() {
  const { cart, total, placeOrder } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Pre-fill from a saved account profile, if the user set one up earlier —
  // saves them re-typing the same shipping details on their next order.
  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!savedProfile) return;
    const { name, phone, address, city, state, pincode } = JSON.parse(savedProfile);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ name, phone, address, city, state, pincode });
  }, []);

  const shipping = total === 0 || total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = total + shipping;

  const updateField = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: event.target.value }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Required";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) next.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) next.address = "Required";
    if (!form.city.trim()) next.city = "Required";
    if (!form.state.trim()) next.state = "Required";
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = "Enter a valid 6-digit pincode";
    setErrors(next);
    return next;
  };

  const handlePlaceOrder = () => {
    const validationErrors = validate();
    const firstErrorField = FIELD_ORDER.find((field) => validationErrors[field]);
    if (firstErrorField) {
      const el = document.getElementById(`checkout-${firstErrorField}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
      return;
    }

    const { name, phone, address, city, state, pincode } = form;
    const order = placeOrder({ name, phone, address, city, state, pincode }, shipping);

    // Best-effort sync to the admin dashboard's database — the customer's
    // own copy is already safely in localStorage and about to go out over
    // WhatsApp, so a DB hiccup here should never block checkout. `keepalive`
    // is required because router.push below unmounts this page right after —
    // without it, the browser aborts the in-flight request mid-body.
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: order.id,
        items: order.items,
        customer: order.customer,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
      }),
      keepalive: true,
    }).catch(() => {});

    const lines = order.items
      .map((line) => `• ${line.product.name} (Size ${line.size}) x${line.quantity} — ${money(line.product.price * line.quantity)}`)
      .join("\n");
    const message = [
      `New order from StyleRoute website — ${order.id}`,
      "",
      lines,
      "",
      `Subtotal: ${money(order.subtotal)}`,
      `Shipping: ${order.shipping === 0 ? "Free" : money(order.shipping)}`,
      `Total: ${money(order.total)}`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Address: ${address}, ${city}, ${state} - ${pincode}`,
      "",
      "Payment: Cash on Delivery (to be confirmed)",
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    router.push(`/order-confirmed?order=${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 py-24 text-center">
        <ShoppingBag size={40} className="text-neutral-300" />
        <h1 className="text-2xl font-black uppercase tracking-[-.04em]">Your bag is empty</h1>
        <p className="max-w-sm text-sm text-neutral-500">Add something to your bag before checking out.</p>
        <Link href="/" className="mt-2 bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Checkout</h1>

      <div className="mt-9 grid gap-10 md:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest">Shipping details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Full name" value={form.name} onChange={updateField("name")} error={errors.name} full />
            <Field name="phone" label="Phone number" value={form.phone} onChange={updateField("phone")} error={errors.phone} placeholder="10-digit mobile number" />
            <Field name="pincode" label="Pincode" value={form.pincode} onChange={updateField("pincode")} error={errors.pincode} placeholder="6-digit pincode" />
            <Field name="address" label="Address" value={form.address} onChange={updateField("address")} error={errors.address} full />
            <Field name="city" label="City" value={form.city} onChange={updateField("city")} error={errors.city} />
            <Field name="state" label="State" value={form.state} onChange={updateField("state")} error={errors.state} />
          </div>

          <div className="mt-8 border border-neutral-200 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Payment</p>
            <p className="mt-2 text-sm font-bold">Cash on Delivery</p>
            <p className="mt-1 text-xs text-neutral-500">We&rsquo;ll confirm your order and delivery details over WhatsApp after you place it.</p>
          </div>
        </div>

        <div className="h-fit border border-neutral-200 p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest">Order summary</h2>
          <div className="max-h-64 space-y-4 divide-y divide-neutral-100 overflow-auto">
            {cart.map((line, index) => (
              <div key={`${line.product.id}-${line.size}-${index}`} className="flex gap-3 pt-4 first:pt-0">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden">
                  <Image src={line.product.image} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-bold">{line.product.name}</p>
                  <p className="text-xs text-neutral-500">Size {line.size} · Qty {line.quantity}</p>
                </div>
                <span className="text-sm font-black">{money(line.product.price * line.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-neutral-200 pt-4 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : money(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 font-bold">
              <span>Total</span>
              <span>{money(grandTotal)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-5 w-full bg-brand-gold py-4 text-sm font-black uppercase tracking-wider hover:bg-black hover:text-white"
          >
            Place order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  full,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={`checkout-${name}`} className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500">{label}</label>
      <input
        id={`checkout-${name}`}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border px-4 py-3 text-sm outline-none focus:border-black ${error ? "border-red-500" : "border-neutral-300"}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
