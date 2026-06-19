export type IndexableInput = {
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  puzzleCount: number
  minPuzzleThreshold: number
}

export function computeIsIndexable(input: IndexableInput): boolean {
  return (
    input.status === "PUBLISHED" &&
    input.puzzleCount >= input.minPuzzleThreshold
  )
}

export type RobotsPageType =
  | "category"
  | "puzzle"
  | "search"
  | "generator-result"
  | "static"

export type RobotsDirective = {
  index: boolean
  follow: boolean
}

export function robotsDirective(input: {
  pageType: RobotsPageType
  isIndexable?: boolean
  isPublished?: boolean
  page?: number
  noindexPaginationFrom?: number
}): RobotsDirective {
  const noindexFrom = input.noindexPaginationFrom ?? 2

  if (input.pageType === "search" || input.pageType === "generator-result") {
    return { index: false, follow: true }
  }

  if (input.pageType === "category") {
    if (input.isIndexable === false) return { index: false, follow: true }
    if ((input.page ?? 1) >= noindexFrom) return { index: false, follow: true }
  }

  if (input.pageType === "puzzle" && input.isPublished === false) {
    return { index: false, follow: true }
  }

  return { index: true, follow: true }
}

export function isSitemapEligibleCategory(input: IndexableInput): boolean {
  return computeIsIndexable(input)
}

export function isSitemapEligiblePuzzle(status: IndexableInput["status"]): boolean {
  return status === "PUBLISHED"
}

export function shouldNoindexPath(path: string): boolean {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return (
    normalized.startsWith("/recherche/") ||
    normalized.startsWith("/generateur-mots-meles/resultat/") ||
    normalized.startsWith("/admin/") ||
    normalized.startsWith("/api/")
  )
}

export function robotsMetaContent(directive: RobotsDirective): string | undefined {
  if (directive.index && directive.follow) return undefined
  const parts: string[] = []
  parts.push(directive.index ? "index" : "noindex")
  parts.push(directive.follow ? "follow" : "nofollow")
  return parts.join(", ")
}
