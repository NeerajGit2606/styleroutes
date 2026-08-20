"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black">
      <LogOut size={14} /> Log out
    </button>
  );
}
