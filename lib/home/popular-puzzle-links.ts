import { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/category-constants"
import { popularPuzzles } from "@/lib/content"
import { puzzlePath } from "@/lib/seo/routes"

/** Resolve href for homepage popular puzzle cards (shared with schema ItemList). */
export function popularPuzzleHref(title: string): string {
  if (title === "Mots mêlés Animaux — Facile") {
    return puzzlePath(PILOT_PUZZLE_SLUG)
  }
  return puzzlePath("animaux-facile-01")
}

export function getPopularPuzzleListItems(): Array<{ name: string; href: string }> {
  return popularPuzzles.map((puzzle) => ({
    name: puzzle.title,
    href: popularPuzzleHref(puzzle.title),
  }))
}
