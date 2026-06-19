import { notFound } from "next/navigation"
import {
  buildUrlSetXml,
  getPuzzleSitemapBatchCount,
  getPuzzleSitemapEntries,
  sitemapResponse,
} from "@/lib/seo/sitemap"

export const revalidate = 3600

type RouteProps = {
  params: Promise<{ page: string }>
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { page: pageParam } = await params
  const page = Number(pageParam)

  if (!Number.isInteger(page) || page < 0) notFound()

  const batchCount = await getPuzzleSitemapBatchCount()
  if (page >= batchCount) notFound()

  const entries = await getPuzzleSitemapEntries(page)
  return sitemapResponse(buildUrlSetXml(entries))
}
