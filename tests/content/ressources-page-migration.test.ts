import { describe, expect, it } from "vitest"
import { RESSOURCES_ENSEIGNANTS_INTRO } from "@/lib/content/educational-entities"
import {
  RESSOURCES_TEACHER_LINKS,
  ressourcesEnseignantsEditorialPlainText,
} from "@/lib/content/ressources-enseignants"
import { mapCategoryToContentPageData } from "@/lib/db/adapters/content-page-mappers"
import { mockStaticSupportCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { resolveRessourcesContentPageData } from "@/lib/db/queries/content-resolvers"
import { getCategoryExploreLinks } from "@/lib/seo/linking/category-explore-links"
import { buildCategoryMetadata } from "@/lib/seo/metadata"
import {
  buildCategoryPageSchemaGraph,
  buildContentPageSchemaGraph,
} from "@/lib/seo/schema/page-schemas"
import { ROUTES } from "@/lib/seo/routes"

describe("ressources enseignants page migration", () => {
  const categoryPage = mockStaticSupportCategoryPageData(ROUTES.ressources)
  const contentPage = mapCategoryToContentPageData(categoryPage, "educational")

  it("preserves educational fields from the category fixture", () => {
    expect(contentPage.canonicalPath).toBe("/ressources-enseignants-mots-meles/")
    expect(contentPage.variant).toBe("educational")
    expect(contentPage.h1).toBe(categoryPage.h1)
    expect(contentPage.introText).toBe(RESSOURCES_ENSEIGNANTS_INTRO)
    expect(contentPage.introText).toBe(categoryPage.introText)
    expect(contentPage.seoTitle).toBe(categoryPage.seoTitle)
    expect(contentPage.metaDescription).toBe(categoryPage.metaDescription)
    expect(contentPage.breadcrumbs).toEqual(categoryPage.breadcrumbs)
    expect(contentPage.faqJson).toEqual(categoryPage.faqJson)
    expect(contentPage.relatedLinks.map((link) => link.href)).toEqual(
      categoryPage.relatedCategories.map((link) => link.href),
    )
    expect(contentPage.exploreLinks).toEqual(getCategoryExploreLinks(categoryPage))
    expect(contentPage.showAuthorAttribution).toBe(true)
  })

  it("keeps metadata identical to the category page source", async () => {
    const categoryMetadata = await buildCategoryMetadata(categoryPage)
    const migratedMetadata = await buildCategoryMetadata(categoryPage)

    expect(JSON.stringify(migratedMetadata)).toBe(JSON.stringify(categoryMetadata))
  })

  it("emits only WebPage, FAQPage, and BreadcrumbList schema nodes", () => {
    const oldGraph = buildCategoryPageSchemaGraph(categoryPage) as {
      "@graph": Array<Record<string, unknown>>
    }
    const newGraph = buildContentPageSchemaGraph(contentPage) as {
      "@graph": Array<Record<string, unknown>>
    }

    const oldTypes = oldGraph["@graph"].map((node) => node["@type"])
    const newTypes = newGraph["@graph"].map((node) => node["@type"])

    expect(oldTypes).toContain("ItemList")
    expect(newTypes).not.toContain("ItemList")
    expect(newTypes.sort()).toEqual(["BreadcrumbList", "FAQPage", "WebPage"])
  })

  it("resolves ressources content page data", async () => {
    const page = await resolveRessourcesContentPageData()
    expect(page?.slug).toBe("ressources-enseignants")
    expect(page?.variant).toBe("educational")
    expect(page?.canonicalPath).toBe(ROUTES.ressources)
  })

  it("preserves category explore links and editorial teacher links", () => {
    expect(contentPage.exploreLinks.length).toBeGreaterThan(0)
    expect(RESSOURCES_TEACHER_LINKS.length).toBeGreaterThanOrEqual(10)
    expect(ressourcesEnseignantsEditorialPlainText().length).toBeGreaterThan(500)
  })
})
