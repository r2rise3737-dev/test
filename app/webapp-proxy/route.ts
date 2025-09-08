export const runtime = "edge";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "";
  if (!path.startsWith("/webapp/") || !path.endsWith(".html")) {
    return new Response("Bad Request", { status: 400 });
  }

  // Тянем оригинальный ассет у Next/ASSETS
  const origin = await fetch(new URL(path, url.origin), {
    headers: { "cache-control": "no-cache" },
  });

  // Отдаём тот же body, но с нормальным заголовком
  const out = new Response(origin.body, origin);
  out.headers.set("content-type", "text/html; charset=utf-8");
  out.headers.set("cache-control", origin.headers.get("cache-control") ?? "public, max-age=0, must-revalidate");
  out.headers.set("x-webapp-proxy", "hit");
  return out;
}
