import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = { matcher: ["/webapp/:path*"] };

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // /webapp/*.html -> переписываем на прокси, который берёт файл из /_raw/...
  if (url.pathname.startsWith("/webapp/") && url.pathname.endsWith(".html")) {
    const raw = "/_raw" + url.pathname + ""; // напр. /_raw/webapp/list.html
    const to = new URL("/__html-proxy", url.origin);
    to.searchParams.set("path", raw);
    return NextResponse.rewrite(to);
  }

  // «чистый» путь без .html тоже обслуживаем прокси из соответствующего сырого файла
  if (url.pathname === "/webapp/list") {
    const to = new URL("/__html-proxy", url.origin);
    to.searchParams.set("path", "/_raw/webapp/list.html");
    return NextResponse.rewrite(to);
  }

  return NextResponse.next();
}
