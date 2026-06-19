import { describe, expect, it } from "vitest"
import {
  buildCategoryPageSchemaGraph,
  buildPuzzlePageSchemaGraph,
  buildSchemaGraph,
} from "@/lib/seo/schema"

describe("schema graph", () => {
  it("composes @graph with breadcrumb, item list, and faq", () => {
    const graph = buildCategoryPageSchemaGraph({
      h1: "Mots mêlés CE1",
      breadcrumbs: [
        { label: "Accueil", href: "/" },
        { label: "École", href: "/mots-meles-ecole/" },
        { label: "CE1", href: "/mots-meles-ecole/ce1/" },
      ],
      puzzles: {
        items: [
          {
            id: "1",
            slug: "test",
            title: "Test",
            href: "/mots-meles/test/",
            difficulty: { slug: "facile", name: "Facile" },
            size: 10,
            wordCount: 8,
          },
        ],
        page: 1,
        pageSize: 24,
        totalCount: 1,
        totalPages: 1,
      },
      schema: {
        itemList: {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Mots mêlés CE1",
          numberOfItems: 1,
          itemListElement: [],
        },
        faqPage: {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Question?",
              acceptedAnswer: { "@type": "Answer", text: "Réponse." },
            },
          ],
        },
      },
    })

    expect(graph["@context"]).toBe("https://schema.org")
    expect(Array.isArray(graph["@graph"])).toBe(true)
    expect((graph["@graph"] as unknown[]).length).toBe(3)
  })

  it("composes puzzle creative work graph", () => {
    const graph = buildPuzzlePageSchemaGraph({
      title: "Animaux de la ferme",
      canonicalPath: "/mots-meles/animaux-facile-01/",
      metaDescription: "Description",
      difficulty: { slug: "facile", name: "Facile" },
      theme: { slug: "animaux", name: "Animaux" },
      breadcrumbs: [{ label: "Accueil", href: "/" }],
      schema: {
        creativeWork: {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Animaux de la ferme",
          url: "https://example.test/mots-meles/animaux-facile-01/",
          inLanguage: "fr-FR",
          learningResourceType: "puzzle",
          isAccessibleForFree: true,
        },
        faqPage: undefined,
      },
    })

    const nodes = graph["@graph"] as Array<Record<string, unknown>>
    expect(nodes.some((node) => node["@type"] === "CreativeWork")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "BreadcrumbList")).toBe(true)
  })

  it("builds empty-safe graph", () => {
    const graph = buildSchemaGraph([
      {
        "@context": "https://schema.org",
        "@type": "Thing",
        name: "Test",
      },
    ])
    expect((graph["@graph"] as unknown[]).length).toBe(1)
  })
})
