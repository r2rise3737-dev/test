// index.ts — Канальный интерфейс без перехода в ЛС: WebApp-кнопки
// Задача: пользователь нажимает кнопки В КАНАЛЕ, всё происходит в overlay WebApp (без ЛС).
// Админ может пользоваться ЛС как раньше (меню/команды остаются).

import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.BOT_TOKEN!;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN is missing');

const LANDING_URL = process.env.LANDING_URL || 'https://example.com';
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(s => Number(s.trim())).filter(Boolean);
const BUTTONS_PER_ROW = Math.max(1, Number(process.env.BUTTONS_PER_ROW || 2));
const BUTTON_LABEL_LIMIT = Math.max(10, Number(process.env.BUTTON_LABEL_LIMIT || 28));
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || '';
const WEBAPP_URL = process.env.WEBAPP_URL || (process.env.PUBLIC_URL ? process.env.PUBLIC_URL + '/webapp' : 'https://example.com/webapp');

type Course = { id: string; title: string; short?: string; label?: string; desc?: string; rub?: number; section?: 'tarot'|'astro' };

function fileExists(p: string) {
  const abs = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
  return fs.existsSync(abs);
}
function readJSON<T>(p: string): T {
  const abs = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
  return JSON.parse(fs.readFileSync(abs, 'utf8')) as T;
}
function safeReadJSONMulti<T>(candidates: string[], fallback: T): T {
  for (const p of candidates) {
    try { if (fileExists(p)) return readJSON<T>(p); } catch {}
  }
  return fallback;
}

// Загружаем плоский массив курсов (как у пользователя)
function loadCoursesFlat(): Course[] {
  const raw = safeReadJSONMulti<any>(['data/courses.json','courses.json'], []);
  return Array.isArray(raw) ? raw : [];
}
function clipLabel(s: string) {
  const t = (s || '').trim();
  return t.length > BUTTON_LABEL_LIMIT ? t.slice(0, BUTTON_LABEL_LIMIT - 1) + '…' : t;
}
function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i=0;i<arr.length;i+=size) out.push(arr.slice(i, i+size));
  return out;
}

const bot = new Telegraf(BOT_TOKEN);

// Публичная клавиатура ДЛЯ КАНАЛА — ВНЕ Callback: только WebApp/URL кнопки
function publicKeyboard() {
  const list = loadCoursesFlat();
  const kb: any[] = [];

  // Первый ряд — разделы (Таро/Астро) открываются как вкладки внутри WebApp
  kb.push([
    Markup.button.webApp('🔮 Таро', `${WEBAPP_URL}?section=tarot`),
    Markup.button.webApp('🌌 Астрология', `${WEBAPP_URL}?section=astro`),
  ]);

  // Далее — 10 курсов, каждый открывает WebApp на карточке курса с оплатой
  const rows = chunk(
    list.map(c => Markup.button.webApp(clipLabel(c.label || c.short || c.title), `${WEBAPP_URL}?buy=${encodeURIComponent(c.id)}`)),
    BUTTONS_PER_ROW
  );
  kb.push(...rows);

  // Финальная кнопка — лендинг (как было)
  kb.push([Markup.button.url('✨ Посмотреть программы', LANDING_URL)]);

  return Markup.inlineKeyboard(kb);
}

// /post — публикуем пост в канал с нужной клавиатурой
bot.command('post', async (ctx) => {
  const uid = ctx.from?.id || 0;
  if (ADMIN_IDS.length && !ADMIN_IDS.includes(uid)) {
    await ctx.reply('Недостаточно прав.');
    return;
  }
  const args = (ctx.message as any).text.split(' ').slice(1);
  const channel = args[0] || CHANNEL_USERNAME;
  if (!channel) { await ctx.reply('Укажи канал: /post @channel (или добавь CHANNEL_USERNAME в .env)'); return; }

  const text = [
    'Меню доступно прямо здесь, в канале.',
    'Выберите раздел или курс — откроется окно без перехода в личные сообщения.'
  ].join('\n');

  try {
    await ctx.telegram.sendMessage(channel, text, publicKeyboard());
    await ctx.reply('Опубликовано ✅');
  } catch (e: any) {
    await ctx.reply(`Ошибка публикации: ${e?.description || e?.message || e}`);
  }
});

// ЛС остаётся для админов (например, /menu)
bot.command('menu', async (ctx) => {
  const uid = ctx.from?.id || 0;
  if (!ADMIN_IDS.includes(uid)) {
    await ctx.reply('Это меню доступно только админам.');
    return;
  }
  await ctx.reply('Админ‑меню: функции публикации и проверки доступны через /post.');
});

bot.launch().then(async () => {
  const me = await bot.telegram.getMe();
  console.log(`[boot] bot @${me.username} started`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));