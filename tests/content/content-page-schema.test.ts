import { describe, expect, it } from "vitest"
import type { ContentPageData } from "@/lib/db/types/content-page-data"
import { buildFaqPageSchema } from "@/lib/seo/schema/faq-page"
import { buildContentPageSchemaGraph } from "@/lib/seo/schema/page-schemas"
import { ROUTES } from "@/lib/seo/routes"

const SAMPLE_CONTENT_PAGE: ContentPageData = {
  slug: "pedagogie",
  variant: "educational",
  h1: "Pédagogie des mots mêlés",
  introText: "Guide pour enseignants et parents.",
  seoTitle: "Pédagogie des mots mêlés — Guide pour enseignants et parents",
  metaDescription: "Guide pédagogique des mots mêlés pour la classe et la maison.",
  canonicalPath: ROUTES.pedagogie,
  isIndexable: true,
  breadcrumbs: [
    { label: "Accueil", href: ROUTES.home },
    { label: "Pédagogie des mots mêlés", href: ROUTES.pedagogie },
  ],
  faqJson: [
    {
      question: "Les mots mêlés aident-ils à apprendre le français ?",
      answer: "Oui, ils soutiennent le vocabulaire et la lecture.",
    },
  ],
  relatedLinks: [
    {
      id: "hub-ecole",
      label: "Mots mêlés École",
      href: ROUTES.ecoleHub,
      description: "Grilles par niveau scolaire.",
    },
  ],
  showAuthorAttribution: true,
  illustration: {
    src: "/mascot-wave.png",
    alt: "Hibou, la mascotte",
  },
  schema: {
    faqPage: buildFaqPageSchema([
      {
        question: "Les mots mêlés aident-ils à apprendre le français ?",
        answer: "Oui, ils soutiennent le vocabulaire et la lecture.",
      },
    ]),
  },
}

describe("buildContentPageSchemaGraph", () => {
  it("includes breadcrumb, FAQ and WebPage nodes without ItemList", () => {
    const graph = buildContentPageSchemaGraph(SAMPLE_CONTENT_PAGE) as {
      "@graph": Array<Record<string, unknown>>
    }

    const types = graph["@graph"].map((node) => node["@type"])
    expect(types).toContain("BreadcrumbList")
    expect(types).toContain("FAQPage")
    expect(types).toContain("WebPage")
    expect(types).not.toContain("ItemList")
  })

  it("omits WebPage when author attribution is disabled", () => {
    const graph = buildContentPageSchemaGraph({
      ...SAMPLE_CONTENT_PAGE,
      slug: "personnages",
      showAuthorAttribution: false,
    }) as { "@graph": Array<Record<string, unknown>> }

    const types = graph["@graph"].map((node) => node["@type"])
    expect(types).not.toContain("WebPage")
  })
})

describe("ContentPageData fixture", () => {
  it("defines editorial and educational variants", () => {
    const editorial: ContentPageData["variant"] = "editorial"
    const educational: ContentPageData["variant"] = "educational"
    expect(editorial).toBe("editorial")
    expect(educational).toBe("educational")
    expect(SAMPLE_CONTENT_PAGE.relatedLinks[0]?.href).toBe(ROUTES.ecoleHub)
  })
})
