import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { DifficultyPill } from "@/components/ui/difficulty-pill"

type PuzzleHeaderProps = {
  puzzle: Pick<
    PuzzlePageData,
    "title" | "theme" | "grade" | "difficulty" | "size"
  >
}

export function PuzzleHeader({ puzzle }: PuzzleHeaderProps) {
  const themeLabel = puzzle.theme?.name ?? puzzle.grade?.name ?? "Mots mêlés"
  const h1 = `Mots Mêlés ${themeLabel} — ${puzzle.title}`

  return (
    <header className="flex flex-col gap-4">
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
        {h1}
      </h1>
      <div className="flex flex-wrap gap-2">
        {puzzle.grade && (
          <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-extrabold text-secondary">
            {puzzle.grade.name}
          </span>
        )}
        <DifficultyPill slug={puzzle.difficulty.slug} name={puzzle.difficulty.name} />
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-extrabold text-muted-foreground">
          {puzzle.size}×{puzzle.size}
        </span>
      </div>
    </header>
  )
}
