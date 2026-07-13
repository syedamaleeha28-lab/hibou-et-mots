import type { PuzzleCardData } from "@/lib/db/types/page-data"
import { buildPuzzlePlan, type PuzzleSeedSpec } from "@/prisma/seed/puzzles"
import { difficultySeed } from "@/prisma/seed/difficulties"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"
import { puzzlePath } from "@/lib/seo/routes"

let cachedPlan: PuzzleSeedSpec[] | null = null

/** Canonical seed puzzle list (same slugs as DB after `prisma db seed`). */
export function getSeedPuzzlePlan(): PuzzleSeedSpec[] {
  if (!cachedPlan) {
    cachedPlan = buildPuzzlePlan()
  }
  return cachedPlan
}

const difficultyBySlug = new Map(difficultySeed.map((d) => [d.slug, d]))
const gradeBySlug = new Map(gradeSeed.map((g) => [g.slug, g]))
const themeBySlug = new Map(themeSeed.map((t) => [t.slug, t]))

export function seedSpecToCardData(spec: PuzzleSeedSpec): PuzzleCardData {
  const difficulty = difficultyBySlug.get(spec.difficulty)!
  const grade = spec.gradeSlug ? gradeBySlug.get(spec.gradeSlug) : undefined
  const theme = spec.themeSlug
    ? themeBySlug.get(spec.themeSlug as (typeof themeSeed)[number]["slug"])
    : undefined

  return {
    id: `seed-${spec.slug}`,
    slug: spec.slug,
    title: spec.title,
    href: puzzlePath(spec.slug),
    difficulty: { slug: difficulty.slug, name: difficulty.name },
    ...(grade ? { grade: { slug: grade.slug, name: grade.name } } : {}),
    ...(theme ? { theme: { slug: theme.slug, name: theme.name } } : {}),
    size: 10,
    wordCount: 8,
    viewCount: spec.viewCount,
  }
}

/** Puzzles tagged to a category slug in the seed plan, sorted by viewCount desc. */
export function getSeedPuzzlesForCategory(categorySlug: string, limit = 6): PuzzleCardData[] {
  return getSeedPuzzlePlan()
    .filter((spec) => spec.categorySlugs.includes(categorySlug))
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
    .map(seedSpecToCardData)
}

/** First published puzzle for a theme slug (facile-01 preferred). */
export function getRepresentativeSlugForTheme(themeSlug: string): string | undefined {
  const plan = getSeedPuzzlePlan()
  const preferred = plan.find(
    (spec) => spec.themeSlug === themeSlug && spec.slug.endsWith("-facile-01"),
  )
  if (preferred) return preferred.slug
  return plan.find((spec) => spec.themeSlug === themeSlug)?.slug
}

export function isKnownSeedPuzzleSlug(slug: string): boolean {
  return getSeedPuzzlePlan().some((spec) => spec.slug === slug)
}
