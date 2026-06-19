import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { CategoryPageData } from "@/lib/db/types/page-data"
import { CategoryTemplate, buildCategoryMetadata } from "@/components/templates/category"

export const CATEGORY_REVALIDATE = 3600

export type CategorySearchParams = Promise<{ page?: string } | undefined>

export function parseCategoryPage(value?: string): number {
  const page = Number(value ?? 1)
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

export async function renderCategoryPage(
  category: CategoryPageData | null,
  page: number,
) {
  if (!category) notFound()
  return <CategoryTemplate category={category} searchParams={{ page: String(page) }} />
}

export async function categoryGenerateMetadata(
  category: CategoryPageData | null,
  page: number,
): Promise<Metadata> {
  if (!category) return {}
  return buildCategoryMetadata(category, page)
}
