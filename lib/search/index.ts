export type {
  SearchCategoryHit,
  SearchFacets,
  SearchFacetOption,
  SearchFilters,
  SearchInput,
  SearchPagination,
  SearchResults,
  SearchSource,
} from "./types"
export { SEARCH_PAGE_SIZE } from "./types"

export {
  normalizeSearchQuery,
  normalizeSearchText,
  parseSearchInput,
  parseSearchFilters,
  parseSearchPage,
  hasActiveSearch,
  buildSearchHref,
} from "./normalize"

export { resolveSearchResults } from "./resolve"
export { searchWithDatabase } from "./postgres"
export {
  searchPuzzlesFallback,
  getPopularPuzzlesForSearch,
  getRelatedCategoriesForSearch,
} from "./fallback"
export { getSearchFacets, fallbackFacets } from "./facets"
