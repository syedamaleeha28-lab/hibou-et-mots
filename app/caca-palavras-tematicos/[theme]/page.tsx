import type { Metadata } from "next"
import { resolveThemeCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { ptThemeStaticParams } from "@/lib/app/category-route-params"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

export function generateStaticParams() {
  return ptThemeStaticParams()
}

type PageProps = {
  params: Promise<{ theme: string }>
  searchParams?: CategorySearchParams
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { theme } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveThemeCategoryPageData(theme, page, "pt-BR")
  return categoryGenerateMetadata(category, page)
}

export default async function CacaPalavrasTematicoPage({ params, searchParams }: PageProps) {
  const { theme } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveThemeCategoryPageData(theme, page, "pt-BR")
  return renderCategoryPage(category, page)
}
