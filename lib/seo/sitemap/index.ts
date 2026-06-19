import { absoluteUrl } from "@/lib/seo/routes"
import { getPuzzleSitemapBatchCount, puzzleSitemapSegmentPath } from "./puzzles"

export const SITEMAP_SEGMENT_PATHS = {
  static: "/sitemaps/sitemap-static.xml/",
  categories: "/sitemaps/sitemap-categories.xml/",
  images: "/sitemaps/sitemap-images.xml/",
} as const

export async function getSitemapIndexLocations(siteUrl?: string): Promise<string[]> {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://hibou-et-mots.fr"
  const batchCount = await getPuzzleSitemapBatchCount()

  return [
    absoluteUrl(SITEMAP_SEGMENT_PATHS.static, base),
    absoluteUrl(SITEMAP_SEGMENT_PATHS.categories, base),
    ...Array.from({ length: batchCount }, (_, page) =>
      absoluteUrl(puzzleSitemapSegmentPath(page), base),
    ),
    absoluteUrl(SITEMAP_SEGMENT_PATHS.images, base),
  ]
}

export { getStaticSitemapEntries } from "./static"
export { getCategorySitemapEntries } from "./categories"
export {
  getPuzzleSitemapBatchCount,
  getPuzzleSitemapEntries,
  getPublishedPuzzleCount,
  puzzleSitemapSegmentPath,
} from "./puzzles"
export { getImageSitemapEntries } from "./images"
export { buildImageUrlSetXml, buildSitemapIndexXml, buildUrlSetXml, sitemapResponse } from "./xml"
export type { SitemapImageEntry, SitemapUrlEntry } from "./types"
