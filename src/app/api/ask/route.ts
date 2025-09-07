export const runtime = 'edge';
// src/app/api/ask/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // С‡С‚РѕР±С‹ РЅРµ РєСЌС€РёСЂРѕРІР°Р»РѕСЃСЊ

type AskPayload = {
  name: string;
  email: string;
  phone: string;
  question: string;
  // РѕРїС†РёРѕРЅР°Р»СЊРЅРѕ РґРѕРї. РєРѕРЅС‚РµРєСЃС‚
  courseTitle?: string;
  amount?: string | number;
  currency?: string;
};

function sanitize(s: unknown, max = 500) {
  const str = String(s ?? "").trim();
  return str.replace(/\s+/g, " ").slice(0, max);
}

function buildMessage(p: AskPayload) {
  const lines = [
    "<b>РќРѕРІР°СЏ Р·Р°СЏРІРєР°: В«Р—Р°РґР°С‚СЊ РІРѕРїСЂРѕСЃВ»</b>",
    "",
    `<b>РРјСЏ:</b> ${sanitize(p.name) || "-"}`,
    `<b>Email:</b> ${sanitize(p.email) || "-"}`,
    `<b>РўРµР»РµС„РѕРЅ:</b> ${sanitize(p.phone) || "-"}`,
    "",
    `<b>Р’РѕРїСЂРѕСЃ:</b> ${sanitize(p.question, 2000) || "-"}`,
  ];

  if (p.courseTitle || p.amount || p.currency) {
    lines.push(
      "",
      "<b>РљРѕРЅС‚РµРєСЃС‚ Р·Р°РєР°Р·Р°:</b>",
      p.courseTitle ? `вЂў РљСѓСЂСЃ: ${sanitize(p.courseTitle)}` : "",
      p.amount ? `вЂў РЎСѓРјРјР°: ${sanitize(p.amount)}` : "",
      p.currency ? `вЂў Р’Р°Р»СЋС‚Р°: ${sanitize(p.currency)}` : ""
    );
  }

  return lines.filter(Boolean).join("\n");
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, question, courseTitle, amount, currency } =
      (await req.json()) as AskPayload;

    // Р‘Р°Р·РѕРІР°СЏ РІР°Р»РёРґР°С†РёСЏ
    if (!name || !email || !phone || !question) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID; // РјРѕР¶РµС‚ Р±С‹С‚СЊ id РёР»Рё @username

    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json(
        { ok: false, error: "TELEGRAM_ENV_MISSING" },
        { status: 500 }
      );
    }

    const text = buildMessage({
      name,
      email,
      phone,
      question,
      courseTitle,
      amount,
      currency,
    });

    // РћС‚РїСЂР°РІРєР° РІ Telegram
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000); // 8s С‚Р°Р№РјР°СѓС‚

    const tgResp = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    ).finally(() => clearTimeout(t));

    if (!tgResp.ok) {
      const err = await tgResp.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: "TELEGRAM_ERROR", details: err?.slice(0, 200) },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "UNEXPECTED", details: (e as Error).message },
      { status: 500 }
    );
  }
}


