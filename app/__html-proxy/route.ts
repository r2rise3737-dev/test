export const runtime = "edge";

function cloneHeaders(src: Headers) {
  const h = new Headers();
  for (const [k, v] of src.entries()) h.set(k, v);
  return h;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "";
  if (!path.startsWith("/webapp/") || !path.endsWith(".html")) {
    return new Response("Bad Request", { status: 400 });
  }

  // тянем «оригинал» (может вернуться с octet-stream — это нормально)
  const origin = await fetch(new URL(path, url.origin), {
    headers: { "cache-control": "no-cache" },
  });

  // копируем все заголовки, но content-type перезаписываем
  const headers = cloneHeaders(origin.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("x-proxy", "html");
  if (!headers.has("cache-control")) {
    headers.set("cache-control", "public, max-age=0, must-revalidate");
  }

  return new Response(origin.body, { headers, status: origin.status, statusText: origin.statusText });
}
