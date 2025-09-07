import 'dotenv/config';
import process from "process";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME; // без @ (например DMITRIY8987)

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing in .env");
if (!CHANNEL_USERNAME) throw new Error("CHANNEL_USERNAME is missing in .env");

const api = (method, payload) =>
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }).then(r => r.json());

const uname = "@" + CHANNEL_USERNAME;

// 1) getChat -> узнаем числовой id
const chat = await api("getChat", { chat_id: uname });
if (!chat.ok) {
  console.error("getChat error:", chat);
  process.exit(1);
}
const chatId = chat.result.id;

// 2) проверим, есть ли у бота права администратора
const admin = await api("getChatMember", { chat_id: chatId, user_id: (await api("getMe", {})).result.id });
const isAdmin = admin.ok && ["administrator", "creator"].includes(admin.result.status);

console.log("CHANNEL_ID:", chatId);
console.log("IS_ADMIN:", isAdmin);
