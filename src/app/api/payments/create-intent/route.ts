export const runtime = 'edge';
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const title = u.searchParams.get("title") || "Оплата";
  const amount = u.searchParams.get("amount") || "0";
  const currency = u.searchParams.get("currency") || "RUB";
  const pi = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const target = `${u.origin}/demo-checkout?pi=${encodeURIComponent(pi)}&title=${encodeURIComponent(title)}&amount=${encodeURIComponent(amount)}&currency=${encodeURIComponent(currency)}`;
  return NextResponse.redirect(target, { status: 302 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = String(body?.title ?? "Оплата");
    const amount = String(body?.amount ?? "0");
    const currency = String(body?.currency ?? "RUB");
    const pi = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const origin = new URL(req.url).origin;
    const payment_url = `${origin}/demo-checkout?pi=${encodeURIComponent(pi)}&title=${encodeURIComponent(title)}&amount=${encodeURIComponent(amount)}&currency=${encodeURIComponent(currency)}`;

    return NextResponse.json({ ok: true, demo: true, payment_url }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 });
  }
}


