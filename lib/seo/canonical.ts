import { absoluteUrl, resolveSiteOrigin } from "./routes"

const TRACKING_PARAMS = /^utm_/i

/** Normalize path: leading slash, trailing slash (except home). */
export function normalizePath(path: string): string {
  if (!path || path === "/") return "/"
  // Allow full-URL overrides — keep only the pathname (+ force trailing slash).
  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path)
      return normalizePath(url.pathname)
    } catch {
      // fall through to path normalization
    }
  }
  let normalized = path.startsWith("/") ? path : `/${path}`
  // Drop query/hash if a raw path somehow included them.
  normalized = normalized.split(/[?#]/, 1)[0] ?? normalized
  if (!normalized.endsWith("/")) normalized += "/"
  return normalized
}

/** Strip tracking params — PRD §8: no utm_* in canonical. */
export function stripTrackingParams(url: URL): URL {
  const cleaned = new URL(url.toString())
  for (const key of [...cleaned.searchParams.keys()]) {
    if (TRACKING_PARAMS.test(key)) cleaned.searchParams.delete(key)
  }
  return cleaned
}

export type CanonicalInput = {
  path: string
  page?: number
  siteUrl?: string
  override?: string | null
}

export function buildCanonicalPath(input: CanonicalInput): string {
  if (input.override) return normalizePath(input.override)

  const path = normalizePath(input.path)
  if ((input.page ?? 1) > 1) {
    return `${path}?page=${input.page}`
  }
  return path
}

/** Absolute canonical URL on the apex host, always trailing-slash path. */
export function buildCanonicalUrl(input: CanonicalInput): string {
  return absoluteUrl(buildCanonicalPath(input), resolveSiteOrigin(input.siteUrl))
}

export function isIndexableCanonicalPath(path: string, page = 1): boolean {
  const normalized = normalizePath(path)
  if (normalized.startsWith("/recherche/")) return false
  if (normalized.startsWith("/generateur-mots-meles/resultat/")) return false
  if (normalized.startsWith("/admin/")) return false
  if (page >= 2 && normalized !== "/") return false
  return true
}
