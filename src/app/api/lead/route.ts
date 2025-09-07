// src/app/api/lead/route.ts
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

const noStore = { 'cache-control': 'no-store' } as Record<string, string>;

function getEnv(keys: string[]): string {
  for (const k of keys) {
    const v = (process.env[k] || '').trim();
    if (v) return v;
  }
  return '';
}

// Если кто-то случайно впишет токен как "NNN:AAA@botname" — отрежем хвост.
function cleanToken(raw: string) {
  return raw.trim().split('@')[0];
}

// @username → оставляем; "username" → добавим @; приватный "-100…" — как есть.
function normalizeChatId(raw: string): string {
  const v = (raw || '').trim();
  if (!v) return '';
  if (/^-100\d+$/.test(v) || /^@\w+$/i.test(v)) return v;
  if (/^\w+$/i.test(v)) return '@' + v;
  return v;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function pickStr(obj: any, keys: string[]): string {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

// Ключи для извлечения текста сообщения
const MSG_KEYS = [
  'message', 'text', 'msg', 'question', 'comment', 'content', 'body', 'details', 'note', 'notes', 'descr', 'description',
  'сообщение', 'вопрос', 'комментарий', 'описание', 'текст'
];

function extractMessage(payload: any): string {
  if (!payload) return '';
  if (typeof payload === 'string') return payload.trim();

  const direct = pickStr(payload, MSG_KEYS);
  if (direct) return direct;

  if (Array.isArray(payload)) {
    for (const it of payload) {
      const m = extractMessage(it);
      if (m) return m;
    }
    return '';
  }

  if (typeof payload === 'object') {
    for (const [k, v] of Object.entries(payload)) {
      if (typeof v === 'string' && v.trim() && MSG_KEYS.some(key => key.toLowerCase() === k.toLowerCase())) {
        return v.trim();
      }
    }
    for (const v of Object.values(payload)) {
      const m = extractMessage(v);
      if (m) return m;
    }
  }
  return '';
}

function limit(s: string, n = 3500): string {
  if (s.length <= n) return s;
  return s.slice(0, n) + '…';
}

/** GET: быстрый пинг — открой /api/lead?ping=1 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!url.searchParams.get('ping')) {
    return new Response('lead: добавь ?ping=1 для теста отправки в канал.', { status: 200, headers: noStore });
  }

  const token = cleanToken(getEnv(['LEAD_BOT_TOKEN', 'LEAD_TOKEN', 'TELEGRAM_BOT_TOKEN'])); // второй бот
  const chatId = normalizeChatId(getEnv(['LEAD_CHAT_ID', 'TELEGRAM_CHAT_ID', 'CHAT_ID']));
  if (!token || !chatId) {
    return new Response('lead: Server misconfigured (LEAD_BOT_TOKEN/LEAD_CHAT_ID)', { status: 500, headers: noStore });
  }

  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '🟢 Пинг от лендинга: /api/lead работает.',
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || data?.ok !== true) {
    const reason = (data?.description || '').toString();
    const msg =
      reason.includes('not enough rights') || reason.includes('forbidden')
        ? 'lead: Telegram rejected (бот не админ или нет права Post messages)'
        : 'lead: Telegram rejected';
    return new Response(msg, { status: 502, headers: noStore });
  }

  return new Response('lead: OK (сообщение отправлено)', { status: 200, headers: noStore });
}

/** POST: отправка лида (контакты + сам вопрос) */
export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({} as any));

    const name  = pickStr(b, ['name', 'fio', 'fullname', 'имя']);
    const email = pickStr(b, ['email', 'mail']);
    const phone = pickStr(b, ['phone', 'tel', 'telephone', 'номер', 'телефон']);
    const tg    = pickStr(b, ['telegram', 'tg', 'username']);
    let msg     = extractMessage(b);

    if (!msg) {
      const alt = [b?.question, b?.comment, b?.text, b?.message].filter((x: any) => typeof x === 'string' && x.trim());
      if (alt.length) msg = alt[0].trim();
    }

    if (!(email || phone || tg)) {
      return NextResponse.json({ error: 'Укажите email, телефон или Telegram' }, { status: 400, headers: noStore });
    }

    const token  = cleanToken(getEnv(['LEAD_BOT_TOKEN', 'LEAD_TOKEN', 'TELEGRAM_BOT_TOKEN'])); // второй бот
    const chatId = normalizeChatId(getEnv(['LEAD_CHAT_ID', 'TELEGRAM_CHAT_ID', 'CHAT_ID']));
    if (!token || !chatId) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500, headers: noStore });
    }

    const lines: string[] = [];
    lines.push('📝 <b>Новая заявка с лендинга</b>');
    if (name)  lines.push(`👤 Имя: <b>${esc(name)}</b>`);
    if (email) lines.push(`✉️ Email: <b>${esc(email)}</b>`);
    if (phone) lines.push(`📞 Телефон: <b>${esc(phone)}</b>`);
    if (tg)    lines.push(`💬 Telegram: <b>${esc(tg)}</b>`);
    if (msg) {
      lines.push('━━━━━━━━━━━━━━━━');
      lines.push('💬 <b>Вопрос:</b>');
      lines.push(esc(limit(msg)));
    }

    const text = lines.join('\n');

    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data?.ok !== true) {
      const reason = (data?.description || '').toString();
      const msg =
        reason.includes('not enough rights') || reason.includes('forbidden')
          ? 'Telegram rejected (бот не админ/нет права Post messages)'
          : 'Telegram rejected';
      return NextResponse.json({ error: msg, detail: data }, { status: 502, headers: noStore });
    }

    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500, headers: noStore });
  }
}
