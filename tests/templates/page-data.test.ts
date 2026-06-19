import { describe, expect, it } from "vitest"
import { selectRelatedPuzzles } from "@/lib/seo/related-puzzles"
import { resolveCategoryFaq, resolvePuzzleFaq } from "@/lib/seo/templates"
import { paginatePuzzles } from "@/lib/db/queries/mappers"
import { solutionToLegacyGrid } from "@/lib/puzzle/grid-utils"

describe("selectRelatedPuzzles", () => {
  const candidates = [
    {
      id: "a",
      slug: "a",
      title: "A",
      href: "/mots-meles/a/",
      difficulty: { slug: "facile", name: "Facile" },
      size: 10,
      wordCount: 8,
      themeId: "theme-1",
      gradeId: "grade-1",
      difficultyId: "diff-1",
      viewCount: 10,
    },
    {
      id: "b",
      slug: "b",
      title: "B",
      href: "/mots-meles/b/",
      difficulty: { slug: "moyen", name: "Moyen" },
      size: 12,
      wordCount: 10,
      themeId: "theme-2",
      gradeId: "grade-1",
      difficultyId: "diff-2",
      viewCount: 1,
    },
  ]

  it("prioritizes same theme and grade", () => {
    const selected = selectRelatedPuzzles(candidates, {
      puzzleId: "current",
      themeId: "theme-1",
      gradeId: "grade-1",
      difficultyId: "diff-1",
    })

    expect(selected[0]?.id).toBe("a")
  })
})

describe("faq templates", () => {
  it("returns placeholders when DB faq is empty", () => {
    const faq = resolveCategoryFaq("GRADE", [], false)
    expect(faq.length).toBeGreaterThan(0)
    expect(resolvePuzzleFaq(null).length).toBeGreaterThan(0)
  })
})

describe("paginatePuzzles", () => {
  it("paginates 24 items per page", () => {
    const items = Array.from({ length: 30 }, (_, i) => ({
      id: `p-${i}`,
      slug: `p-${i}`,
      title: `Puzzle ${i}`,
      href: `/mots-meles/p-${i}/`,
      difficulty: { slug: "facile", name: "Facile" },
      size: 10,
      wordCount: 8,
    }))

    const page1 = paginatePuzzles(items, 1, 24)
    expect(page1.items).toHaveLength(24)
    expect(page1.totalPages).toBe(2)

    const page2 = paginatePuzzles(items, 2, 24)
    expect(page2.items).toHaveLength(6)
  })
})

describe("solutionToLegacyGrid", () => {
  it("maps solution cells for WordGrid", () => {
    const grid = solutionToLegacyGrid(
      [
        ["A", "B"],
        ["C", "D"],
      ],
      {
        version: 1,
        size: 2,
        words: [{ word: "AB", cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }] }],
      },
    )

    expect(grid.placements[0]?.cells).toEqual([
      { r: 0, c: 0 },
      { r: 0, c: 1 },
    ])
  })
})
