import Link from "next/link"
import type { CategoryPageData } from "@/lib/db/types/page-data"
import { PuzzleCard } from "@/components/cards/puzzle-card"
import { AdSlotPlaceholder } from "@/components/templates/shared/ad-slot-placeholder"
import { SectionHeading } from "@/components/layout/section-heading"
import { cn } from "@/lib/utils"

type PuzzleCardGridProps = {
  category: Pick<CategoryPageData, "h1" | "puzzles" | "canonicalPath">
}

function pageHref(canonicalPath: string, page: number): string {
  if (page <= 1) return canonicalPath
  return `${canonicalPath}?page=${page}`
}

export function PuzzleCardGrid({ category }: PuzzleCardGridProps) {
  const { puzzles, canonicalPath } = category

  return (
    <section>
      <SectionHeading
        align="left"
        eyebrow="Grilles"
        title="Mots mêlés à jouer et imprimer"
        description={`${puzzles.totalCount} grilles disponibles dans cette catégorie.`}
      />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {puzzles.items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
              Les grilles de cette catégorie seront bientôt disponibles.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {puzzles.items.map((puzzle, index) => (
                <div key={puzzle.id} className="contents">
                  <PuzzleCard puzzle={puzzle} />
                  {(index + 1) % 8 === 0 && (
                    <div className="col-span-full">
                      <AdSlotPlaceholder variant="in-feed" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {puzzles.totalPages > 1 && (
            <nav
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
              aria-label="Pagination des grilles"
            >
              {Array.from({ length: puzzles.totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={pageHref(canonicalPath, page)}
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
        </div>

        <aside className="hidden w-[300px] shrink-0 lg:block">
          <AdSlotPlaceholder variant="sidebar" className="sticky top-24" />
        </aside>
      </div>
    </section>
  )
}
