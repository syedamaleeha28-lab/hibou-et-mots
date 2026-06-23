import { SITE_AUTHOR, SITE_CONTENT_UPDATED_DATE, SITE_PUBLISHED_DATE } from "@/lib/content/author"
import { ROUTES, absoluteUrl, DEFAULT_SITE_URL } from "@/lib/seo/routes"
import { buildBreadcrumbListSchema } from "@/lib/seo/breadcrumbs"
import { buildOrganizationSchema } from "./home"
import { buildPersonSchema } from "./person"
import { buildSchemaGraph } from "./graph"

const AUTHOR_PAGE_TITLE = `Auteur — ${SITE_AUTHOR.name}`

export function buildAuthorPageSchemaGraph(siteUrl?: string): Record<string, unknown> {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  const authorUrl = absoluteUrl(ROUTES.auteur, base)
  const homeUrl = absoluteUrl(ROUTES.home, base)

  const breadcrumb = buildBreadcrumbListSchema(
    [
      { label: "Accueil", href: ROUTES.home },
      { label: "Auteur", href: ROUTES.auteur },
    ],
    siteUrl,
  )

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${authorUrl}#webpage`,
    url: authorUrl,
    name: AUTHOR_PAGE_TITLE,
    description: SITE_AUTHOR.purpose,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${homeUrl}#website` },
    publisher: { "@id": `${homeUrl}#organization` },
    mainEntity: { "@id": `${authorUrl}#person` },
    datePublished: SITE_PUBLISHED_DATE,
    dateModified: SITE_CONTENT_UPDATED_DATE,
  }

  return buildSchemaGraph([
    breadcrumb,
    profilePage,
    buildPersonSchema(siteUrl),
    buildOrganizationSchema(siteUrl),
  ])
}
