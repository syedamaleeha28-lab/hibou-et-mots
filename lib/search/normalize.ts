import type { SearchFilters, SearchInput } from "./types"

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

export function normalizeSearchQuery(raw: string | undefined | null): string {
  if (!raw) return ""
  return raw.replace(/\s+/g, " ").trim().slice(0, 120)
}

export function parseSearchPage(raw: string | undefined | null): number {
  const value = Number.parseInt(raw ?? "1", 10)
  if (!Number.isFinite(value) || value < 1) return 1
  return value
}

export function parseSearchFilters(params: Record<string, string | undefined>): SearchFilters {
  const pick = (key: keyof SearchFilters) => {
    const value = params[key]?.trim()
    return value ? value : undefined
  }

  return {
    theme: pick("theme"),
    grade: pick("grade"),
    difficulty: pick("difficulty"),
    category: pick("category"),
  }
}

export function parseSearchInput(
  params: Record<string, string | string[] | undefined>,
): SearchInput {
  const read = (key: string) => {
    const value = params[key]
    return typeof value === "string" ? value : undefined
  }

  return {
    query: normalizeSearchQuery(read("q")),
    filters: parseSearchFilters({
      theme: read("theme"),
      grade: read("grade"),
      difficulty: read("difficulty"),
      category: read("category"),
    }),
    page: parseSearchPage(read("page")),
  }
}

export function hasActiveSearch(input: SearchInput): boolean {
  return (
    input.query.length > 0 ||
    Boolean(input.filters.theme) ||
    Boolean(input.filters.grade) ||
    Boolean(input.filters.difficulty) ||
    Boolean(input.filters.category)
  )
}

export function buildSearchHref(input: Partial<SearchInput> & { query?: string }): string {
  const params = new URLSearchParams()
  const query = normalizeSearchQuery(input.query)
  if (query) params.set("q", query)
  if (input.filters?.theme) params.set("theme", input.filters.theme)
  if (input.filters?.grade) params.set("grade", input.filters.grade)
  if (input.filters?.difficulty) params.set("difficulty", input.filters.difficulty)
  if (input.filters?.category) params.set("category", input.filters.category)
  if (input.page && input.page > 1) params.set("page", String(input.page))
  const qs = params.toString()
  return qs ? `/recherche/?${qs}` : "/recherche/"
}
