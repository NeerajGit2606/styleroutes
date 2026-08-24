"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ApiProduct } from "@/lib/serialize-product";

type FormState = {
  name: string;
  category: string;
  ageGroup: "Boys" | "Baby Boy";
  price: string;
  oldPrice: string;
  image: string;
  badge: string;
  description: string;
  sizes: string;
};

const toFormState = (product?: ApiProduct): FormState => ({
  name: product?.name ?? "",
  category: product?.category ?? "",
  ageGroup: (product?.ageGroup as FormState["ageGroup"]) ?? "Boys",
  price: product ? String(product.price) : "",
  oldPrice: product?.oldPrice != null ? String(product.oldPrice) : "",
  image: product?.image ?? "",
  badge: product?.badge ?? "",
  description: product?.description ?? "",
  sizes: product ? product.sizes.join(", ") : "",
});

export function ProductForm({ product }: { product?: ApiProduct }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(product));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    if (sizes.length === 0) {
      setError("Add at least one size, separated by commas.");
      return;
    }
    const price = Number(form.price);
    if (!price || price <= 0) {
      setError("Enter a valid price.");
      return;
    }

    setSaving(true);
    const body = {
      name: form.name.trim(),
      category: form.category.trim(),
      ageGroup: form.ageGroup,
      price,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      image: form.image.trim(),
      badge: form.badge.trim() || undefined,
      description: form.description.trim(),
      sizes,
    };

    const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Something went wrong saving the product.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-9 max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" value={form.name} onChange={updateField("name")} full />
        <TextField label="Category" value={form.category} onChange={updateField("category")} placeholder="T-Shirts, Shorts, Onesies…" />
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500">Age group</label>
          <select
            value={form.ageGroup}
            onChange={updateField("ageGroup")}
            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="Boys">Boys</option>
            <option value="Baby Boy">Baby Boy</option>
          </select>
        </div>
        <TextField label="Price (₹)" type="number" value={form.price} onChange={updateField("price")} />
        <TextField label="Old price (₹, optional)" type="number" value={form.oldPrice} onChange={updateField("oldPrice")} />
        <TextField label="Badge (optional)" value={form.badge} onChange={updateField("badge")} placeholder="NEW, BESTSELLER…" />
        <TextField label="Image URL" value={form.image} onChange={updateField("image")} full placeholder="https://…" />
        <TextField label="Sizes (comma-separated)" value={form.sizes} onChange={updateField("sizes")} full placeholder="2-3Y, 4-5Y, 6-7Y" />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500">Description</label>
        <textarea
          value={form.description}
          onChange={updateField("description")}
          rows={4}
          className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>

      {error && <p className="text-xs font-bold text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {saving ? "Saving…" : product ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  full,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
      />
    </div>
  );
}
