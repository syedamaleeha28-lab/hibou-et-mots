import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { PuzzleCard } from "@/components/cards/puzzle-card"
import { SectionHeading } from "@/components/layout/section-heading"

type RelatedPuzzlesGridProps = {
  puzzles: PuzzlePageData["relatedPuzzles"]
}

export function RelatedPuzzlesGrid({ puzzles }: RelatedPuzzlesGridProps) {
  if (puzzles.length === 0) return null

  return (
    <section>
      <SectionHeading
        align="left"
        eyebrow="Similaires"
        title="Mots mêlés similaires"
        description="Découvre d'autres grilles du même thème, niveau ou difficulté."
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {puzzles.map((puzzle) => (
          <PuzzleCard key={puzzle.id} puzzle={puzzle} />
        ))}
      </div>
    </section>
  )
}
