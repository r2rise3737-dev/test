// scripts/generateInvoiceLinks.mjs
import fs from "fs/promises";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

/**
 * Требуется .env с BOT_TOKEN=123456:AA...
 * Берём courses.json, где у каждого курса есть stars (целое число),
 * и создаём реальные ссылки через createInvoiceLink(currency='XTR', amount=stars).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "pages-deploy", "data");
const coursesPath = path.join(dataDir, "courses.json");
const outPath = path.join(dataDir, "invoice-links.json");

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("ERR: BOT_TOKEN отсутствует в .env");
  process.exit(1);
}

const raw = (await fs.readFile(coursesPath, "utf8")).replace(/^\uFEFF/, "");
const courses = JSON.parse(raw);

const result = {}; // id -> https://t.me/$<payload>

for (const c of courses) {
  const id = c.id;
  const stars = Number(c.stars);
  if (!id || !Number.isInteger(stars) || stars <= 0) {
    console.warn(`SKIP ${id}: нет корректного "stars"`);
    continue;
  }

  const body = {
    title: c.label || c.title || id,
    description: c.desc || "Оплата курса",
    payload: `course:${id}:${Date.now()}`,
    currency: "XTR", // Telegram Stars
    prices: [{ label: "Course", amount: stars }],
  };

  const url = `https://api.telegram.org/bot${token}/createInvoiceLink`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }).then(r => r.json());

  if (!res.ok) {
    console.error("createInvoiceLink failed for", id, res);
    process.exit(2);
  }
  result[id] = res.result;
  console.log("OK", id, "→", res.result);
}

await fs.writeFile(outPath, JSON.stringify(result, null, 2), "utf8");
console.log(`\nWritten: ${outPath}`);
