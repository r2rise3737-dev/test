import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = { matcher: ["/webapp/:path*"] };

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/webapp/") && url.pathname.endsWith(".html")) {
    const prox = new URL("/__html-proxy", url.origin);
    prox.searchParams.set("path", url.pathname);
    // прокинем кэш-байпас для проверки
    prox.searchParams.set("_", Math.random().toString(36).slice(2));
    return NextResponse.rewrite(prox);
  }
  return NextResponse.next();
}
