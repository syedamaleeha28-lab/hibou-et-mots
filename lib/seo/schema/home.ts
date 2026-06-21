import { ROUTES, absoluteUrl, DEFAULT_SITE_URL } from "@/lib/seo/routes"
import { HOME_FAQ } from "@/lib/content/phase1"
import { getPopularPuzzleListItems } from "@/lib/home/popular-puzzle-links"
import { buildFaqPageSchema } from "./faq-page"
import { buildLinksItemListSchema } from "./item-list"
import { buildSchemaGraph } from "./graph"

const SITE_NAME = "Hibou&Mots"

export function buildWebSiteSchema(siteUrl?: string) {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(
    /\/$/,
    "",
  )
  const homeUrl = absoluteUrl(ROUTES.home, base)
  const searchUrl = absoluteUrl(ROUTES.recherche, base)

  return {
    "@type": "WebSite",
    "@id": `${homeUrl}#website`,
    name: SITE_NAME,
    url: homeUrl,
    inLanguage: "fr-FR",
    publisher: { "@id": `${homeUrl}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${searchUrl}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function buildOrganizationSchema(siteUrl?: string) {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(
    /\/$/,
    "",
  )
  const homeUrl = absoluteUrl(ROUTES.home, base)

  return {
    "@type": "Organization",
    "@id": `${homeUrl}#organization`,
    name: SITE_NAME,
    url: homeUrl,
    logo: absoluteUrl("/icon.svg", base),
  }
}

export function buildHomePageSchemaGraph(siteUrl?: string): Record<string, unknown> {
  const faqPage = buildFaqPageSchema(HOME_FAQ)
  const popularPuzzlesList = buildLinksItemListSchema(
    "Puzzles populaires Hibou&Mots",
    getPopularPuzzleListItems(),
    siteUrl,
  )
  return buildSchemaGraph([
    buildWebSiteSchema(siteUrl),
    buildOrganizationSchema(siteUrl),
    popularPuzzlesList,
    ...(faqPage ? [faqPage] : []),
  ])
}
