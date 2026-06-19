import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryTemplate, buildCategoryMetadata } from "@/components/templates/category"
import { resolveEcoleHubPageData } from "@/lib/db/queries/pilot"

export const revalidate = 3600

type PageProps = {
  searchParams?: Promise<{ page?: string }>
}

function parsePage(value?: string): number {
  const page = Number(value ?? 1)
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const page = parsePage(params?.page)
  const category = await resolveEcoleHubPageData(page)
  return await buildCategoryMetadata(category, page)
}

export default async function EcoleHubPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parsePage(params?.page)
  const category = await resolveEcoleHubPageData(page)

  if (!category) notFound()

  return <CategoryTemplate category={category} searchParams={{ page: String(page) }} />
}
