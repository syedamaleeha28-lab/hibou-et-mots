import type { Metadata } from "next"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import { resolveHubCategoryPageData } from "@/lib/db/queries/category-resolvers"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  renderCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"

// Fixes a sitemap 404: /caca-palavras-tematicos/ was listed (via the
// mots-meles-coverage.ts safety net) but had no page — only its
// [theme]/ children existed. Mirrors app/caca-palavras-para-imprimir/page.tsx.
export const revalidate = 3600

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}): Promise<Metadata> {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const category = await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.thematiques, page, "pt-BR")
  return categoryGenerateMetadata(category, page)
}

export default async function CacaPalavrasTematicosHubPage({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}) {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const category = await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.thematiques, page, "pt-BR")
  return renderCategoryPage(category, page)
}
