import { SITE_AUTHOR, SITE_CONTENT_UPDATED_DATE, SITE_PUBLISHED_DATE } from "@/lib/content/author"
import {
  CONTACT_EMAIL,
  ROUTES,
  absoluteUrl,
  DEFAULT_SITE_URL,
} from "@/lib/seo/routes"

const SITE_NAME = "Hibou&Mots"

export function personSchemaId(siteUrl?: string): string {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  return `${absoluteUrl(ROUTES.auteur, base)}#person`
}

export function organizationSchemaId(siteUrl?: string): string {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  return `${absoluteUrl(ROUTES.home, base)}#organization`
}

export function buildPersonSchema(siteUrl?: string): Record<string, unknown> {
  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "")
  const authorUrl = absoluteUrl(ROUTES.auteur, base)

  return {
    "@type": "Person",
    "@id": personSchemaId(siteUrl),
    name: SITE_AUTHOR.name,
    url: authorUrl,
    email: CONTACT_EMAIL,
    jobTitle: SITE_AUTHOR.jobTitle,
    description: `${SITE_AUTHOR.experience} ${SITE_AUTHOR.mission}`,
    worksFor: { "@id": organizationSchemaId(siteUrl) },
    knowsAbout: [...SITE_AUTHOR.knowsAbout],
  }
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
    author: { "@id": personSchemaId(input.siteUrl) },
    datePublished: input.datePublished ?? SITE_PUBLISHED_DATE,
    dateModified: input.dateModified ?? SITE_CONTENT_UPDATED_DATE,
  }
}

export { SITE_NAME, SITE_PUBLISHED_DATE, SITE_CONTENT_UPDATED_DATE }
