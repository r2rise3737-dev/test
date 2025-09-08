/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/order/route.ts
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getCourse } from '@/lib/courses';
import { signCompact } from '@/lib/sign';

const noStore = { 'cache-control': 'no-store' } as Record<string, string>;

/** GET: открыть в браузере /api/order → 302 на TG_POST_URL */
export async function GET() {
  const post = (process.env.TG_POST_URL || '').trim();
  if (post) return new Response(null, { status: 302, headers: { Location: post, ...noStore } });
  return new Response('Order API: задайте TG_POST_URL в Variables and Secrets.', { status: 200, headers: noStore });
}

/** POST: если есть TG_POST_URL — отдаём его; иначе работаем по токену как раньше */
export async function POST(req: Request) {
  try {
    const post = (process.env.TG_POST_URL || '').trim();
    if (post) {
      return NextResponse.json({ ok: true as const, tgUrl: post, tgDeep: post }, { headers: noStore });
    }

    const { courseId } = await req.json().catch(() => ({} as any));
    if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400, headers: noStore });

    const course = getCourse(courseId);
    if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 400, headers: noStore });

    const secret = (process.env.ORDER_SECRET || '').trim();
    const botUsername = (process.env.BOT_USERNAME || '').trim().replace(/^@/, '');
    if (!secret || !botUsername) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500, headers: noStore });
    }

    // токен на 10 минут
    const exp = Date.now() + 10 * 60 * 1000;
    const token = await signCompact({ courseId: course.id, stars: course.stars, exp }, secret);
    const tgUrl  = `https://t.me/${botUsername}?start=${encodeURIComponent(token)}`;
    const tgDeep = `tg://resolve?domain=${botUsername}&start=${encodeURIComponent(token)}`;

    return NextResponse.json({ ok: true as const, tgUrl, tgDeep, token }, { headers: noStore });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400, headers: noStore });
  }
}

