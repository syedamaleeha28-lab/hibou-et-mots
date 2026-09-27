import type { Metadata } from "next"
import { ROUTES } from "@/lib/seo/routes"
import { PedagogieEditorial } from "@/components/templates/pedagogie/pedagogie-editorial"
import { resolveStaticSupportCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { resolvePedagogieContentPageData } from "@/lib/db/queries/content-resolvers"
import {
  categoryGenerateMetadata,
  parseCategoryPage,
  type CategorySearchParams,
} from "@/lib/app/category-page"
import { renderContentPage } from "@/lib/app/content-page"

export const revalidate = 3600

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}): Promise<Metadata> {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const category = await resolveStaticSupportCategoryPageData(ROUTES.pedagogie, page)
  return categoryGenerateMetadata(category, page)
}

export default async function PedagogiePage({
  searchParams,
}: {
  searchParams?: CategorySearchParams
}) {
  const params = await searchParams
  const page = parseCategoryPage(params?.page)
  const contentPage = await resolvePedagogieContentPageData(page)
  return renderContentPage(contentPage, <PedagogieEditorial />)
}
