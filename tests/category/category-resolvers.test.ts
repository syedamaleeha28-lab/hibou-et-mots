import { describe, expect, it } from "vitest"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import {
  mockHubCategoryPageData,
  mockStaticSupportCategoryPageData,
} from "@/lib/db/adapters/mock-categories"
import {
  resolveComboCategoryPageData,
  resolveDifficultyCategoryPageData,
  resolveGradeCategoryPageData,
  resolveHubCategoryPageData,
  resolvePressBrandCategoryPageData,
  resolveSeasonalCategoryPageData,
  resolveStaticSupportCategoryPageData,
  resolveThemeCategoryPageData,
} from "@/lib/db/queries/category-resolvers"
import { ROUTES } from "@/lib/seo/routes"

describe("category mock fixtures", () => {
  it("builds hub pages with breadcrumbs and subcategories", () => {
    const page = mockHubCategoryPageData(HUB_CATEGORY_SLUGS.gratuits)
    expect(page.canonicalPath).toBe("/mots-meles-gratuits/")
    expect(page.breadcrumbs.map((item) => item.label)).toEqual([
      "Accueil",
      "Mots mêlés gratuits — Toutes les grilles",
    ])
    expect(page.breadcrumbs.some((item) => item.label === "École")).toBe(false)
    expect(page.subCategories.length).toBeGreaterThan(0)
    expect(page.schema.faqPage).toBeDefined()
    expect(page.schema.itemList.numberOfItems).toBeGreaterThan(0)
  })

  it("builds static support pages with custom canonical paths", () => {
    const page = mockStaticSupportCategoryPageData(ROUTES.ressources)
    expect(page.canonicalPath).toBe("/ressources-enseignants-mots-meles/")
    expect(page.breadcrumbs.at(-1)?.href).toBe("/ressources-enseignants-mots-meles/")
  })
})

describe("category resolvers", () => {
  it("resolves hub categories from mock data", async () => {
    const page = await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.thematiques)
    expect(page?.canonicalPath).toBe("/mots-meles-thematiques/")
  })

  it("resolves grade categories from mock data", async () => {
    const page = await resolveGradeCategoryPageData("cp")
    expect(page?.canonicalPath).toBe("/mots-meles-ecole/cp/")
  })

  it("resolves theme categories from seed slugs", async () => {
    const page = await resolveThemeCategoryPageData("sport")
    expect(page?.canonicalPath).toBe("/mots-meles-thematiques/sport/")
  })

  it("resolves seasonal categories from MVP slugs", async () => {
    const page = await resolveSeasonalCategoryPageData("noel")
    expect(page?.canonicalPath).toBe("/mots-meles-fetes-saisons/noel/")
  })

  it("resolves difficulty categories", async () => {
    const page = await resolveDifficultyCategoryPageData("facile")
    expect(page?.canonicalPath).toBe("/mots-meles-difficulte/facile/")
  })

  it("resolves combo categories with parent links", async () => {
    const page = await resolveComboCategoryPageData("ce1", "noel")
    expect(page?.canonicalPath).toBe("/mots-meles-ecole/ce1/noel/")
    expect(page?.comboParentLinks?.length).toBeGreaterThan(0)
  })

  it("resolves press brand categories", async () => {
    const page = await resolvePressBrandCategoryPageData("ouest-france")
    expect(page?.canonicalPath).toBe("/mots-meles-journaux-magazines/ouest-france/")
  })

  it("resolves static support pages by canonical path", async () => {
    const page = await resolveStaticSupportCategoryPageData(ROUTES.pedagogie)
    expect(page?.canonicalPath).toBe("/mots-meles-pedagogie/")
  })

  it("returns null for unknown slugs", async () => {
    expect(await resolveThemeCategoryPageData("unknown-theme")).toBeNull()
    expect(await resolveGradeCategoryPageData("unknown-grade")).toBeNull()
    expect(await resolveStaticSupportCategoryPageData("/unknown/")).toBeNull()
  })
})
