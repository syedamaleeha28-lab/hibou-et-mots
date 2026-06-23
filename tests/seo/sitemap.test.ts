import { describe, expect, it } from "vitest"
import {
  buildSitemapIndexXml,
  buildUrlSetXml,
  getStaticSitemapEntries,
  puzzleSitemapSegmentPath,
} from "@/lib/seo/sitemap"
import {
  isSitemapEligibleCategory,
  isSitemapEligiblePuzzle,
  shouldNoindexPath,
} from "@/lib/seo/indexability"

describe("sitemap xml", () => {
  it("builds urlset xml", () => {
    const xml = buildUrlSetXml([
      {
        loc: "https://example.test/mots-meles-ecole/",
        priority: 1,
      },
    ])
    expect(xml).toContain("<urlset")
    expect(xml).toContain("https://example.test/mots-meles-ecole/")
  })

  it("builds sitemap index xml", () => {
    const xml = buildSitemapIndexXml([
      "https://example.test/sitemaps/sitemap-static.xml/",
    ])
    expect(xml).toContain("<sitemapindex")
    expect(xml).toContain("sitemap-static.xml")
  })
})

describe("static sitemap entries", () => {
  it("includes home and hub routes", () => {
    const entries = getStaticSitemapEntries("https://example.test")
    const locs = entries.map((entry) => entry.loc)
    expect(locs.some((loc) => loc.endsWith("/"))).toBe(true)
    expect(locs.some((loc) => loc.includes("mots-meles-ecole"))).toBe(true)
    expect(locs.some((loc) => loc.includes("generateur-mots-meles"))).toBe(true)
    expect(locs.some((loc) => loc.includes("jouer-mots-meles-en-ligne"))).toBe(true)
    expect(locs.some((loc) => loc.includes("recherche"))).toBe(false)
  })
})

describe("sitemap eligibility", () => {
  it("requires published status and threshold for categories", () => {
    expect(
      isSitemapEligibleCategory({
        status: "PUBLISHED",
        puzzleCount: 4,
        minPuzzleThreshold: 4,
      }),
    ).toBe(true)
    expect(
      isSitemapEligibleCategory({
        status: "PUBLISHED",
        puzzleCount: 2,
        minPuzzleThreshold: 4,
      }),
    ).toBe(false)
  })

  it("allows only published puzzles", () => {
    expect(isSitemapEligiblePuzzle("PUBLISHED")).toBe(true)
    expect(isSitemapEligiblePuzzle("DRAFT")).toBe(false)
  })

  it("flags utility paths as noindex", () => {
    expect(shouldNoindexPath("/recherche/")).toBe(true)
    expect(shouldNoindexPath("/generateur-mots-meles/resultat/abc/")).toBe(true)
  })
})

describe("puzzle sitemap segments", () => {
  it("uses paginated segment paths", () => {
    expect(puzzleSitemapSegmentPath(0)).toBe("/sitemaps/sitemap-puzzles/0/")
  })
})
