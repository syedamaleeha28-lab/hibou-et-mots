import { describe, expect, it } from "vitest"
import { computeIsIndexable, robotsDirective } from "@/lib/seo/indexability"
import { buildCategoryMetadata } from "@/lib/seo/metadata"
import type { CategoryPageData } from "@/lib/db/types/page-data"

const baseCategory: CategoryPageData = {
  id: "cat-1",
  type: "GRADE",
  slug: "ce1",
  h1: "Mots mêlés CE1",
  introText: "Intro",
  faqJson: [],
  seoTitle: "Mots mêlés CE1 gratuits",
  metaDescription: "Description CE1",
  canonicalPath: "/mots-meles-ecole/ce1/",
  isIndexable: true,
  puzzleCount: 8,
  minPuzzleThreshold: 4,
  breadcrumbs: [],
  subCategories: [],
  puzzles: {
    items: [],
    page: 1,
    pageSize: 24,
    totalCount: 0,
    totalPages: 1,
  },
  relatedCategories: [],
  schema: { itemList: { "@context": "https://schema.org", "@type": "ItemList", name: "x", numberOfItems: 0, itemListElement: [] } },
}

describe("indexability", () => {
  it("requires published status and puzzle threshold", () => {
    expect(
      computeIsIndexable({
        status: "PUBLISHED",
        puzzleCount: 4,
        minPuzzleThreshold: 4,
      }),
    ).toBe(true)

    expect(
      computeIsIndexable({
        status: "PUBLISHED",
        puzzleCount: 3,
        minPuzzleThreshold: 4,
      }),
    ).toBe(false)
  })

  it("noindexes thin paginated categories", () => {
    expect(
      robotsDirective({ pageType: "category", isIndexable: true, page: 2 }).index,
    ).toBe(false)
  })
})

describe("buildCategoryMetadata", () => {
  it("returns canonical and robots for non-indexable categories", async () => {
    const metadata = await buildCategoryMetadata(
      { ...baseCategory, isIndexable: false },
      1,
      "https://example.test",
    )

    expect(metadata.alternates?.canonical).toBe("https://example.test/mots-meles-ecole/ce1/")
    expect(metadata.robots).toBe("noindex, follow")
  })
})
