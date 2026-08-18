import { Suspense } from "react";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function BabyBoyPage() {
  return (
    <Suspense>
      <CategoryGrid title="Baby Boy" tag="6-24 Months" ageGroup="Baby Boy" />
    </Suspense>
  );
}
