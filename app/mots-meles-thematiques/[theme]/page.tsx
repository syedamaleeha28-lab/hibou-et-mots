import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryTemplate, buildCategoryMetadata } from "@/components/templates/category"
import { resolveThemeCategoryPageData } from "@/lib/db/queries/pilot"

export const revalidate = 3600

type PageProps = {
  params: Promise<{ theme: string }>
  searchParams?: Promise<{ page?: string }>
}

function parsePage(value?: string): number {
  const page = Number(value ?? 1)
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { theme } = await params
  const query = await searchParams
  const page = parsePage(query?.page)
  const category = await resolveThemeCategoryPageData(theme, page)
  if (!category) return {}
  return buildCategoryMetadata(category, page)
}

export default async function ThemeCategoryPage({ params, searchParams }: PageProps) {
  const { theme } = await params
  const query = await searchParams
  const page = parsePage(query?.page)
  const category = await resolveThemeCategoryPageData(theme, page)

  if (!category) notFound()

  return <CategoryTemplate category={category} searchParams={{ page: String(page) }} />
}
