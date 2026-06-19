import {
  buildUrlSetXml,
  getCategorySitemapEntries,
  sitemapResponse,
} from "@/lib/seo/sitemap"

export const revalidate = 3600

export async function GET() {
  const entries = await getCategorySitemapEntries()
  return sitemapResponse(buildUrlSetXml(entries))
}
