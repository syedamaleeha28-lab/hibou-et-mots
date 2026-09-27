import { cache } from "react"
import type { ContentPageData } from "@/lib/db/types/content-page-data"
import { mapCategoryToContentPageData } from "@/lib/db/adapters/content-page-mappers"
import { resolveStaticSupportCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { ROUTES } from "@/lib/seo/routes"

// Same fix as category-resolvers.ts — wrapping in cache() for
// consistency and defense-in-depth. The underlying race for these 6
// pages is actually already fixed by resolveStaticSupportCategoryPageData
// itself being cached (each of these 6 pages' generateMetadata calls
// that function directly, and its page component calls it indirectly
// through one of these wrappers — both paths now hit the same cached
// call). Wrapping these too means any future caller gets the same
// protection without needing to know that detail.

async function resolveSolutionsContentPageDataImpl(
  page = 1,
): Promise<ContentPageData | null> {
  const category = await resolveStaticSupportCategoryPageData(ROUTES.solutions, page)
  if (!category) return null
  return mapCategoryToContentPageData(category, "editorial")
}
export const resolveSolutionsContentPageData = cache(resolveSolutionsContentPageDataImpl)

async function resolveApplicationContentPageDataImpl(
  page = 1,
): Promise<ContentPageData | null> {
  const category = await resolveStaticSupportCategoryPageData(ROUTES.application, page)
  if (!category) return null
  return mapCategoryToContentPageData(category, "editorial")
}
export const resolveApplicationContentPageData = cache(resolveApplicationContentPageDataImpl)

async function resolvePersonnagesContentPageDataImpl(
  page = 1,
): Promise<ContentPageData | null> {
  const category = await resolveStaticSupportCategoryPageData(ROUTES.personnages, page)
  if (!category) return null
  return mapCategoryToContentPageData(category, "editorial")
}
export const resolvePersonnagesContentPageData = cache(resolvePersonnagesContentPageDataImpl)

async function resolveJeuxMagazinesContentPageDataImpl(
  page = 1,
): Promise<ContentPageData | null> {
  const category = await resolveStaticSupportCategoryPageData(ROUTES.jeuxMagazines, page)
  if (!category) return null
  return mapCategoryToContentPageData(category, "editorial")
}
export const resolveJeuxMagazinesContentPageData = cache(resolveJeuxMagazinesContentPageDataImpl)

async function resolvePedagogieContentPageDataImpl(
  page = 1,
): Promise<ContentPageData | null> {
  const category = await resolveStaticSupportCategoryPageData(ROUTES.pedagogie, page)
  if (!category) return null
  return mapCategoryToContentPageData(category, "educational")
}
export const resolvePedagogieContentPageData = cache(resolvePedagogieContentPageDataImpl)

async function resolveRessourcesContentPageDataImpl(
  page = 1,
): Promise<ContentPageData | null> {
  const category = await resolveStaticSupportCategoryPageData(ROUTES.ressources, page)
  if (!category) return null
  return mapCategoryToContentPageData(category, "educational")
}
export const resolveRessourcesContentPageData = cache(resolveRessourcesContentPageDataImpl)
