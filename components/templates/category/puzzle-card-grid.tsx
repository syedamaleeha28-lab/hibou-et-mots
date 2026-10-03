import Link from "next/link"
import type { CategoryPageData } from "@/lib/db/types/page-data"
import { PuzzleCard } from "@/components/cards/puzzle-card"
import { AdSlotPlaceholder } from "@/components/templates/shared/ad-slot-placeholder"
import { SectionHeading } from "@/components/layout/section-heading"
import { cn } from "@/lib/utils"

type PuzzleCardGridProps = {
  category: Pick<CategoryPageData, "h1" | "puzzles" | "canonicalPath">
  heading?: string
  // NEW: was hardcoded French throughout (default title, eyebrow,
  // count-line template, empty state, pagination aria-label) — this is
  // the page's actual primary content, not decorative chrome, so it
  // needed real translation rather than suppression. `heading` (the
  // existing override prop, used by the hub-imprimer chrome override)
  // still takes priority over the locale default when provided.
  locale?: "fr" | "pt-BR"
}

const COPY = {
  fr: {
    eyebrow: "Grilles",
    defaultTitle: "Mots mêlés à jouer et imprimer",
    description: (count: number) => `${count} grilles disponibles dans cette catégorie.`,
    emptyState: "Les grilles de cette catégorie seront bientôt disponibles.",
    paginationLabel: "Pagination des grilles",
  },
  "pt-BR": {
    eyebrow: "Grades",
    defaultTitle: "Caça-palavras para jogar e imprimir",
    description: (count: number) => `${count} grades disponíveis nesta categoria.`,
    emptyState: "As grades desta categoria estarão disponíveis em breve.",
    paginationLabel: "Paginação das grades",
  },
} as const

function pageHref(canonicalPath: string, page: number): string {
  if (page <= 1) return canonicalPath
  return `${canonicalPath}?page=${page}`
}

export function PuzzleCardGrid({ category, heading, locale = "fr" }: PuzzleCardGridProps) {
  const { puzzles, canonicalPath } = category
  const copy = COPY[locale]

  return (
    <section>
      <SectionHeading
        align="left"
        eyebrow={copy.eyebrow}
        title={heading ?? copy.defaultTitle}
        description={copy.description(puzzles.totalCount)}
      />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {puzzles.items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
              {copy.emptyState}
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
              aria-label={copy.paginationLabel}
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
