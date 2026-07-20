/** Preferred public hostname (non-www). */
export const APEX_HOSTNAME = "hibou-et-mots.com"

/** True when the request Host is the www variant of the apex domain. */
export function isWwwHost(hostHeader: string | null): boolean {
  const host = hostHeader?.split(":")[0]?.toLowerCase() ?? ""
  return host === `www.${APEX_HOSTNAME}`
}

/**
 * Paths that should keep their exact form (no forced trailing slash).
 * Matches files like /sitemap.xml, /robots.txt, /favicon.ico.
 */
export function needsTrailingSlash(pathname: string): boolean {
  if (pathname === "/" || pathname.endsWith("/")) return false
  if (/\.[a-zA-Z0-9]{1,8}$/.test(pathname)) return false
  return true
}

/** Build the canonical apex URL for a www request (trailing slash when appropriate). */
export function toApexUrl(requestUrl: URL): URL {
  const url = new URL(requestUrl.toString())
  url.protocol = "https:"
  url.hostname = APEX_HOSTNAME
  url.port = ""
  if (needsTrailingSlash(url.pathname)) {
    url.pathname = `${url.pathname}/`
  }
  return url
}
