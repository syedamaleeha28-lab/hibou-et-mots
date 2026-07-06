import { describe, expect, it } from "vitest"
import { mapCategoryToContentPageData } from "@/lib/db/adapters/content-page-mappers"
import { mockStaticSupportCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { resolveSolutionsContentPageData } from "@/lib/db/queries/content-resolvers"
import { getCategoryExploreLinks } from "@/lib/seo/linking/category-explore-links"
import {
  buildCategoryPageSchemaGraph,
  buildContentPageSchemaGraph,
} from "@/lib/seo/schema/page-schemas"
import { ROUTES } from "@/lib/seo/routes"

describe("solutions page migration", () => {
  const categoryPage = mockStaticSupportCategoryPageData(ROUTES.solutions)
  const contentPage = mapCategoryToContentPageData(categoryPage, "editorial")

  it("preserves editorial fields from the category fixture", () => {
    expect(contentPage.canonicalPath).toBe("/solutions-regles-mots-meles/")
    expect(contentPage.h1).toBe(categoryPage.h1)
    expect(contentPage.introText).toBe(categoryPage.introText)
    expect(contentPage.seoTitle).toBe(categoryPage.seoTitle)
    expect(contentPage.metaDescription).toBe(categoryPage.metaDescription)
    expect(contentPage.breadcrumbs).toEqual(categoryPage.breadcrumbs)
    expect(contentPage.faqJson).toEqual(categoryPage.faqJson)
    expect(contentPage.relatedLinks.map((link) => link.href)).toEqual(
      categoryPage.relatedCategories.map((link) => link.href),
    )
    expect(contentPage.exploreLinks).toEqual(getCategoryExploreLinks(categoryPage))
  })

  it("drops ItemList schema and keeps FAQ and WebPage nodes", () => {
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
    expect(newTypes).toContain("BreadcrumbList")
    expect(newTypes).toContain("FAQPage")
    expect(newTypes).toContain("WebPage")
  })

  it("resolves solutions content page data", async () => {
    const page = await resolveSolutionsContentPageData()
    expect(page?.slug).toBe("solutions")
    expect(page?.variant).toBe("editorial")
    expect(page?.canonicalPath).toBe(ROUTES.solutions)
  })

  it("keeps FAQ questions visible in migrated content", () => {
    const faqQuestions = contentPage.faqJson.map((item) => item.question)
    expect(faqQuestions).toContain("Que contient la page Solutions et règles ?")
    expect(faqQuestions).toContain("Où voir la solution d'une grille en cours ?")
    expect(faqQuestions).toContain("Les règles diffèrent-elles selon la difficulté ?")
  })

  it("keeps intro copy unchanged", () => {
    expect(contentPage.introText).toContain("règles des mots mêlés")
    expect(contentPage.introText).toContain("résoudre une grille plus rapidement")
  })
})
