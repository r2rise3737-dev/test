export const runtime = 'edge';
// src/app/api/ask/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ����� �� ������������

type AskPayload = {
  name: string;
  email: string;
  phone: string;
  question: string;
  // ����������� ���. ��������
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
    "<b>����� ������: ������� ������</b>",
    "",
    `<b>���:</b> ${sanitize(p.name) || "-"}`,
    `<b>Email:</b> ${sanitize(p.email) || "-"}`,
    `<b>�������:</b> ${sanitize(p.phone) || "-"}`,
    "",
    `<b>������:</b> ${sanitize(p.question, 2000) || "-"}`,
  ];

  if (p.courseTitle || p.amount || p.currency) {
    lines.push(
      "",
      "<b>�������� ������:</b>",
      p.courseTitle ? `� ����: ${sanitize(p.courseTitle)}` : "",
      p.amount ? `� �����: ${sanitize(p.amount)}` : "",
      p.currency ? `� ������: ${sanitize(p.currency)}` : ""
    );
  }

  return lines.filter(Boolean).join("\n");
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, question, courseTitle, amount, currency } =
      (await req.json()) as AskPayload;

    // ������� ���������
    if (!name || !email || !phone || !question) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID; // ����� ���� id ��� @username

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

    // �������� � Telegram
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000); // 8s �������

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


