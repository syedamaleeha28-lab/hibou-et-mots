import type { Metadata } from "next"
import { resolveThemeCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { themeStaticParams } from "@/lib/app/category-route-params"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

export function generateStaticParams() {
  return themeStaticParams()
}

type PageProps = {
  params: Promise<{ theme: string }>
  searchParams?: CategorySearchParams
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { theme } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveThemeCategoryPageData(theme, page)
  return categoryGenerateMetadata(category, page)
}

export default async function ThemeCategoryPage({ params, searchParams }: PageProps) {
  const { theme } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveThemeCategoryPageData(theme, page)
  return renderCategoryPage(category, page)
}
