import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = { matcher: ["/webapp/:path*"] };

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Старые адреса вида /webapp/*.html -> на новый чистый путь без .html
  if (url.pathname.startsWith("/webapp/") && url.pathname.endsWith(".html")) {
    const clean = url.pathname.replace(/\.html$/, "");
    const to = new URL("/__html-proxy", url.origin);
    // прокси будет тянуть файл из /_raw/..., а клиенту остаётся красивый путь
    to.searchParams.set("path", "/_raw" + clean + ".html");
    return NextResponse.rewrite(to);
  }

  // Прямой "красивый" путь /webapp/list -> сразу на прокси
  if (url.pathname === "/webapp/list") {
    const to = new URL("/__html-proxy", url.origin);
    to.searchParams.set("path", "/_raw/webapp/list.html");
    return NextResponse.rewrite(to);
  }

  return NextResponse.next();
}
