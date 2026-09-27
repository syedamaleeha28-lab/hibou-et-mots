import type { Metadata } from "next"
import { resolveDifficultyCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { ptDifficultyStaticParams } from "@/lib/app/category-route-params"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

export function generateStaticParams() {
  return ptDifficultyStaticParams()
}

type PageProps = {
  params: Promise<{ level: string }>
  searchParams?: CategorySearchParams
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { level } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveDifficultyCategoryPageData(level, page, "pt-BR")
  return categoryGenerateMetadata(category, page)
}

export default async function CacaPalavrasNivelPage({ params, searchParams }: PageProps) {
  const { level } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveDifficultyCategoryPageData(level, page, "pt-BR")
  return renderCategoryPage(category, page)
}
