import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/webapp/") && url.pathname.endsWith(".html")) {
    const proxy = new URL("/webapp-proxy", url.origin);
    proxy.searchParams.set("path", url.pathname);
    return NextResponse.rewrite(proxy);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/webapp/:path*"] };
