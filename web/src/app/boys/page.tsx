import { Suspense } from "react";
import type { Metadata } from "next";
import { CategoryGrid } from "@/components/CategoryGrid";

export const metadata: Metadata = {
  title: "Boys Clothing (2-16 Yrs) — StyleRoute",
  description: "Shop comfortable, stylish clothing for boys aged 2-16 years at StyleRoute.",
};

export default function BoysPage() {
  return (
    <Suspense>
      <CategoryGrid title="Boys" tag="2-16 Yrs" ageGroup="Boys" />
    </Suspense>
  );
}
