import type { Metadata } from "next"
import { ROUTES } from "@/lib/seo/routes"
import { RessourcesEnseignantsEditorial } from "@/components/templates/ressources/ressources-enseignants-editorial"
import { resolveStaticSupportCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { resolveRessourcesContentPageData } from "@/lib/db/queries/content-resolvers"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"
import { renderContentPage } from "@/lib/app/content-page"

export const revalidate = 3600

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}): Promise<Metadata> {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const category = await resolveStaticSupportCategoryPageData(ROUTES.ressources, page)
  return categoryGenerateMetadata(category, page)
}

export default async function RessourcesEnseignantsPage({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}) {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const contentPage = await resolveRessourcesContentPageData(page)
  return renderContentPage(contentPage, <RessourcesEnseignantsEditorial />)
}
