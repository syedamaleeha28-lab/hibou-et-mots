import {
  seedCategorySitemapEntries,
  seedPuzzleSitemapEntries,
} from "./seed-entries"

/** Live pilot pages included when DB has no published rows yet. */
export function pilotCategorySitemapEntries(siteUrl: string) {
  return seedCategorySitemapEntries(siteUrl)
}

export function pilotPuzzleSitemapEntries(siteUrl: string) {
  return seedPuzzleSitemapEntries(siteUrl, 0)
}

export {
  seedCategorySitemapEntries,
  seedCategorySitemapPaths,
  seedPuzzleSitemapEntries,
  seedPuzzleSitemapPaths,
  seedPublishedPuzzleCount,
} from "./seed-entries"
