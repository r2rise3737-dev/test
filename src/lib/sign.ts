// src/lib/sign.ts — Edge-совместимый HMAC через Web Crypto API
// НЕТ зависимостей от node:crypto, работает в runtime='edge'

export type SignedPayload = {
  courseId: string;
  userId?: string;
  amount?: number;
  // добавь поля, которые уже используются у тебя в проекте
};

/**
 * Подписывает payload: hex(HMAC-SHA256(JSON(payload)))
 */
export async function signPayload(
  payload: SignedPayload,
  secret: string
): Promise<string> {
  const data = JSON.stringify(payload);
  return hmacSha256Hex(data, secret);
}

/**
 * Проверка подписи в константном времени
 */
export async function verifySignedPayload(
  payload: SignedPayload,
  signatureHex: string,
  secret: string
): Promise<boolean> {
  const expectedHex = await signPayload(payload, secret);
  return timingSafeEqualHex(expectedHex, signatureHex);
}

/**
 * Совместимость со старым кодом:
 * signCompact(data, secret) — принимает строку или объект,
 * возвращает hex(HMAC-SHA256(serialized)).
 * Ничего кроме экспорта не меняем.
 */
export async function signCompact(
  data: unknown,
  secret: string
): Promise<string> {
  const serialized =
    typeof data === "string" ? data : JSON.stringify(data ?? "");
  return hmacSha256Hex(serialized, secret);
}

/* ----------------- низкоуровневые утилиты ----------------- */

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bytesToHex(new Uint8Array(sig));
}

function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = hexToBytes(aHex);
  const b = hexToBytes(bHex);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim().toLowerCase();
  if (clean.length % 2 !== 0) throw new Error("Invalid hex");
  const arr = new Uint8Array(clean.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return arr;
}
