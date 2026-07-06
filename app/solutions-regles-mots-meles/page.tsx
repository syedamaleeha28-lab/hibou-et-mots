import type { Metadata } from "next"
import { ROUTES } from "@/lib/seo/routes"
import { resolveStaticSupportCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { resolveSolutionsContentPageData } from "@/lib/db/queries/content-resolvers"
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
  const category = await resolveStaticSupportCategoryPageData(ROUTES.solutions, page)
  return categoryGenerateMetadata(category, page)
}

export default async function SolutionsPage({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}) {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const contentPage = await resolveSolutionsContentPageData(page)
  return renderContentPage(contentPage)
}
