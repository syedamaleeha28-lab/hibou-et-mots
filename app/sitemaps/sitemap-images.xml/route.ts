import { buildImageUrlSetXml, getImageSitemapEntries, sitemapResponse } from "@/lib/seo/sitemap"

export const revalidate = 3600

export async function GET() {
  const entries = await getImageSitemapEntries()
  return sitemapResponse(buildImageUrlSetXml(entries))
}
