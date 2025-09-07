import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN missing');

function arg(name, fallback = '') {
  const a = process.argv.find((s) => s.startsWith(`--${name}=`));
  return a ? a.split('=').slice(1).join('=').trim() : fallback;
}

// приоритет: аргумент --channel, иначе CHANNEL_USERNAME/CHANNEL_ID из .env
const CLI_CHANNEL = arg('channel');
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || '';
const CHANNEL_ID = process.env.CHANNEL_ID || '';
const chatTarget = CLI_CHANNEL || (CHANNEL_USERNAME ? `@${CHANNEL_USERNAME}` : CHANNEL_ID);
if (!chatTarget) throw new Error('Provide --channel=@name or set CHANNEL_USERNAME/CHANNEL_ID in .env');

const LANDING_URL = process.env.LANDING_URL || 'https://example.com';

const rootKeyboard = {
  inline_keyboard: [
    [{ text: '✨ Посмотреть программы', url: LANDING_URL }],
    [
      { text: '🔮 Таро', callback_data: 'menu:tarot' },
      { text: '🌌 Астрология', callback_data: 'menu:astro' },
    ],
  ],
};

const text =
  '✨ <b>Курсы Таро и Астрологии от Angela Pearl</b>\n' +
  'Посмотри программы и выбери своё направление.';

const api = (method, payload) =>
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

const res = await api('sendMessage', {
  chat_id: chatTarget,
  text,
  parse_mode: 'HTML',
  disable_web_page_preview: true,
  reply_markup: rootKeyboard,
});

if (!res.ok) throw new Error(`sendMessage failed: ${JSON.stringify(res)}`);

const msgId = res.result.message_id;
let postUrl;
if (String(chatTarget).startsWith('@')) {
  postUrl = `https://t.me/${String(chatTarget).replace('@', '')}/${msgId}`;
} else {
  const numeric = String(chatTarget).replace('-100', '');
  postUrl = `https://t.me/c/${numeric}/${msgId}`;
}

await fs.writeFile(
  path.join(process.cwd(), 'menu-post.json'),
  JSON.stringify({ url: postUrl, message_id: msgId, chat: chatTarget }, null, 2),
  'utf-8'
);

console.log('MENU POST:', postUrl);
console.log('Saved: menu-post.json');
