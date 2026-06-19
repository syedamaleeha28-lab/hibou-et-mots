import type { Metadata } from "next"
import { resolveGradeCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { gradeStaticParams } from "@/lib/app/category-route-params"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

export function generateStaticParams() {
  return gradeStaticParams()
}

type PageProps = {
  params: Promise<{ grade: string }>
  searchParams?: CategorySearchParams
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { grade } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveGradeCategoryPageData(grade, page)
  return categoryGenerateMetadata(category, page)
}

export default async function GradeCategoryPage({ params, searchParams }: PageProps) {
  const { grade } = await params
  const query = await searchParams
  const page = parseCategoryPage(query?.page)
  const category = await resolveGradeCategoryPageData(grade, page)
  return renderCategoryPage(category, page)
}
