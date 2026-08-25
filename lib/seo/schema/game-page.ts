import type { FaqItem } from "@/lib/db/types/page-data"
import { buildBreadcrumbListSchema, type BreadcrumbItem } from "@/lib/seo/breadcrumbs"
import { buildContentWebPageSchema } from "./person"
import { buildFaqPageSchema } from "./faq-page"
import { buildSchemaGraph } from "./graph"

export type GamePageSchemaInput = {
  path: string
  name: string
  description: string
  breadcrumbs: BreadcrumbItem[]
  faqItems: FaqItem[]
  siteUrl?: string
}

/**
 * Schema graph for standalone game/tool pages (mots coupés, sudoku,
 * coloriage magique) — these aren't DB-backed Category or Puzzle
 * records, so they don't have a `.schema` object to pull prebuilt nodes
 * from the way buildCategoryPageSchemaGraph/buildPuzzlePageSchemaGraph
 * do. This is the same BreadcrumbList + WebPage + FAQPage @graph shape
 * as buildContentPageSchemaGraph, just built directly from plain
 * inputs instead of a ContentPageData record — same primitives
 * (buildBreadcrumbListSchema, buildContentWebPageSchema,
 * buildFaqPageSchema, buildSchemaGraph), no new schema conventions.
 */
export function buildGamePageSchemaGraph(input: GamePageSchemaInput): Record<string, unknown> {
  const breadcrumb = buildBreadcrumbListSchema(input.breadcrumbs, input.siteUrl)
  const webPage = buildContentWebPageSchema({
    path: input.path,
    name: input.name,
    description: input.description,
    siteUrl: input.siteUrl,
  })
  const faqPage = buildFaqPageSchema(input.faqItems)

  const nodes: Array<Record<string, unknown>> = [breadcrumb, webPage]
  if (faqPage) nodes.push(faqPage)

  return buildSchemaGraph(nodes)
}
