import { describe, expect, it } from "vitest"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import {
  mockDifficultyCategoryPageData,
  mockHubCategoryPageData,
  mockPressBrandCategoryPageData,
} from "@/lib/db/adapters/mock-categories"
import { shouldUseEmptyCatalogMode } from "@/lib/category/catalog-layout"

const EMPTY_CATALOG_TARGETS = [
  { label: "géant", getPage: () => mockDifficultyCategoryPageData("geant") },
  { label: "presse hub", getPage: () => mockHubCategoryPageData(HUB_CATEGORY_SLUGS.presse) },
  { label: "Ouest-France", getPage: () => mockPressBrandCategoryPageData("ouest-france") },
  { label: "Sud Ouest", getPage: () => mockPressBrandCategoryPageData("sud-ouest") },
  { label: "La Croix", getPage: () => mockPressBrandCategoryPageData("la-croix") },
] as const

describe("shouldUseEmptyCatalogMode", () => {
  it("enables empty catalog mode for zero-puzzle catalog slugs", () => {
    expect(shouldUseEmptyCatalogMode({ slug: "hub-presse", puzzleCount: 0 })).toBe(true)
    expect(shouldUseEmptyCatalogMode({ slug: "geant", puzzleCount: 0 })).toBe(true)
    expect(shouldUseEmptyCatalogMode({ slug: "ouest-france", puzzleCount: 0 })).toBe(true)
    expect(shouldUseEmptyCatalogMode({ slug: "sud-ouest", puzzleCount: 0 })).toBe(true)
    expect(shouldUseEmptyCatalogMode({ slug: "la-croix", puzzleCount: 0 })).toBe(true)
  })

  it("activates for all intended zero-puzzle category pages", () => {
    for (const target of EMPTY_CATALOG_TARGETS) {
      const page = target.getPage()
      expect(page, `${target.label} page data`).not.toBeNull()
      expect(page?.puzzleCount, `${target.label} puzzle count`).toBe(0)
      expect(shouldUseEmptyCatalogMode(page!), `${target.label} empty catalog mode`).toBe(true)
    }
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
