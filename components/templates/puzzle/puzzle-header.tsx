import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { DifficultyPill } from "@/components/ui/difficulty-pill"

type PuzzleHeaderProps = {
  puzzle: Pick<
    PuzzlePageData,
    "title" | "theme" | "grade" | "difficulty" | "size" | "language"
  >
}

// PT-BR pack: the H1 prefix was hardcoded to "Mots Mêlés" regardless of
// puzzle language — meant every Portuguese puzzle page showed a French
// title even though puzzle.title itself was already correctly localized.
// Also fixes a duplication bug: PT puzzle titles already include the
// theme name ("Caça-Palavras Animais — 01"), so prepending
// "{prefix} {themeLabel} —" a second time repeated it.
const H1_PREFIX_BY_LANGUAGE: Record<string, string> = {
  fr: "Mots Mêlés",
  "pt-BR": "Caça-Palavras",
}

export function PuzzleHeader({ puzzle }: PuzzleHeaderProps) {
  const prefix = H1_PREFIX_BY_LANGUAGE[puzzle.language ?? "fr"] ?? H1_PREFIX_BY_LANGUAGE.fr
  const themeLabel = puzzle.theme?.name ?? puzzle.grade?.name ?? prefix
  const h1 = `${prefix} ${themeLabel} — ${puzzle.title}`
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
