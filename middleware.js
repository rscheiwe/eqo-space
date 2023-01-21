import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|examples|[\\w-]+\\.\\w+).*)",
  ],
};

export function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "demo.eqo-space.com";
  const subDomainCheck = hostname.split(".")[0]
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.eqo-space.com`, "")
          .replace(`.eqo-space.vercel.app`, "")
      : hostname.replace(`.localhost:3002`, "");

  // rewrites for app pages
  if (currentHost == "base") {
    if (
      url.pathname === "/login" &&
      (req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    url.pathname = `/base${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (subDomainCheck !== "eqo" || subDomainCheck !== "www") {
    if (
      url.pathname === "/login" &&
      (req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    url.pathname = `${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}