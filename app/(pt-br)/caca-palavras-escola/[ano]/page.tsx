import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { resolveGradeCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { ptGradeStaticParams } from "@/lib/app/category-route-params"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

export const revalidate = 3600

type RouteParams = { ano: string }

export function generateStaticParams() {
  return ptGradeStaticParams()
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>
  searchParams?: CategorySearchParams
}): Promise<Metadata> {
  const { ano } = await params
  const search = await searchParams
  const page = parseCategoryPage(search?.page)
  const category = await resolveGradeCategoryPageData(ano, page, "pt-BR")
  if (!category) return {}
  return categoryGenerateMetadata(category, page)
}

export default async function CacaPalavrasEscolaGradePage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>
  searchParams?: CategorySearchParams
}) {
  const { ano } = await params
  const search = await searchParams
  const page = parseCategoryPage(search?.page)
  const category = await resolveGradeCategoryPageData(ano, page, "pt-BR")
  if (!category) notFound()
  return renderCategoryPage(category, page)
}
