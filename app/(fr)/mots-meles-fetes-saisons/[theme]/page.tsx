import type { Metadata } from "next"
import { resolveSeasonalCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { seasonalStaticParams } from "@/lib/app/category-route-params"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

export function generateStaticParams() {
  return seasonalStaticParams()
}

type PageProps = {
  params: Promise<{ theme: string }>
  searchParams?: CategorySearchParams
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { theme } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveSeasonalCategoryPageData(theme, page)
  return categoryGenerateMetadata(category, page)
}

export default async function SeasonalCategoryPage({ params, searchParams }: PageProps) {
  const { theme } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveSeasonalCategoryPageData(theme, page)
  return renderCategoryPage(category, page)
}
