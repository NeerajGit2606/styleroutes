import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminNav } from "@/components/AdminNav";

export const metadata: Metadata = {
  title: "Admin — Enquiries — StyleRoute",
};

export default async function AdminEnquiriesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const enquiries = await db.enquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <AdminNav active="enquiries" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-[-.04em]">Enquiries</h1>
          <p className="mt-1 text-sm text-neutral-500">{enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"} total</p>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
          <MessageCircle size={40} className="text-neutral-300" />
          <p className="text-sm font-bold text-neutral-500">No enquiries yet.</p>
        </div>
      ) : (
        <div className="mt-9 space-y-4">
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="border border-neutral-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold">{enquiry.name}</h3>
                <span className="text-xs text-neutral-400">{enquiry.createdAt.toLocaleString("en-IN")}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-600">{enquiry.contact}</p>
              {enquiry.message && <p className="mt-2 text-sm text-neutral-500">{enquiry.message}</p>}
              {enquiry.latitude != null && enquiry.longitude != null && (
                <a
                  href={`https://maps.google.com/?q=${enquiry.latitude},${enquiry.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-bold text-brand-gold underline"
                >
                  View shared location
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
