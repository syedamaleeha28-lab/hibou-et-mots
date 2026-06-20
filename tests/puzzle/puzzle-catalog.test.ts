import { describe, expect, it } from "vitest"
import {
  getRepresentativeSlugForTheme,
  getSeedPuzzlesForCategory,
  isKnownSeedPuzzleSlug,
} from "@/lib/db/adapters/puzzle-catalog"
import { getPopularPuzzleListItems, getPopularPuzzleSlugByTitle } from "@/lib/home/popular-puzzle-links"
import { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/category-constants"

describe("puzzle catalog", () => {
  it("returns only seed slugs for category cards", () => {
    const cards = getSeedPuzzlesForCategory("enfants", 6)
    expect(cards.length).toBeGreaterThan(0)
    for (const card of cards) {
      expect(isKnownSeedPuzzleSlug(card.slug)).toBe(true)
      expect(card.slug).not.toMatch(/enfants-facile-\d{2}$/)
    }
  })

  it("resolves homepage popular links to six unique seed slugs", () => {
    const items = getPopularPuzzleListItems()
    const slugs = items.map((item) => item.href.replace(/^\/mots-meles\/|\/$/g, ""))

    expect(items).toHaveLength(6)
    expect(new Set(slugs).size).toBe(6)
    for (const slug of slugs) {
      expect(isKnownSeedPuzzleSlug(slug)).toBe(true)
    }
  })

  it("maps each popular card title to its own slug", () => {
    const slugByTitle = getPopularPuzzleSlugByTitle()
    const slugs = Object.values(slugByTitle)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugByTitle["Les Animaux de la Ferme"]).toBe(PILOT_PUZZLE_SLUG)
    expect(slugByTitle["Les Petites Bêtes"]).not.toBe(PILOT_PUZZLE_SLUG)
    expect(slugByTitle["Le Système Solaire"]).not.toBe(slugByTitle["Les Instruments"])
  })

  it("prefers facile-01 representative per theme", () => {
    expect(getRepresentativeSlugForTheme("animaux")).toBe(PILOT_PUZZLE_SLUG)
    expect(getRepresentativeSlugForTheme("fruits")).toBe("fruits-facile-01")
  })
})
