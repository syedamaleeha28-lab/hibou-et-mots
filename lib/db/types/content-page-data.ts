import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs"
import type { ContentSchemaPayload } from "@/lib/seo/schema/types"
import type { FaqItem } from "./page-data"

export type ContentPageVariant = "editorial" | "educational"

export type ContentRelatedLink = {
  id: string
  label: string
  href: string
  description?: string
}

export type ContentPageCta = {
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  tertiaryLabel?: string
  tertiaryHref?: string
}

export type ContentPageIllustration = {
  src: string
  alt: string
  width?: number
  height?: number
}

export type ContentPageData = {
  slug: string
  variant: ContentPageVariant
  h1: string
  introText: string
  seoTitle: string
  metaDescription: string
  canonicalPath: string
  isIndexable: boolean
  breadcrumbs: BreadcrumbItem[]
  faqJson: FaqItem[]
  relatedLinks: ContentRelatedLink[]
  showAuthorAttribution?: boolean
  illustration?: ContentPageIllustration
  cta?: ContentPageCta
  schema: ContentSchemaPayload
}
