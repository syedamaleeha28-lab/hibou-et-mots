import Link from "next/link"
import type { PuzzleCardData } from "@/lib/db/types/page-data"
import type { SearchCategoryHit, SearchFacets, SearchInput, SearchResults } from "@/lib/search/types"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SectionHeading } from "@/components/layout/section-heading"
import { ROUTES } from "@/lib/seo/routes"
import { SearchBar } from "./search-bar"
import { SearchFiltersPanel } from "./search-filters"
import { SearchEmptyState } from "./search-empty-state"
import { SearchResultsGrid } from "./search-results-grid"

export type SearchResultsTemplateProps = {
  input: SearchInput
  results: SearchResults
  facets: SearchFacets
  popularPuzzles: PuzzleCardData[]
  relatedCategories: SearchCategoryHit[]
}

function resultSummary(results: SearchResults, input: SearchInput): string {
  if (!results.hasActiveSearch) {
    return "Saisis un mot-clé ou choisis un filtre pour explorer les grilles."
  }

  const countLabel =
    results.puzzles.totalCount === 0
      ? "Aucun résultat"
      : results.puzzles.totalCount === 1
        ? "1 résultat"
        : `${results.puzzles.totalCount} résultats`

  const queryPart = input.query ? ` pour « ${input.query} »` : ""
  return `${countLabel}${queryPart}`
}

export function SearchResultsTemplate({
  input,
  results,
  facets,
  popularPuzzles,
  relatedCategories,
}: SearchResultsTemplateProps) {
  const showEmptyState = results.hasActiveSearch && results.puzzles.totalCount === 0

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <BreadcrumbTrail
          items={[
            { label: "Accueil", href: ROUTES.home },
            { label: "Recherche", href: ROUTES.recherche },
          ]}
          className="mb-6"
        />

        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow="Recherche"
            title="Trouve ton mots mêlés"
            description="Filtre par thème, niveau scolaire, difficulté ou catégorie éditoriale."
          />

          <SearchBar input={input} />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <SearchFiltersPanel input={input} facets={facets} className="lg:w-72 lg:shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-muted-foreground" aria-live="polite">
                {resultSummary(results, input)}
                {results.hasActiveSearch && results.source === "fallback" ? (
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide">
                    Mode démonstration
                  </span>
                ) : null}
              </p>

              {results.categories.length > 0 && (
                <section className="mt-6">
                  <h2 className="font-heading text-lg font-extrabold text-foreground">
                    Catégories correspondantes
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {results.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={category.href}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-extrabold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-8">
                {showEmptyState ? (
                  <SearchEmptyState
                    query={input.query}
                    relatedCategories={relatedCategories}
                    popularPuzzles={popularPuzzles}
                  />
                ) : results.hasActiveSearch ? (
                  <SearchResultsGrid results={results} input={input} />
                ) : (
                  <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
                    <p className="font-heading text-xl font-extrabold text-foreground">
                      Commence ta recherche
                    </p>
                    <p className="mt-2">
                      Par exemple : animaux, CE1, Noël ou facile.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
