import type { Metadata } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import type { ContentPageData } from "@/lib/db/types/content-page-data"
import { ContentPageTemplate, buildContentPageMetadata } from "@/components/templates/content"

export const CONTENT_PAGE_REVALIDATE = 3600

export async function renderContentPage(page: ContentPageData | null, body?: ReactNode) {
  if (!page) notFound()
  return <ContentPageTemplate page={page}>{body}</ContentPageTemplate>
}

export async function contentGenerateMetadata(
  page: ContentPageData | null,
): Promise<Metadata> {
  if (!page) return {}
  return buildContentPageMetadata(page)
}
