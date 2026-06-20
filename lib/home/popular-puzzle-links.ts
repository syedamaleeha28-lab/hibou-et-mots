import type { DifficultySlug } from "@/lib/puzzle-engine"
import { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/category-constants"
import { getSeedPuzzlePlan } from "@/lib/db/adapters/puzzle-catalog"
import { popularPuzzles } from "@/lib/content"
import { puzzlePath } from "@/lib/seo/routes"

/** Candidate seed theme slugs per homepage display theme (ordered by preference). */
const POPULAR_THEME_CANDIDATES: Record<string, string[]> = {
  Animaux: ["animaux"],
  Espace: ["sport", "couleurs", "vocabulaire"],
  Fruits: ["fruits"],
  Musique: ["vocabulaire", "couleurs"],
  Géographie: ["pays-du-monde"],
  Nature: ["animaux", "couleurs"],
}

const DIFFICULTY_LABEL_TO_SLUG: Record<string, DifficultySlug> = {
  Facile: "facile",
  Moyen: "moyen",
  Difficile: "difficile",
}

let cachedSlugByTitle: Record<string, string> | null = null

/** One unique seed slug per homepage popular card (theme + difficulty aware). */
export function getPopularPuzzleSlugByTitle(): Record<string, string> {
  if (cachedSlugByTitle) return cachedSlugByTitle

  const used = new Set<string>()
  const slugByTitle: Record<string, string> = {}
  const plan = getSeedPuzzlePlan()

  for (const card of popularPuzzles) {
    const themeCandidates = POPULAR_THEME_CANDIDATES[card.theme] ?? ["animaux"]
    const difficulty = DIFFICULTY_LABEL_TO_SLUG[card.difficulty] ?? "facile"

    const pick =
      plan.find(
        (spec) =>
          !used.has(spec.slug) &&
          themeCandidates.includes(spec.themeSlug) &&
          spec.difficulty === difficulty,
      ) ??
      plan.find(
        (spec) => !used.has(spec.slug) && themeCandidates.includes(spec.themeSlug),
      ) ??
      plan.find((spec) => !used.has(spec.slug))

    const slug = pick?.slug ?? PILOT_PUZZLE_SLUG
    used.add(slug)
    slugByTitle[card.title] = slug
  }

  cachedSlugByTitle = slugByTitle
  return slugByTitle
}

/** Resolve href for homepage popular puzzle cards (shared with schema ItemList). */
export function popularPuzzleHref(title: string): string {
  const slug = getPopularPuzzleSlugByTitle()[title] ?? PILOT_PUZZLE_SLUG
  return puzzlePath(slug)
}

export function getPopularPuzzleListItems(): Array<{ name: string; href: string }> {
  return popularPuzzles.map((puzzle) => ({
    name: puzzle.title,
    href: popularPuzzleHref(puzzle.title),
  }))
}
