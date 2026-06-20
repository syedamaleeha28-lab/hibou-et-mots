import type { Metadata } from "next"
import {
  SearchResultsTemplate,
} from "@/components/templates/search"
import {
  getPopularPuzzlesForSearch,
  getRelatedCategoriesForSearch,
  getSearchFacets,
  parseSearchInput,
  resolveSearchResults,
} from "@/lib/search"
import { buildSearchMetadata } from "@/lib/seo/metadata"

export const revalidate = 300

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {}
  const input = parseSearchInput(params)
  return buildSearchMetadata({ query: input.query, page: input.page })
}

export default async function RecherchePage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {}
  const input = parseSearchInput(params)

  const [results, facets] = await Promise.all([
    resolveSearchResults(input),
    getSearchFacets(),
  ])

  const popularPuzzles = getPopularPuzzlesForSearch(6)
  const relatedCategories = getRelatedCategoriesForSearch(input.query, 6)

  return (
    <SearchResultsTemplate
      input={input}
      results={results}
      facets={facets}
      popularPuzzles={popularPuzzles}
      relatedCategories={relatedCategories}
    />
  )
}
