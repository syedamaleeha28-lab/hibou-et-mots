import { buildUrlSetXml, getStaticSitemapEntries, sitemapResponse } from "@/lib/seo/sitemap"

export const revalidate = 3600

export async function GET() {
  const entries = getStaticSitemapEntries()
  return sitemapResponse(buildUrlSetXml(entries))
}
