import type { Metadata } from "next"
import { resolveDifficultyCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { difficultyStaticParams } from "@/lib/app/category-route-params"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

export function generateStaticParams() {
  return difficultyStaticParams()
}

type PageProps = {
  params: Promise<{ level: string }>
  searchParams?: CategorySearchParams
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { level } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveDifficultyCategoryPageData(level, page)
  return categoryGenerateMetadata(category, page)
}

export default async function DifficultyCategoryPage({ params, searchParams }: PageProps) {
  const { level } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveDifficultyCategoryPageData(level, page)
  return renderCategoryPage(category, page)
}
