import type { CategoryPageData, PuzzlePageData } from "@/lib/db/types/page-data"
import { buildBreadcrumbListSchema, type BreadcrumbItem } from "@/lib/seo/breadcrumbs"
import { buildCreativeWorkSchema } from "./creative-work"
import { buildFaqPageSchema } from "./faq-page"
import { buildItemListSchema } from "./item-list"
import { buildSchemaGraph } from "./graph"

export function buildCategoryPageSchemaGraph(
  category: Pick<
    CategoryPageData,
    "h1" | "breadcrumbs" | "schema" | "puzzles"
  >,
  siteUrl?: string,
): Record<string, unknown> {
  const breadcrumb = buildBreadcrumbListSchema(category.breadcrumbs, siteUrl)
  const itemList =
    category.schema.itemList ??
    buildItemListSchema(category.h1, category.puzzles.items, siteUrl)
  const faqPage = category.schema.faqPage

  return buildSchemaGraph([breadcrumb, itemList, faqPage])
}

export function buildPuzzlePageSchemaGraph(
  puzzle: Pick<
    PuzzlePageData,
    | "title"
    | "canonicalPath"
    | "metaDescription"
    | "theme"
    | "grade"
    | "difficulty"
    | "breadcrumbs"
    | "schema"
    | "thumbnailUrl"
  >,
  siteUrl?: string,
): Record<string, unknown> {
  const breadcrumb = buildBreadcrumbListSchema(puzzle.breadcrumbs, siteUrl)
  const creativeWork =
    puzzle.schema.creativeWork ??
    buildCreativeWorkSchema(puzzle, siteUrl, puzzle.thumbnailUrl)
  const faqPage = puzzle.schema.faqPage

  return buildSchemaGraph([breadcrumb, creativeWork, faqPage])
}

export function buildBreadcrumbSchemaGraph(
  breadcrumbs: BreadcrumbItem[],
  siteUrl?: string,
): Record<string, unknown> {
  return buildSchemaGraph([buildBreadcrumbListSchema(breadcrumbs, siteUrl)])
}
