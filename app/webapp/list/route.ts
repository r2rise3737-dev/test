export const runtime = "edge";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = await fetch(new URL("/webapp/list.html", url.origin), {
    headers: { "cache-control": "no-cache" },
  });
  const out = new Response(origin.body, origin);
  out.headers.set("content-type", "text/html; charset=utf-8");
  out.headers.set(
    "cache-control",
    origin.headers.get("cache-control") ?? "public, max-age=0, must-revalidate"
  );
  out.headers.set("x-webapp-proxy", "hit");
  return out;
}
