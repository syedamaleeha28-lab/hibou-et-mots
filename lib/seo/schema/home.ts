import { ROUTES, absoluteUrl } from "@/lib/seo/routes"
import { buildSchemaGraph } from "./graph"

const SITE_NAME = "Hibou&Mots"

export function buildWebSiteSchema(siteUrl?: string) {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://hibou-et-mots.fr").replace(
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
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://hibou-et-mots.fr").replace(
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
  return buildSchemaGraph([buildWebSiteSchema(siteUrl), buildOrganizationSchema(siteUrl)])
}
