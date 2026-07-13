import { ROUTES, absoluteUrl, DEFAULT_SITE_URL } from "@/lib/seo/routes"
import type { CollectionPageSchema } from "./types"

/**
 * CollectionPage node for category/listing pages (grade, theme, seasonal, difficulty, audience).
 * Google documents CollectionPage as the preferred type for listing pages — this supplements
 * the existing ItemList rather than replacing it: mainEntity references the ItemList's @id so
 * both nodes stay linked in the same @graph.
 */
export function buildCollectionPageSchema(input: {
  path: string
  name: string
  description: string
  siteUrl?: string
  itemListId: string
  numberOfItems?: number
}): CollectionPageSchema {
  const base = (input.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  const pageUrl = absoluteUrl(input.path, base)
  const homeUrl = absoluteUrl(ROUTES.home, base)

  return {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collectionpage`,
    url: pageUrl,
    name: input.name,
    description: input.description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${homeUrl}#website` },
    mainEntity: { "@id": input.itemListId },
    ...(input.numberOfItems !== undefined ? { numberOfItems: input.numberOfItems } : {}),
  }
}

export function itemListId(path: string, siteUrl?: string): string {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  return `${absoluteUrl(path, base)}#itemlist`
}
