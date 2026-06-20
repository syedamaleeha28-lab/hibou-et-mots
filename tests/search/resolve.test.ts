import { describe, expect, it } from "vitest"
import { resolveSearchResults } from "@/lib/search/resolve"

describe("resolveSearchResults", () => {
  it("returns idle state when no query or filters", async () => {
    const results = await resolveSearchResults({
      query: "",
      filters: {},
      page: 1,
    })

    expect(results.hasActiveSearch).toBe(false)
    expect(results.puzzles.totalCount).toBe(0)
    expect(results.source).toBe("fallback")
  })

  it("uses fallback catalog under vitest", async () => {
    const results = await resolveSearchResults({
      query: "animaux",
      filters: {},
      page: 1,
    })

    expect(results.hasActiveSearch).toBe(true)
    expect(results.source).toBe("fallback")
    expect(results.puzzles.totalCount).toBeGreaterThan(0)
  })

  it("respects facet filters in fallback mode", async () => {
    const results = await resolveSearchResults({
      query: "mots",
      filters: { difficulty: "facile" },
      page: 1,
    })

    expect(results.puzzles.items.every((item) => item.difficulty.slug === "facile")).toBe(true)
  })
})
