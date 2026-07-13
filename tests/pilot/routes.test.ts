import { describe, expect, it } from "vitest"
import {
  mockAnimauxCategoryPageData,
  mockAnimauxPuzzlePageData,
  mockEcoleHubPageData,
  PILOT_PUZZLE_SLUG,
} from "@/lib/db/adapters/mock-pilot"
import {
  resolveEcoleHubPageData,
  resolvePuzzlePageData,
  resolveThemeCategoryPageData,
} from "@/lib/db/queries/pilot"

describe("pilot mock fixtures", () => {
  it("builds ecole hub with breadcrumbs and subcategories", () => {
    const page = mockEcoleHubPageData()
    expect(page.canonicalPath).toBe("/mots-meles-ecole/")
    expect(page.breadcrumbs.length).toBeGreaterThan(1)
    expect(page.subCategories.length).toBeGreaterThan(0)
    expect(page.schema.faqPage).toBeDefined()
    expect(page.schema.itemList.numberOfItems).toBeGreaterThan(0)
  })

  it("builds animaux category with related links", () => {
    const page = mockAnimauxCategoryPageData()
    expect(page).not.toBeNull()
    expect(page!.canonicalPath).toBe("/mots-meles-thematiques/animaux/")
    expect(page!.theme?.slug).toBe("animaux")
    expect(page!.relatedCategories.length).toBeGreaterThan(0)
  })

  it("builds animaux pilot puzzle with grid and schema", () => {
    const puzzle = mockAnimauxPuzzlePageData()
    expect(puzzle.slug).toBe(PILOT_PUZZLE_SLUG)
    expect(puzzle.grid.length).toBeGreaterThan(0)
    expect(puzzle.breadcrumbs.length).toBeGreaterThan(1)
    expect(puzzle.schema.creativeWork["@type"]).toEqual(["CreativeWork", "LearningResource"])
    expect(puzzle.relatedPuzzles.length).toBeGreaterThan(0)
  })
})

describe("pilot resolvers", () => {
  it("falls back to mock ecole hub data", async () => {
    const page = await resolveEcoleHubPageData()
    expect(page.h1).toMatch(/École/i)
  })

  it("returns animaux mock for pilot theme", async () => {
    const page = await resolveThemeCategoryPageData("animaux")
    expect(page?.canonicalPath).toBe("/mots-meles-thematiques/animaux/")
  })

  it("returns sport mock for theme seed slug without DB", async () => {
    const page = await resolveThemeCategoryPageData("sport")
    expect(page?.canonicalPath).toBe("/mots-meles-thematiques/sport/")
  })

  it("returns null for unknown themes without DB", async () => {
    const page = await resolveThemeCategoryPageData("unknown-theme")
    expect(page).toBeNull()
  })

  it("returns pilot puzzle mock by slug", async () => {
    const puzzle = await resolvePuzzlePageData(PILOT_PUZZLE_SLUG)
    expect(puzzle?.title).toMatch(/Animaux/i)
  })

  it("returns null for unknown puzzle slug without DB", async () => {
    const puzzle = await resolvePuzzlePageData("unknown-slug")
    expect(puzzle).toBeNull()
  })
})
