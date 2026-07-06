import { describe, expect, it } from "vitest"
import { mapCategoryToContentPageData } from "@/lib/db/adapters/content-page-mappers"
import { mockStaticSupportCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { resolvePersonnagesContentPageData } from "@/lib/db/queries/content-resolvers"
import { getCategoryExploreLinks } from "@/lib/seo/linking/category-explore-links"
import { buildCategoryMetadata } from "@/lib/seo/metadata"
import {
  buildCategoryPageSchemaGraph,
  buildContentPageSchemaGraph,
} from "@/lib/seo/schema/page-schemas"
import { ROUTES } from "@/lib/seo/routes"

describe("personnages page migration", () => {
  const categoryPage = mockStaticSupportCategoryPageData(ROUTES.personnages)
  const contentPage = mapCategoryToContentPageData(categoryPage, "editorial")

  it("preserves editorial fields from the category fixture", () => {
    expect(contentPage.canonicalPath).toBe("/mots-meles-personnages/")
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

  it("keeps metadata aligned with the category page source", async () => {
    const categoryMetadata = await buildCategoryMetadata(categoryPage)
    const contentMetadata = await buildCategoryMetadata({
      ...categoryPage,
      canonicalPath: contentPage.canonicalPath,
    })

    expect(contentMetadata.title).toBe(categoryMetadata.title)
    expect(contentMetadata.description).toBe(categoryMetadata.description)
    expect(contentMetadata.robots).toEqual(categoryMetadata.robots)
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

  it("resolves personnages content page data", async () => {
    const page = await resolvePersonnagesContentPageData()
    expect(page?.slug).toBe("personnages")
    expect(page?.variant).toBe("editorial")
    expect(page?.canonicalPath).toBe(ROUTES.personnages)
  })

  it("keeps FAQ questions and intro copy unchanged", () => {
    const faqQuestions = contentPage.faqJson.map((item) => item.question)
    expect(faqQuestions).toContain("Qui est Hibou sur la page Personnages ?")
    expect(faqQuestions).toContain("Les personnages apparaissent-ils dans les grilles ?")
    expect(faqQuestions).toContain("Cette page Personnages est-elle pour les enfants ?")
    expect(contentPage.introText).toContain("univers de Hibou&Mots")
    expect(contentPage.introText).toContain("personnages qui accompagnent les enfants")
  })
})
