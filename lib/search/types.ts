import type { PuzzleCardData } from "@/lib/db/types/page-data"

export type SearchFilters = {
  theme?: string
  grade?: string
  difficulty?: string
  category?: string
}

export type SearchCategoryHit = {
  id: string
  slug: string
  label: string
  href: string
  type: string
  description?: string
}

export type SearchFacetOption = {
  slug: string
  label: string
}

export type SearchFacets = {
  themes: SearchFacetOption[]
  grades: SearchFacetOption[]
  difficulties: SearchFacetOption[]
  categories: SearchFacetOption[]
}

export type SearchPagination = {
  items: PuzzleCardData[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type SearchSource = "database" | "fallback"

export type SearchResults = {
  query: string
  filters: SearchFilters
  puzzles: SearchPagination
  categories: SearchCategoryHit[]
  source: SearchSource
  hasActiveSearch: boolean
}

export type SearchInput = {
  query: string
  filters: SearchFilters
  page: number
}

export const SEARCH_PAGE_SIZE = 24
