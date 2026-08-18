import { Suspense } from "react";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function BoysPage() {
  return (
    <Suspense>
      <CategoryGrid title="Boys" tag="2-16 Yrs" ageGroup="Boys" />
    </Suspense>
  );
}
