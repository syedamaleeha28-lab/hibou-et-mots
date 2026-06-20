import { hasActiveSearch } from "./normalize"
import { searchPuzzlesFallback } from "./fallback"
import { searchWithDatabase } from "./postgres"
import type { SearchInput, SearchResults } from "./types"

export async function resolveSearchResults(input: SearchInput): Promise<SearchResults> {
  const active = hasActiveSearch(input)

  if (!active) {
    return {
      query: input.query,
      filters: input.filters,
      puzzles: {
        items: [],
        page: 1,
        pageSize: 24,
        totalCount: 0,
        totalPages: 0,
      },
      categories: [],
      source: "fallback",
      hasActiveSearch: false,
    }
  }

  const fromDatabase = await searchWithDatabase(input)
  if (fromDatabase) {
    return {
      query: input.query,
      filters: input.filters,
      puzzles: fromDatabase.puzzles,
      categories: fromDatabase.categories,
      source: "database",
      hasActiveSearch: true,
    }
  }

  const fromFallback = searchPuzzlesFallback(input)
  return {
    query: input.query,
    filters: input.filters,
    puzzles: fromFallback.puzzles,
    categories: fromFallback.categories,
    source: "fallback",
    hasActiveSearch: true,
  }
}
