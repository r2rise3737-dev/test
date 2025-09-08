import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const res = NextResponse.next();

  if (url.pathname.startsWith("/webapp/") && url.pathname.endsWith(".html")) {
    // принудительно нормализуем тип
    res.headers.set("content-type", "text/html; charset=utf-8");
    res.headers.set("x-webapp-mw", "hit");
  }
  return res;
}

// Ограничиваемся только нашим подпутём, чтобы ничего лишнего не трогать
export const config = {
  matcher: ["/webapp/:path*"],
};
