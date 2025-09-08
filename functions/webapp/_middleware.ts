export const onRequest: PagesFunction = async ({ request, next }) => {
  // Пробрасываем запрос дальше (к Next/asset-провайдеру)
  let res = await next();

  try {
    const url = new URL(request.url);
    const isHtml = url.pathname.endsWith(".html");
    const underWebapp = url.pathname.startsWith("/webapp/");
    const ct = res.headers.get("content-type") || "";

    // Нормализуем только для наших страниц, если тип "пустой" или octet-stream
    if (underWebapp && isHtml && (!ct || ct.startsWith("application/octet-stream"))) {
      res = new Response(res.body, res); // клонируем, чтобы можно было менять заголовки
      res.headers.set("content-type", "text/html; charset=utf-8");
    }
  } catch (_) {
    // молча: никакой логики, чтобы не ломать рендер
  }

  return res;
};
