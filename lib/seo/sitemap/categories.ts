import { prisma } from "@/lib/db/client"
import type { CategoryType } from "@/lib/db/types/page-data"
import { isCategoryHub } from "@/lib/db/queries/mappers"
import { absoluteUrl, DEFAULT_SITE_URL, resolveCategoryPath } from "@/lib/seo/routes"
import { computeIsIndexable } from "@/lib/seo/indexability"
import type { SitemapUrlEntry } from "./types"
import { pilotCategorySitemapEntries } from "./pilot-entries"
import { priorityForCategoryType } from "./priority"
import {
  getAllMotsMelesListingPaths,
  shouldAlwaysIncludeCategoryInSitemap,
} from "./mots-meles-coverage"

const categoryInclude = {
  grade: true,
  theme: true,
  difficulty: true,
  pressBrand: true,
} as const

function mergeMotsMelesListingCoverage(
  entries: SitemapUrlEntry[],
  siteUrl: string,
): SitemapUrlEntry[] {
  const byLoc = new Map(entries.map((entry) => [entry.loc, entry]))
  const now = new Date()

  for (const path of getAllMotsMelesListingPaths()) {
    const loc = absoluteUrl(path, siteUrl)
    if (byLoc.has(loc)) continue

    const type: CategoryType = path.includes("/mots-meles-ecole/")
      ? "GRADE"
      : path.includes("/mots-meles-thematiques/")
        ? "THEME"
        : path.includes("/mots-meles-fetes-saisons/")
          ? "SEASONAL"
          : path.includes("/mots-meles-difficulte/")
            ? "DIFFICULTY"
            : "AUDIENCE"

    byLoc.set(loc, {
      loc,
      lastModified: now,
      changeFrequency: "weekly",
      priority: priorityForCategoryType(type, false),
    })
  }

  return [...byLoc.values()]
}

export async function getCategorySitemapEntries(siteUrl?: string): Promise<SitemapUrlEntry[]> {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL

  try {
    const categories = await prisma.category.findMany({
      where: { status: "PUBLISHED" },
      include: {
        ...categoryInclude,
        puzzles: {
          where: { puzzle: { status: "PUBLISHED" } },
          select: { puzzleId: true },
        },
      },
    })

    const entries: SitemapUrlEntry[] = []

    for (const category of categories) {
      const puzzleCount = category.puzzles.length
      const alwaysInclude = shouldAlwaysIncludeCategoryInSitemap({
        type: category.type,
        slug: category.slug,
      })
      const indexable = computeIsIndexable({
        status: category.status,
        puzzleCount,
        minPuzzleThreshold: category.minPuzzleThreshold,
      })
      if (!alwaysInclude && !indexable) continue

      const hub = isCategoryHub(category)
      const path = resolveCategoryPath({
        type: category.type as CategoryType,
        slug: category.slug,
        grade: category.grade,
        theme: category.theme,
        difficulty: category.difficulty,
        pressBrand: category.pressBrand,
      })

      entries.push({
        loc: absoluteUrl(path, base),
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: priorityForCategoryType(category.type as CategoryType, hub),
      })
    }

    if (entries.length > 0) return mergeMotsMelesListingCoverage(entries, base)
  } catch {
    // DB unavailable — fall back to pilot entries below.
  }

  return mergeMotsMelesListingCoverage(
    pilotCategorySitemapEntries(base.replace(/\/$/, "")),
    base,
  )
}
