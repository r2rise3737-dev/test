export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ---------- Telegram Webhook ----------
    if (url.pathname === "/api/tg-webhook") {
      // Телеграм шлёт POST, но на всякий ответим и на GET 200, чтобы не словить 405
      if (request.method !== "POST") {
        return new Response("ok", { status: 200 });
      }

      const token = env.BOT_TOKEN;
      if (!token) {
        return new Response("No BOT_TOKEN", { status: 500 });
      }

      let update = {};
      try { update = await request.json(); } catch (_) {}

      const call = (method, body) =>
        fetch(`https://api.telegram.org/bot${token}/${method}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });

      // Обязательный ответ для прохождения платежа
      if (update.pre_checkout_query) {
        await call("answerPreCheckoutQuery", {
          pre_checkout_query_id: update.pre_checkout_query.id,
          ok: true,
        });
        return new Response("ok", { status: 200 });
      }

      // Успешная оплата Stars (XTR)
      if (update.message && update.message.successful_payment) {
        const chat_id = update.message.chat.id;
        // Можно извлечь payload/сумму, если нужно маппить на курс:
        // const payload = update.message.successful_payment.invoice_payload || "";
        // const amount  = update.message.successful_payment.total_amount; // XTR
        await call("sendMessage", {
          chat_id,
          text: "Оплата получена ✅. Доступ будет выдан в ближайшее время.",
        });
        return new Response("ok", { status: 200 });
      }

      return new Response("ok", { status: 200 });
    }

    // ---------- /proxy: показываем лендинг внутри iframe ----------
    if (url.pathname === "/proxy") {
      const raw = url.searchParams.get("u");
      if (!raw) return new Response("bad request", { status: 400 });

      let target;
      try { target = new URL(raw); } catch { return new Response("bad url", { status: 400 }); }

      // Только твой домен
      if (!/^https?:\/\/angelapearl-academy\.pages\.dev(\/|$)/i.test(target.href)) {
        return new Response("forbidden", { status: 403 });
      }

      // Тянем HTML
      const upstream = await fetch(target.href, {
        headers: { "user-agent": request.headers.get("user-agent") || "" }
      });
      let html = await upstream.text();

      // Удаляем мешающие куски и добавляем <base>
      html = html
        .replace(/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/ig, "")
        .replace(/<script[^>]+cloudflareinsights\.com[^>]*>\s*<\/script>/ig, "")
        .replace(/<script[^>]+data-cf-beacon[^>]*>\s*<\/script>/ig, "")
        .replace(/<head(\b[^>]*)?>/i, m => m + '<base href="https://angelapearl-academy.pages.dev/">');

      // Инъекция перехвата t.me/tg:// ВСЕМИ путями
      const inject = `
<script>(function(){
  function inside(){ try{ return parent && parent !== window }catch(_){ return false } }
  function isTG(h){ return /^(https?:\\/\\/t\\.me\\/|tg:\\/)/i.test(h||"") }
  function send(u){ try{ parent.postMessage({ type: "OPEN_TME", url: u }, "*"); }catch(_){ } }

  // 1) Клики (в т.ч. программный click())
  document.addEventListener("click", function(e){
    try{
      var t = e.target && e.target.closest && e.target.closest("a,button,[data-href],[data-tg-link]");
      if(!t) return;
      var h = (t.getAttribute && (t.getAttribute("data-tg-link")||t.getAttribute("href")||t.getAttribute("data-href"))) || t.href || "";
      if(inside() && isTG(h)){ e.preventDefault(); e.stopImmediatePropagation(); send(h); }
    }catch(_){}
  }, true);
  try{
    var _ac = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function(){
      var h = this.getAttribute("href") || this.href || "";
      if(inside() && isTG(h)){ send(h); return; }
      return _ac.apply(this, arguments);
    }
  }catch(_){}

  // 2) window.open
  (function(){
    var _o = window.open;
    window.open = function(u){
      if(inside() && isTG(u)){ send(u); return null; }
      return _o ? _o.apply(window, arguments) : null;
    };
  })();

  // 3) location.*
  (function(){
    try{
      var _a = window.location.assign.bind(window.location);
      var _r = window.location.replace.bind(window.location);
      window.location.assign = function(u){ if(inside() && isTG(u)){ send(u); return; } _a(u); };
      window.location.replace = function(u){ if(inside() && isTG(u)){ send(u); return; } _r(u); };
    }catch(_){}
  })();

  // 4) формы на t.me (на всякий)
  document.addEventListener("submit", function(e){
    try{
      var f = e.target;
      var act = f && (f.getAttribute("action") || "");
      if(inside() && isTG(act)){ e.preventDefault(); send(act); }
    }catch(_){}
  }, true);
})();</script>`;

      html = html.replace(/<\/body>/i, inject + '</body>');

      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          // принудительно убираем всё, что может мешать фрейму/кэшу
          "x-frame-options": "",
          "content-security-policy": "",
          "cross-origin-opener-policy": "",
          "cross-origin-embedder-policy": "",
          "cache-control": "no-store"
        }
      });
    }

    // ---------- Остальное: статика Pages ----------
    return env.ASSETS.fetch(request);
  }
}
