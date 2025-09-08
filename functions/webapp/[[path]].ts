export const onRequest: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);
  const origin = await env.ASSETS.fetch(request); // отдать оригинал из статики

  if (url.pathname.startsWith("/webapp/") && url.pathname.endsWith(".html")) {
    const out = new Response(origin.body, origin);
    const ct = out.headers.get("content-type") || "";
    if (!ct || ct.includes("application/octet-stream")) {
      out.headers.set("content-type", "text/html; charset=utf-8");
    }
    out.headers.set("x-webapp-fn", "hit");
    return out;
  }

  return origin;
};
