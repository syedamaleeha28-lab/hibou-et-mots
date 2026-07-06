import { describe, expect, it } from "vitest"
import { shouldUseEmptyCatalogMode } from "@/lib/category/catalog-layout"

describe("shouldUseEmptyCatalogMode", () => {
  it("enables empty catalog mode for zero-puzzle catalog slugs", () => {
    expect(shouldUseEmptyCatalogMode({ slug: "hub-presse", puzzleCount: 0 })).toBe(true)
    expect(shouldUseEmptyCatalogMode({ slug: "geant", puzzleCount: 0 })).toBe(true)
    expect(shouldUseEmptyCatalogMode({ slug: "ouest-france", puzzleCount: 0 })).toBe(true)
  })

  it("does not enable empty catalog mode for static-support editorial slugs", () => {
    expect(shouldUseEmptyCatalogMode({ slug: "pedagogie", puzzleCount: 0 })).toBe(false)
    expect(shouldUseEmptyCatalogMode({ slug: "solutions", puzzleCount: 0 })).toBe(false)
    expect(shouldUseEmptyCatalogMode({ slug: "ressources-enseignants", puzzleCount: 0 })).toBe(
      false,
    )
  })

  it("does not enable empty catalog mode when puzzles exist", () => {
    expect(shouldUseEmptyCatalogMode({ slug: "hub-presse", puzzleCount: 12 })).toBe(false)
    expect(shouldUseEmptyCatalogMode({ slug: "pedagogie", puzzleCount: 4 })).toBe(false)
  })
})
