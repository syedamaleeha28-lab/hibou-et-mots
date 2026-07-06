import type { ContentPageData } from "@/lib/db/types/content-page-data"
import { mapCategoryToContentPageData } from "@/lib/db/adapters/content-page-mappers"
import { resolveStaticSupportCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { ROUTES } from "@/lib/seo/routes"

export async function resolveSolutionsContentPageData(
  page = 1,
): Promise<ContentPageData | null> {
  const category = await resolveStaticSupportCategoryPageData(ROUTES.solutions, page)
  if (!category) return null
  return mapCategoryToContentPageData(category, "editorial")
}

export async function resolveApplicationContentPageData(
  page = 1,
): Promise<ContentPageData | null> {
  const category = await resolveStaticSupportCategoryPageData(ROUTES.application, page)
  if (!category) return null
  return mapCategoryToContentPageData(category, "editorial")
}

export async function resolvePersonnagesContentPageData(
  page = 1,
): Promise<ContentPageData | null> {
  const category = await resolveStaticSupportCategoryPageData(ROUTES.personnages, page)
  if (!category) return null
  return mapCategoryToContentPageData(category, "editorial")
}
