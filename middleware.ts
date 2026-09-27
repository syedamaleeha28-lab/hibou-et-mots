import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isWwwHost, toApexUrl } from "@/lib/seo/host"

/**
 * Permanent www → non-www redirect (308).
 * Adds a trailing slash on that hop so Google avoids a second redirect.
 * Apex trailing-slash redirects stay handled by Next (`trailingSlash: true`).
 *
 * Locale is no longer detected here. French pages live in the `(fr)` route
 * group and Portuguese pages in `(pt-br)`; each group has its own root
 * layout and a fixed `<html lang>`.
 */
export function middleware(request: NextRequest) {
  if (isWwwHost(request.headers.get("host"))) {
    return NextResponse.redirect(toApexUrl(request.nextUrl), 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
}
