export const onRequest: PagesFunction = async ({ request, next }) => {
  let res = await next();

  try {
    const url = new URL(request.url);
    const underWebapp = url.pathname.startsWith("/webapp/");
    const isHtml = url.pathname.endsWith(".html");
    const ct = res.headers.get("content-type") || "";

    if (underWebapp && isHtml && (!ct || ct.includes("application/octet-stream"))) {
      const out = new Response(res.body, res);
      out.headers.set("content-type", "text/html; charset=utf-8");
      out.headers.set("x-webapp-mw", "hit"); // маркер для проверки
      return out;
    }
  } catch {}

  return res;
};
