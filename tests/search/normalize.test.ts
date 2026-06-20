import { describe, expect, it } from "vitest"
import {
  buildSearchHref,
  hasActiveSearch,
  normalizeSearchQuery,
  normalizeSearchText,
  parseSearchInput,
} from "@/lib/search/normalize"

describe("search normalize", () => {
  it("normalizes accents and casing", () => {
    expect(normalizeSearchText("Noël École")).toBe("noel ecole")
  })

  it("trims and caps query length", () => {
    expect(normalizeSearchQuery("  animaux   ")).toBe("animaux")
    expect(normalizeSearchQuery("a".repeat(140)).length).toBe(120)
  })

  it("parses search params", () => {
    const input = parseSearchInput({
      q: "animaux",
      theme: "animaux",
      grade: "ce1",
      difficulty: "facile",
      category: "animaux-ce1",
      page: "2",
    })

    expect(input).toEqual({
      query: "animaux",
      filters: {
        theme: "animaux",
        grade: "ce1",
        difficulty: "facile",
        category: "animaux-ce1",
      },
      page: 2,
    })
  })

  it("builds canonical search hrefs", () => {
    expect(buildSearchHref({ query: "noel", filters: { grade: "ce1" }, page: 2 })).toBe(
      "/recherche/?q=noel&grade=ce1&page=2",
    )
    expect(buildSearchHref({})).toBe("/recherche/")
  })

  it("detects active search state", () => {
    expect(hasActiveSearch({ query: "", filters: {}, page: 1 })).toBe(false)
    expect(hasActiveSearch({ query: "sport", filters: {}, page: 1 })).toBe(true)
    expect(
      hasActiveSearch({ query: "", filters: { theme: "sport" }, page: 1 }),
    ).toBe(true)
  })
})
