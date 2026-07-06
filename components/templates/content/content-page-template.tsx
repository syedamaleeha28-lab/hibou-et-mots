import type { ReactNode } from "react"
import type { ContentPageData } from "@/lib/db/types/content-page-data"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SchemaJsonLd } from "@/components/seo"
import { AuthorAttribution } from "@/components/seo/author-attribution"
import { shouldShowAuthorAttribution } from "@/lib/content/author"
import { buildContentPageSchemaGraph } from "@/lib/seo/schema"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { ContentPageCtaSection } from "./content-page-cta"
import { ContentPageHero } from "./content-page-hero"
import { ContentRelatedLinks } from "./content-related-links"

export type ContentPageTemplateProps = {
  page: ContentPageData
  children?: ReactNode
}

export function ContentPageTemplate({ page, children }: ContentPageTemplateProps) {
  const schemaGraph = buildContentPageSchemaGraph(page)
  const showAuthor =
    page.showAuthorAttribution ?? shouldShowAuthorAttribution(page.slug)

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <SchemaJsonLd data={schemaGraph} />

        <BreadcrumbTrail items={page.breadcrumbs} className="mb-6" includeSchema={false} />

        <div className="flex flex-col gap-10 lg:gap-14">
          <ContentPageHero page={page} />

          {children ? <article className="flex flex-col gap-8">{children}</article> : null}

          <FaqAccordion items={page.faqJson} />

          {showAuthor ? <AuthorAttribution /> : null}

          <ContentRelatedLinks links={page.relatedLinks} />

          <ContentPageCtaSection cta={page.cta} />
        </div>
      </div>
    </div>
  )
}

export { buildContentPageMetadata } from "@/lib/seo/metadata"
