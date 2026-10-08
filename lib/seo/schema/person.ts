import { SITE_CONTENT_UPDATED_DATE, SITE_PUBLISHED_DATE } from "@/lib/content/author"
import { isReviewedPage, SITE_REVIEWER } from "@/lib/content/reviewer"
import { ROUTES, absoluteUrl, DEFAULT_SITE_URL } from "@/lib/seo/routes"

const SITE_NAME = "Hibou&Mots"

export function personSchemaId(siteUrl?: string): string {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  return `${absoluteUrl(ROUTES.auteur, base)}#person`
}

export function organizationSchemaId(siteUrl?: string): string {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  return `${absoluteUrl(ROUTES.home, base)}#organization`
}

/** Stable graph id only. The reviewer Person has no url property. */
export function reviewerSchemaId(siteUrl?: string): string {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  return `${absoluteUrl(ROUTES.home, base)}#person-faqir-syed-iftikhar`
}

export function buildReviewerPersonSchema(siteUrl?: string): Record<string, unknown> {
  return {
    "@type": "Person",
    "@id": reviewerSchemaId(siteUrl),
    name: SITE_REVIEWER.name,
    jobTitle: SITE_REVIEWER.jobTitle,
    description: SITE_REVIEWER.description,
    worksFor: { ...SITE_REVIEWER.worksFor },
  }
}

/** The only Person node. A reviewer, not the writer or founder of the site. */
export function buildPersonSchema(siteUrl?: string): Record<string, unknown> {
  return buildReviewerPersonSchema(siteUrl)
}

export type ContentWebPageSchemaInput = {
  path: string
  name: string
  description: string
  siteUrl?: string
  datePublished?: string
  dateModified?: string
}

/** WebPage node with author and publication dates for editorial / educational content. */
export function buildContentWebPageSchema(
  input: ContentWebPageSchemaInput,
): Record<string, unknown> {
  const base = (input.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(
    /\/$/,
    "",
  )
  const pageUrl = absoluteUrl(input.path, base)
  const homeUrl = absoluteUrl(ROUTES.home, base)

  return {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: input.name,
    description: input.description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": `${homeUrl}#website` },
    publisher: { "@id": organizationSchemaId(input.siteUrl) },
    author: { "@id": organizationSchemaId(input.siteUrl) },
    ...(isReviewedPage(input.path)
      ? { reviewedBy: { "@id": reviewerSchemaId(input.siteUrl) } }
      : {}),
    datePublished: input.datePublished ?? SITE_PUBLISHED_DATE,
    dateModified: input.dateModified ?? SITE_CONTENT_UPDATED_DATE,
  }
}

export { SITE_NAME, SITE_PUBLISHED_DATE, SITE_CONTENT_UPDATED_DATE }
