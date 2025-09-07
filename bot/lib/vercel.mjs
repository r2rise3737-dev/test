import 'dotenv/config';
import { Telegraf, Markup, Context } from 'telegraf';
import type { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import fs from 'fs/promises';
import path from 'path';

// === ENV ===
const BOT_TOKEN = process.env.BOT_TOKEN!;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN отсутствует в .env');

const DEFAULT_CHANNEL =
  (process.env.CHANNEL_USERNAME && `@${process.env.CHANNEL_USERNAME}`) ||
  process.env.CHANNEL_ID ||
  '';

const LANDING_URL = (process.env.LANDING_URL || '').trim();

const BUTTONS_PER_ROW = Number(process.env.BUTTONS_PER_ROW || 1);
const LABEL_LIMIT = Number(process.env.BUTTON_LABEL_LIMIT || 28);

const ADMIN_IDS: number[] = String(process.env.ADMIN_IDS || '')
  .split(',')
  .map((s) => Number(s.trim()))
  .filter(Boolean);

// === DATA ===
const coursesPath = path.join(process.cwd(), 'data', 'courses.json');
const invoicePath = path.join(process.cwd(), 'invoice-links.json');

type Course = { id: string; title: string; desc?: string; rub?: number };
const courses: Course[] = JSON.parse(await fs.readFile(coursesPath, 'utf-8'));
const invoiceLinks: Record<string, string> = JSON.parse(
  await fs.readFile(invoicePath, 'utf-8').catch(async () => {
    await fs.writeFile(invoicePath, '{}', 'utf-8');
    return '{}';
  }),
);

// helpers
const crop = (s: string, n = LABEL_LIMIT) =>
  s.length <= n ? s : s.slice(0, n - 1) + '…';

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function onlyAdmins(ctx: Context): boolean {
  if (!ADMIN_IDS.length) return true;
  const uid =
    // @ts-ignore
    ctx.from?.id || (ctx.update as any)?.callback_query?.from?.id || 0;
  return ADMIN_IDS.includes(uid);
}

// keyboards
const rootKeyboardExpanded = () =>
  Markup.inlineKeyboard([
    [Markup.button.url('✨ Посмотреть программы', LANDING_URL || 'https://example.com')],
    [
      Markup.button.callback('🔮 Таро', 'menu:tarot'),
      Markup.button.callback('🌌 Астрология', 'menu:astro'),
    ],
  ]);

const rootKeyboardSingle = () =>
  Markup.inlineKeyboard([
    [Markup.button.url('✨ Посмотреть программы', LANDING_URL || 'https://example.com')],
    [Markup.button.callback('📋 Открыть меню', 'menu:root')],
  ]);

function buildCategoryKeyboard(prefix: 'tarot' | 'astro') {
  const items = courses.filter((c) => c.id.startsWith(prefix + '-'));
  const buttons = items.map((c) => {
    const url = invoiceLinks[c.id];
    const label = crop(c.title);
    return url
      ? Markup.button.url(label, url)
      : Markup.button.callback(label, 'noop'); // на случай отсутствия ссылки
  });
  const rows = chunk(buttons, BUTTONS_PER_ROW);
  rows.push([Markup.button.callback('⬅️ Назад', 'menu:root')]);
  return Markup.inlineKeyboard(rows);
}

// === BOT ===
const bot = new Telegraf(BOT_TOKEN);

// --- Меню (callback) ---
async function editKeyboard(ctx: Context, kb: ReturnType<typeof Markup.inlineKeyboard>) {
  const cq = (ctx.update as any).callback_query as CallbackQuery.DataCallbackQuery;
  try {
    await ctx.answerCbQuery();
  } catch {}
  const chatId = cq.message?.chat?.id;
  const messageId = cq.message?.message_id;
  if (!chatId || !messageId) return;
  try {
    await ctx.telegram.editMessageReplyMarkup(chatId, messageId, undefined, kb.reply_markup);
  } catch (e) {
    // ignore "message is not modified" / "query is too old"
  }
}

bot.action('menu:root', async (ctx) => {
  await editKeyboard(ctx, rootKeyboardExpanded());
});
bot.action('menu:tarot', async (ctx) => {
  await editKeyboard(ctx, buildCategoryKeyboard('tarot'));
});
bot.action('menu:astro', async (ctx) => {
  await editKeyboard(ctx, buildCategoryKeyboard('astro'));
});
bot.action('noop', async (ctx) => {
  await ctx.answerCbQuery('Ссылка скоро появится', { show_alert: false });
});

// === /post мастер ===
// Состояние мастера (простое, в памяти)
type Wizard = {
  step: 'channel' | 'media' | 'text' | 'publish';
  channel?: string; // @username или -100...
  media?: { kind: 'photo' | 'voice'; file_id: string } | null;
  text?: string;
  mode?: 'single' | 'menu';
};
const w: Map<number, Wizard> = new Map();

function ensureAdmin(ctx: Context) {
  if (!onlyAdmins(ctx)) {
    ctx.reply('Доступ к /post только у админов.');
    return false;
  }
  return true;
}

bot.command('cancel', (ctx) => {
  w.delete(ctx.from!.id);
  ctx.reply('Окей, мастер поста отменён.');
});

bot.command('post', async (ctx) => {
  if (!ensureAdmin(ctx)) return;
  const args = (ctx.message as any).text.split(/\s+/).slice(1);
  const channel = args[0] || DEFAULT_CHANNEL;
  const mode = (args[1] === 'menu' ? 'menu' : 'single') as 'single' | 'menu';

  if (!channel) {
    return ctx.reply(
      'Укажи канал:\n/post @username [single|menu]\n\nПример: /post @DMITRIY8987 menu',
    );
  }

  w.set(ctx.from!.id, { step: 'media', channel, media: null, mode });
  await ctx.reply(
    `Канал: <b>${channel}</b>\nРежим кнопок: <b>${mode}</b>\n\nПришли <b>фото</b> или <b>голосовое</b> для обложки, либо напиши <code>skip</code>.`,
    { parse_mode: 'HTML' },
  );
});

bot.on(['photo', 'voice', 'message'], async (ctx, next) => {
  const ww = w.get(ctx.from?.id || 0);
  if (!ww) return next();

  if (ww.step === 'media') {
    // media or skip
    const m: any = ctx.message;
    if (m.photo && m.photo.length) {
      const file_id = m.photo[m.photo.length - 1].file_id;
      ww.media = { kind: 'photo', file_id };
      ww.step = 'text';
      await ctx.reply('Ок. Теперь пришли текст поста (HTML разрешён: <b>, <i>, <u>, <a href="">, <code>, <pre>).');
      return;
    }
    if (m.voice) {
      ww.media = { kind: 'voice', file_id: m.voice.file_id };
      ww.step = 'text';
      await ctx.reply('Ок. Теперь пришли текст поста (HTML разрешён).');
      return;
    }
    if (m.text && m.text.trim().toLowerCase() === 'skip') {
      ww.media = null;
      ww.step = 'text';
      await ctx.reply('Медиа пропустили. Пришли текст поста (HTML разрешён).');
      return;
    }
    return; // ждём корректный ввод
  }

  if (ww.step === 'text') {
    const m: any = ctx.message;
    if (!m.text) return;
    ww.text = m.text;
    ww.step = 'publish';

    // публикуем
    const kb = ww.mode === 'menu' ? rootKeyboardExpanded() : rootKeyboardSingle();

    try {
      let res;
      if (ww.media?.kind === 'photo') {
        res = await ctx.telegram.sendPhoto(ww.channel!, ww.media.file_id, {
          caption: ww.text,
          parse_mode: 'HTML',
          reply_markup: kb.reply_markup,
          disable_notification: false,
        });
      } else if (ww.media?.kind === 'voice') {
        res = await ctx.telegram.sendVoice(ww.channel!, ww.media.file_id, {
          caption: ww.text,
          parse_mode: 'HTML',
          reply_markup: kb.reply_markup,
          disable_notification: false,
        });
      } else {
        res = await ctx.telegram.sendMessage(ww.channel!, ww.text, {
          parse_mode: 'HTML',
          reply_markup: kb.reply_markup,
          disable_web_page_preview: false,
          disable_notification: false,
        });
      }

      // формируем URL поста
      let postUrl = '';
      if (typeof ww.channel === 'string' && ww.channel.startsWith('@')) {
        postUrl = `https://t.me/${ww.channel.slice(1)}/${res.message_id}`;
      } else if (typeof ww.channel === 'string') {
        const numeric = ww.channel.replace('-100', '');
        postUrl = `https://t.me/c/${numeric}/${res.message_id}`;
      }

      await ctx.reply(
        `Готово ✅\nПост опубликован: ${postUrl || '(смотри в канале)'}\n` +
          `— Режим кнопок: ${ww.mode}\n` +
          `— Для раскрытия меню у «single» нажми в посте «📋 Открыть меню».`,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await ctx.reply('Ошибка публикации: ' + msg);
    } finally {
      w.delete(ctx.from!.id);
    }
    return;
  }
});

// Старт/пинг
bot.start((ctx) =>
  ctx.reply('Привет! Команда /post — опубликовать пост в канал.\n/cancel — отмена.'),
);
bot.hears('ping', (ctx) => ctx.reply('pong'));

// Запуск
console.log('[boot] launching bot…');
bot.launch();

// Грейсфул
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
