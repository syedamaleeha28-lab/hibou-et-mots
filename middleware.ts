import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { APEX_HOSTNAME, isWwwHost, needsTrailingSlash } from "@/lib/seo/host"

/**
 * Single 308 hop for:
 * - www → non-www (apex)
 * - missing trailing slash → trailing slash (except file-like paths)
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")
  const www = isWwwHost(host)
  const slash = needsTrailingSlash(request.nextUrl.pathname)

  if (!www && !slash) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.protocol = "https:"
  url.hostname = APEX_HOSTNAME
  url.port = ""
  if (needsTrailingSlash(url.pathname)) {
    url.pathname = `${url.pathname}/`
  }

  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
}
