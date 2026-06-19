export type SitemapUrlEntry = {
  loc: string
  lastModified?: Date | string
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

export type SitemapImageEntry = {
  loc: string
  imageLoc: string
  title?: string
  caption?: string
}

export const SITEMAP_PUZZLE_BATCH_SIZE = 5000
export const SITEMAP_CACHE_SECONDS = 3600
