import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isWwwHost, toApexUrl } from "@/lib/seo/host"

/**
 * Permanent www → non-www redirect (308).
 * Adds a trailing slash on that hop so Google avoids a second redirect.
 * Apex trailing-slash redirects stay handled by Next (`trailingSlash: true`).
 *
 * PT-BR pack: also sets an `x-locale` REQUEST header (not response header —
 * see the `NextResponse.next({ request: {...} })` form below, which is the
 * documented way to pass data from middleware forward to Server Components).
 * app/layout.tsx reads this via `headers()` to pick the right `<html lang>`.
 *
 * KNOWN TRADEOFF (deliberately accepted): every route that reads
 * `headers()` becomes fully dynamic — no static generation, no ISR. Since
 * the root layout wraps every page, this takes the whole site from
 * `revalidate = 3600` ISR to server-rendering on every request. Chosen
 * over the alternative (splitting into two independent root layouts via
 * route groups, which would preserve ISR but require moving every existing
 * French route folder). If ISR/performance becomes a problem later, that's
 * the path to revisit.
 *
 * All PT-BR routes currently share the "/caca-palavras" URL prefix
 * (hub, difficulty, theme, and puzzle detail pages all start with it) —
 * one prefix check covers all of them without needing a route list that
 * has to be kept in sync.
 */
export function middleware(request: NextRequest) {
  if (isWwwHost(request.headers.get("host"))) {
    return NextResponse.redirect(toApexUrl(request.nextUrl), 308)
  }

  const locale = request.nextUrl.pathname.startsWith("/caca-palavras") ? "pt-BR" : "fr"

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-locale", locale)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
}
