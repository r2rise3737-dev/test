// src/app/checkout/page.tsx
import { Suspense } from "react";
import Client from "./Client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full" style={{ background: "#f8f5ef" }} />}>
      <Client />
    </Suspense>
  );
}
