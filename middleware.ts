import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isWwwHost, toApexUrl } from "@/lib/seo/host"

/**
 * Permanent www → non-www redirect (308).
 * Adds a trailing slash on that hop so Google avoids a second redirect.
 * Apex trailing-slash redirects stay handled by Next (`trailingSlash: true`).
 */
export function middleware(request: NextRequest) {
  if (!isWwwHost(request.headers.get("host"))) {
    return NextResponse.next()
  }

  return NextResponse.redirect(toApexUrl(request.nextUrl), 308)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
}
