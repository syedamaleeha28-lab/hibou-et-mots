import type { CategoryPageData } from "@/lib/db/types/page-data"
import { DifficultyPill } from "@/components/ui/difficulty-pill"

type CategoryIntroProps = {
  category: Pick<
    CategoryPageData,
    "h1" | "introText" | "puzzleCount" | "grade" | "theme" | "difficulty" | "type"
  >
}

export function CategoryIntro({ category }: CategoryIntroProps) {
  const badge =
    category.grade?.name ??
    category.theme?.name ??
    category.difficulty?.name ??
    undefined

  return (
    <header className="flex flex-col gap-4">
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
        {category.h1}
      </h1>
      <div className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          {category.introText.split("\n\n").map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="text-base leading-relaxed text-foreground/90 sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-extrabold text-muted-foreground">
            {category.puzzleCount} grilles
          </span>
          {badge && (
            <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-extrabold text-secondary">
              {badge}
            </span>
          )}
          {category.difficulty && (
            <DifficultyPill
              slug={category.difficulty.slug}
              name={category.difficulty.name}
            />
          )}
        </div>
      </div>
    </header>
  )
}
