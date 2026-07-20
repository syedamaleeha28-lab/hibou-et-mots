import { getSeedPuzzlePlan } from "@/lib/db/adapters/puzzle-catalog"
import { computeIsIndexable } from "@/lib/seo/indexability"
import { categoryPathFromDefinition } from "@/lib/seo/link-graph/paths"
import { absoluteUrl, puzzlePath } from "@/lib/seo/routes"
import { CATEGORY_SEED_DEFINITIONS } from "@/prisma/seed/categories"
import type { SitemapUrlEntry } from "./types"
import { PUZZLE_SITEMAP_PRIORITY, priorityForCategoryType } from "./priority"
import { SITEMAP_PUZZLE_BATCH_SIZE } from "./types"
import {
  getAllMotsMelesListingPaths,
  shouldAlwaysIncludeCategoryInSitemap,
} from "./mots-meles-coverage"

const DEFAULT_MIN_PUZZLE_THRESHOLD = 4

function puzzleCountByCategorySlug(): Map<string, number> {
  const counts = new Map<string, number>()
  for (const spec of getSeedPuzzlePlan()) {
    for (const slug of spec.categorySlugs) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1)
    }
  }
  return counts
}

function isSeedCategorySitemapEligible(
  def: (typeof CATEGORY_SEED_DEFINITIONS)[number],
  counts: Map<string, number>,
): boolean {
  if (shouldAlwaysIncludeCategoryInSitemap({ type: def.type, slug: def.slug })) {
    return true
  }
  return computeIsIndexable({
    status: "PUBLISHED",
    puzzleCount: counts.get(def.slug) ?? 0,
    minPuzzleThreshold: DEFAULT_MIN_PUZZLE_THRESHOLD,
  })
}

export function seedCategorySitemapPaths(): string[] {
  const counts = puzzleCountByCategorySlug()
  const paths = new Set(
    CATEGORY_SEED_DEFINITIONS.filter((def) => isSeedCategorySitemapEligible(def, counts)).map(
      (def) => categoryPathFromDefinition(def),
    ),
  )
  for (const path of getAllMotsMelesListingPaths()) {
    paths.add(path)
  }
  return [...paths]
}

export function seedPuzzleSitemapPaths(): string[] {
  return getSeedPuzzlePlan().map((spec) => puzzlePath(spec.slug))
}

export function seedPublishedPuzzleCount(): number {
  return getSeedPuzzlePlan().length
}

export function seedCategorySitemapEntries(siteUrl: string): SitemapUrlEntry[] {
  const now = new Date()
  const counts = puzzleCountByCategorySlug()
  const byLoc = new Map<string, SitemapUrlEntry>()

  for (const def of CATEGORY_SEED_DEFINITIONS) {
    if (!isSeedCategorySitemapEligible(def, counts)) continue
    const loc = absoluteUrl(categoryPathFromDefinition(def), siteUrl)
    byLoc.set(loc, {
      loc,
      lastModified: now,
      changeFrequency: "weekly",
      priority: priorityForCategoryType(def.type, def.isHub === true),
    })
  }

  for (const path of getAllMotsMelesListingPaths()) {
    const loc = absoluteUrl(path, siteUrl)
    if (byLoc.has(loc)) continue
    byLoc.set(loc, {
      loc,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  }

  return [...byLoc.values()]
}

export function seedPuzzleSitemapEntries(siteUrl: string, page = 0): SitemapUrlEntry[] {
  const skip = page * SITEMAP_PUZZLE_BATCH_SIZE
  const now = new Date()

  return getSeedPuzzlePlan()
    .slice(skip, skip + SITEMAP_PUZZLE_BATCH_SIZE)
    .map((spec) => ({
      loc: absoluteUrl(puzzlePath(spec.slug), siteUrl),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: PUZZLE_SITEMAP_PRIORITY,
    }))
}
