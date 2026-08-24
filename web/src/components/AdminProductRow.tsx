"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { money } from "@/lib/products";

export function AdminProductRow({
  id,
  name,
  category,
  ageGroup,
  price,
  image,
}: {
  id: number;
  name: string;
  category: string;
  ageGroup: string;
  price: number;
  image: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4 border border-neutral-200 p-4">
      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-neutral-100">
        <Image src={image} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-bold">{name}</p>
        <p className="text-xs text-neutral-500">{ageGroup} · {category}</p>
      </div>
      <span className="text-sm font-black">{money(price)}</span>
      <Link href={`/admin/products/${id}/edit`} aria-label="Edit product" className="grid h-8 w-8 place-items-center text-neutral-400 hover:text-black">
        <Pencil size={16} />
      </Link>
      <button onClick={handleDelete} disabled={deleting} aria-label="Delete product" className="grid h-8 w-8 place-items-center text-neutral-400 hover:text-red-600">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
