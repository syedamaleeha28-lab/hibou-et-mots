import { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/mock-pilot"
import { ROUTES, puzzlePath, themePath } from "@/lib/seo/routes"
import type { SitemapUrlEntry } from "./types"
import { PUZZLE_SITEMAP_PRIORITY, priorityForCategoryType } from "./priority"

/** Live pilot pages included when DB has no published rows yet. */
export function pilotCategorySitemapEntries(siteUrl: string): SitemapUrlEntry[] {
  const now = new Date()
  return [
    {
      loc: `${siteUrl}${ROUTES.ecoleHub}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: priorityForCategoryType("GRADE", true),
    },
    {
      loc: `${siteUrl}${themePath("animaux")}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: priorityForCategoryType("THEME", false),
    },
  ]
}

export function pilotPuzzleSitemapEntries(siteUrl: string): SitemapUrlEntry[] {
  return [
    {
      loc: `${siteUrl}${puzzlePath(PILOT_PUZZLE_SLUG)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: PUZZLE_SITEMAP_PRIORITY,
    },
  ]
}
