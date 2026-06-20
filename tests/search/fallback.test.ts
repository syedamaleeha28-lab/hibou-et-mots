import { describe, expect, it } from "vitest"
import {
  getPopularPuzzlesForSearch,
  getRelatedCategoriesForSearch,
  searchPuzzlesFallback,
} from "@/lib/search/fallback"

describe("search fallback", () => {
  it("finds puzzles by title and theme", () => {
    const results = searchPuzzlesFallback({
      query: "animaux",
      filters: {},
      page: 1,
    })

    expect(results.puzzles.totalCount).toBeGreaterThan(0)
    expect(results.puzzles.items.some((item) => item.theme?.slug === "animaux")).toBe(true)
  })

  it("filters by grade slug", () => {
    const results = searchPuzzlesFallback({
      query: "",
      filters: { grade: "ce1" },
      page: 1,
    })

    expect(results.puzzles.totalCount).toBeGreaterThan(0)
    expect(results.puzzles.items.every((item) => item.grade?.slug === "ce1")).toBe(true)
  })

  it("returns category hits for thematic queries", () => {
    const results = searchPuzzlesFallback({
      query: "noel",
      filters: {},
      page: 1,
    })

    expect(results.categories.some((entry) => entry.slug === "noel")).toBe(true)
  })

  it("exposes popular puzzles and related categories for empty state", () => {
    expect(getPopularPuzzlesForSearch(3)).toHaveLength(3)
    expect(getRelatedCategoriesForSearch("animaux", 4).length).toBeGreaterThan(0)
  })
})
