import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PREFIXES = [
  "/",
  "/product",
  "/features",
  "/ai-cfo",
  "/analytics",
  "/pricing",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/login",
  "/register",
  "/forgot-password",
  "/api",
  "/_next",
  "/favicon.ico",
]

const AUTH_PAGES = ["/login", "/register", "/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static / API / public routes
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    // Already authenticated users should not land on auth pages
    if (AUTH_PAGES.includes(pathname)) {
      const token = request.cookies.get("balans-session")?.value
      if (token) {
        return NextResponse.redirect(new URL("/app/dashboard", request.url))
      }
    }
    return NextResponse.next()
  }

  // Protected app routes
  if (pathname.startsWith("/app")) {
    const token = request.cookies.get("balans-session")?.value
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
}
