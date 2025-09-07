import { Suspense } from "react";
import SuccessClient from "./Client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#f8f5ef" }} />}>
      <SuccessClient />
    </Suspense>
  );
}
