import Link from "next/link"
import type { SearchInput, SearchResults } from "@/lib/search/types"
import { buildSearchHref } from "@/lib/search/normalize"
import { PuzzleCard } from "@/components/cards/puzzle-card"
import { cn } from "@/lib/utils"

type SearchResultsGridProps = {
  results: SearchResults
  input: SearchInput
}

export function SearchResultsGrid({ results, input }: SearchResultsGridProps) {
  const { puzzles } = results

  if (puzzles.items.length === 0) {
    return null
  }

  return (
    <section aria-label="Résultats de recherche">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {puzzles.items.map((puzzle) => (
          <PuzzleCard key={puzzle.id} puzzle={puzzle} />
        ))}
      </div>

      {puzzles.totalPages > 1 && (
        <nav
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          aria-label="Pagination des résultats"
        >
          {Array.from({ length: puzzles.totalPages }, (_, index) => index + 1).map((page) => (
            <Link
              key={page}
              href={buildSearchHref({
                query: input.query,
                filters: input.filters,
                page,
              })}
              className={cn(
                "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-extrabold transition-colors",
                page === puzzles.page
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
              aria-current={page === puzzles.page ? "page" : undefined}
            >
              {page}
            </Link>
          ))}
        </nav>
      )}
    </section>
  )
}
