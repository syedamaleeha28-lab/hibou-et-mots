import { describe, expect, it } from "vitest"
import { buildContentPageMetadata } from "@/lib/seo/metadata"
import type { ContentPageData } from "@/lib/db/types/content-page-data"
import { ROUTES } from "@/lib/seo/routes"

const SAMPLE_PAGE: ContentPageData = {
  slug: "solutions",
  variant: "editorial",
  h1: "Solutions et Règles des Mots Mêlés",
  introText: "Tout savoir sur les règles des mots mêlés.",
  seoTitle: "Solutions et Règles des Mots Mêlés | Hibou & Mots",
  metaDescription: "Apprenez les règles des mots mêlés et nos conseils pour résoudre une grille.",
  canonicalPath: ROUTES.solutions,
  isIndexable: true,
  breadcrumbs: [
    { label: "Accueil", href: ROUTES.home },
    { label: "Solutions et Règles des Mots Mêlés", href: ROUTES.solutions },
  ],
  faqJson: [],
  relatedLinks: [],
  schema: {},
}

describe("buildContentPageMetadata", () => {
  it("uses seo title and description from content page data", async () => {
    const metadata = await buildContentPageMetadata(SAMPLE_PAGE)

    expect(metadata.title).toBe(SAMPLE_PAGE.seoTitle)
    expect(metadata.description).toBe(SAMPLE_PAGE.metaDescription)
    expect(metadata.alternates?.canonical).toContain(ROUTES.solutions)
    expect(metadata.robots).toEqual({ index: true, follow: true })
    expect((metadata.openGraph as { type?: string } | undefined)?.type).toBe("article")
  })

  it("respects isIndexable for robots metadata", async () => {
    const metadata = await buildContentPageMetadata({
      ...SAMPLE_PAGE,
      isIndexable: false,
    })

    expect(metadata.robots).toEqual({ index: false, follow: true })
  })
})
