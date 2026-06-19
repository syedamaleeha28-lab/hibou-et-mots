import type { Metadata } from "next"
import { ROUTES } from "@/lib/seo/routes"
import { resolveStaticSupportCategoryPageData } from "@/lib/db/queries/category-resolvers"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}): Promise<Metadata> {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const category = await resolveStaticSupportCategoryPageData(ROUTES.jeuxMagazines, page)
  return categoryGenerateMetadata(category, page)
}

export default async function JeuxMagazinesPage({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}) {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const category = await resolveStaticSupportCategoryPageData(ROUTES.jeuxMagazines, page)
  return renderCategoryPage(category, page)
}
