import { SITE_CONTENT_UPDATED_DATE, SITE_PUBLISHED_DATE } from "@/lib/content/author"
import { REVIEWER_PAGE_DESCRIPTION, REVIEWER_PAGE_TITLE } from "@/lib/content/reviewer"
import { ROUTES, absoluteUrl, DEFAULT_SITE_URL } from "@/lib/seo/routes"
import { buildBreadcrumbListSchema } from "@/lib/seo/breadcrumbs"
import { buildOrganizationSchema } from "./home"
import { buildReviewerPersonSchema, organizationSchemaId, reviewerSchemaId } from "./person"
import { buildSchemaGraph } from "./graph"

export function buildAuthorPageSchemaGraph(siteUrl?: string): Record<string, unknown> {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  const authorUrl = absoluteUrl(ROUTES.auteur, base)
  const homeUrl = absoluteUrl(ROUTES.home, base)
  const publisherId = organizationSchemaId(siteUrl)

  const breadcrumb = buildBreadcrumbListSchema(
    [
      { label: "Accueil", href: ROUTES.home },
      { label: "Enseignant", href: ROUTES.auteur },
    ],
    siteUrl,
  )

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${authorUrl}#webpage`,
    url: authorUrl,
    name: REVIEWER_PAGE_TITLE,
    description: REVIEWER_PAGE_DESCRIPTION,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${homeUrl}#website` },
    publisher: { "@id": publisherId },
    author: { "@id": publisherId },
    mainEntity: { "@id": reviewerSchemaId(siteUrl) },
    datePublished: SITE_PUBLISHED_DATE,
    dateModified: SITE_CONTENT_UPDATED_DATE,
  }

  return buildSchemaGraph([
    breadcrumb,
    profilePage,
    buildReviewerPersonSchema(siteUrl),
    buildOrganizationSchema(siteUrl),
  ])
}
