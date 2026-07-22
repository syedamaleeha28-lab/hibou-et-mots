import type { CategoryPageData, PuzzlePageData } from "@/lib/db/types/page-data"
import type { ContentPageData } from "@/lib/db/types/content-page-data"
import { shouldShowAuthorAttribution } from "@/lib/content/author"
import { buildBreadcrumbListSchema, type BreadcrumbItem } from "@/lib/seo/breadcrumbs"
import { buildContentWebPageSchema, buildPersonSchema, personSchemaId } from "./person"
import { buildCollectionPageSchema, itemListId } from "./collection-page"
import { buildCreativeWorkSchema } from "./creative-work"
import { buildFaqPageSchema } from "./faq-page"
import { buildItemListSchema } from "./item-list"
import { buildSchemaGraph } from "./graph"

export function buildCategoryPageSchemaGraph(
  category: Pick<
    CategoryPageData,
    "slug" | "type" | "h1" | "metaDescription" | "canonicalPath" | "breadcrumbs" | "schema" | "puzzles"
  >,
  siteUrl?: string,
): Record<string, unknown> {
  const breadcrumb = buildBreadcrumbListSchema(category.breadcrumbs, siteUrl)
  const itemList = {
    "@id": itemListId(category.canonicalPath, siteUrl),
    ...(category.schema.itemList ?? buildItemListSchema(category.h1, category.puzzles.items, siteUrl)),
  }
  const collectionPage = buildCollectionPageSchema({
    path: category.canonicalPath,
    name: category.h1,
    description: category.metaDescription,
    siteUrl,
    itemListId: itemList["@id"],
    numberOfItems: category.puzzles.items.length,
  })
  const faqPage = category.schema.faqPage

  const nodes: Array<Record<string, unknown>> = [breadcrumb, collectionPage, itemList]
  if (faqPage) nodes.push(faqPage)

  if (shouldShowAuthorAttribution(category.slug, category.type)) {
    nodes.push(
      buildContentWebPageSchema({
        path: category.canonicalPath,
        name: category.h1,
        description: category.metaDescription,
        siteUrl,
      }),
    )
  }

  return buildSchemaGraph(nodes)
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
  const baseCreativeWork =
    puzzle.schema.creativeWork ??
    buildCreativeWorkSchema(puzzle, siteUrl, puzzle.thumbnailUrl)
  const authorRef = { "@id": personSchemaId(siteUrl) }
  const creativeWork = {
    ...baseCreativeWork,
    author: baseCreativeWork.author ?? authorRef,
    creator: baseCreativeWork.creator ?? authorRef,
  }
  const faqPage = puzzle.schema.faqPage

  return buildSchemaGraph([breadcrumb, creativeWork, buildPersonSchema(siteUrl), faqPage])
}

export function buildBreadcrumbSchemaGraph(
  breadcrumbs: BreadcrumbItem[],
  siteUrl?: string,
): Record<string, unknown> {
  return buildSchemaGraph([buildBreadcrumbListSchema(breadcrumbs, siteUrl)])
}

export function buildContentPageSchemaGraph(
  page: Pick<
    ContentPageData,
    "slug" | "h1" | "metaDescription" | "canonicalPath" | "breadcrumbs" | "faqJson" | "schema" | "showAuthorAttribution"
  >,
  siteUrl?: string,
): Record<string, unknown> {
  const breadcrumb = buildBreadcrumbListSchema(page.breadcrumbs, siteUrl)
  const faqPage =
    page.schema.faqPage ?? buildFaqPageSchema(page.faqJson)

  const nodes: Array<Record<string, unknown>> = [
    breadcrumb,
    buildContentWebPageSchema({
      path: page.canonicalPath,
      name: page.h1,
      description: page.metaDescription,
      siteUrl,
    }),
  ]
  if (faqPage) nodes.push(faqPage)

  return buildSchemaGraph(nodes)
}
