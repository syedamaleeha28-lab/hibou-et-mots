import type { Metadata } from "next"
import { resolveComboCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { comboStaticParams } from "@/lib/app/category-route-params"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

export function generateStaticParams() {
  return comboStaticParams()
}

type PageProps = {
  params: Promise<{ grade: string; theme: string }>
  searchParams?: CategorySearchParams
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { grade, theme } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveComboCategoryPageData(grade, theme, page)
  return categoryGenerateMetadata(category, page)
}

export default async function ComboCategoryPage({ params, searchParams }: PageProps) {
  const { grade, theme } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveComboCategoryPageData(grade, theme, page)
  return renderCategoryPage(category, page)
}
