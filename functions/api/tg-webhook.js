export async function onRequest(context) {
  const { request, env } = context;

  // 1) Секрет Telegram → Cloudflare
  const need = env.TG_WEBHOOK_SECRET || "";
  const got  = request.headers.get("x-telegram-bot-api-secret-token") || "";
  if (need && need !== got) return new Response("forbidden", { status: 403 });

  // 2) GET — пинг
  if (request.method === "GET") {
    const url = new URL(request.url);
    if (url.searchParams.get("ping") === "1") {
      return new Response(JSON.stringify({ ok: true, pong: Date.now() }), {
        headers: { "content-type": "application/json" }
      });
    }
    return new Response("ok");
  }

  // 3) Только POST для апдейтов
  if (request.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  let update;
  try { update = await request.json(); }
  catch { return new Response("bad json", { status: 400 }); }

  const token = env.BOT_TOKEN;
  const api = (m, b) => fetch(`https://api.telegram.org/bot${token}/${m}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(b)
  });

  // ОБЯЗАТЕЛЬНО: моментально подтвердить pre_checkout
  if (update.pre_checkout_query) {
    const q = update.pre_checkout_query;
    await api("answerPreCheckoutQuery", { pre_checkout_query_id: q.id, ok: true });
    // (опционально) служебка себе:
    await api("sendMessage", {
      chat_id: q.from.id,
      text: `✅ pre_checkout получен\namount: ${q.total_amount} XTR\npayload: ${q.invoice_payload || "-"}`
    });
    return new Response("ok");
  }

  // Успешная оплата
  if (update.message?.successful_payment) {
    const sp = update.message.successful_payment;
    await api("sendMessage", {
      chat_id: update.message.chat.id,
      text: `🎉 Успешная оплата: ${sp.total_amount} XTR\npayload: ${sp.invoice_payload || "-"}`
    });
    return new Response("ok");
  }

  return new Response("ok");
}
