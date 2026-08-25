import type { Metadata } from "next"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import { resolveHubCategoryPageData } from "@/lib/db/queries/category-resolvers"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

// School-grade hub — mirrors app/caca-palavras-nivel/page.tsx exactly,
// same pattern proven for the difficulty and theme hubs.
export const revalidate = 3600

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}): Promise<Metadata> {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const category = await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.ecole, page, "pt-BR")
  return categoryGenerateMetadata(category, page)
}

export default async function CacaPalavrasEscolaHubPage({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}) {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const category = await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.ecole, page, "pt-BR")
  return renderCategoryPage(category, page)
}
