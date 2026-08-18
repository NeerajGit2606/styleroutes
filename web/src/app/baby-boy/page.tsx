import { Suspense } from "react";
import type { Metadata } from "next";
import { CategoryGrid } from "@/components/CategoryGrid";

export const metadata: Metadata = {
  title: "Baby Boy Clothing (6-24 Months) — StyleRoute",
  description: "Soft, comfortable rompers, onesies, and everyday wear for baby boys aged 6-24 months.",
};

export default function BabyBoyPage() {
  return (
    <Suspense>
      <CategoryGrid title="Baby Boy" tag="6-24 Months" ageGroup="Baby Boy" />
    </Suspense>
  );
}
