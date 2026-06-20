import { describe, expect, it } from "vitest"
import { mockEcoleHubPageData } from "@/lib/db/adapters/mock-categories"
import {
  GENERATOR_FEATURE_LIST,
  ONLINE_PLAY_FEATURE_LIST,
  buildSoftwareApplicationSchema,
  isChildOrientedPuzzle,
} from "@/lib/seo/schema"
import { ROUTES } from "@/lib/seo/routes"

describe("phase 2 schema", () => {
  it("builds SoftwareApplication with featureList", () => {
    const schema = buildSoftwareApplicationSchema({
      name: "Test",
      description: "Desc",
      path: ROUTES.generateur,
      featureList: GENERATOR_FEATURE_LIST,
    }) as Record<string, unknown>

    expect(schema.featureList).toEqual(GENERATOR_FEATURE_LIST)
    expect(Array.isArray(ONLINE_PLAY_FEATURE_LIST)).toBe(true)
  })

  it("lists school levels on ecole hub ItemList", () => {
    const page = mockEcoleHubPageData()
    const list = page.schema.itemList

    expect(list["@type"]).toBe("ItemList")
    expect(list.numberOfItems).toBe(7)
    expect(list.itemListElement.every((item) => item.url.includes("/mots-meles-ecole/"))).toBe(
      true,
    )
  })

  it("detects child-oriented puzzles by grade or audience", () => {
    expect(isChildOrientedPuzzle({ grade: { slug: "cp", name: "CP" } })).toBe(true)
    expect(isChildOrientedPuzzle({ parentCategorySlugs: ["enfants"] })).toBe(true)
    expect(isChildOrientedPuzzle({ grade: { slug: "adultes", name: "Adultes" } })).toBe(false)
  })
})
