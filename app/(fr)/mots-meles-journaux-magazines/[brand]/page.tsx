import type { Metadata } from "next"
import { resolvePressBrandCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { pressBrandStaticParams } from "@/lib/app/category-route-params"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

export function generateStaticParams() {
  return pressBrandStaticParams()
}

type PageProps = {
  params: Promise<{ brand: string }>
  searchParams?: CategorySearchParams
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { brand } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolvePressBrandCategoryPageData(brand, page)
  return categoryGenerateMetadata(category, page)
}

export default async function PressBrandCategoryPage({ params, searchParams }: PageProps) {
  const { brand } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolvePressBrandCategoryPageData(brand, page)
  return renderCategoryPage(category, page)
}
