export const runtime = "edge";

function cloneHeaders(src: Headers) {
  const h = new Headers();
  for (const [k, v] of src.entries()) h.set(k, v);
  return h;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  // какой именно файл отдаём
  const target = url.searchParams.get("path") || "/_raw/webapp/list.html";

  // тянем исходник из статических ассетов
  const origin = await fetch(new URL(target, url.origin), {
    headers: { "cache-control": "no-cache" },
  });

  const headers = cloneHeaders(origin.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  if (!headers.has("cache-control")) {
    headers.set("cache-control", "public, max-age=0, must-revalidate");
  }
  headers.set("x-proxy", "edge-html");

  return new Response(origin.body, { headers, status: origin.status, statusText: origin.statusText });
}
