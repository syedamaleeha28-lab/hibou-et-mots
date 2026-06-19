import {
  buildSitemapIndexXml,
  getSitemapIndexLocations,
  sitemapResponse,
} from "@/lib/seo/sitemap"

export const revalidate = 3600

export async function GET() {
  const locations = await getSitemapIndexLocations()
  return sitemapResponse(buildSitemapIndexXml(locations))
}
