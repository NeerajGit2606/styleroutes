"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Incorrect password");
      return;
    }
    router.push("/admin/orders");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center px-5 text-center">
      <Lock size={32} className="text-brand-gold" />
      <h1 className="mt-4 text-2xl font-black uppercase tracking-[-.04em]">Admin login</h1>
      <p className="mt-2 text-sm text-neutral-500">Enter the admin password to view orders.</p>

      <form onSubmit={handleSubmit} className="mt-8 w-full">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Admin password"
          className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
          autoFocus
        />
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-black py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
