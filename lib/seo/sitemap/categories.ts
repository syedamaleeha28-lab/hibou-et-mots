import { prisma } from "@/lib/db/client"
import type { CategoryType } from "@/lib/db/types/page-data"
import { isCategoryHub } from "@/lib/db/queries/mappers"
import { absoluteUrl, resolveCategoryPath } from "@/lib/seo/routes"
import { computeIsIndexable } from "@/lib/seo/indexability"
import type { SitemapUrlEntry } from "./types"
import { pilotCategorySitemapEntries } from "./pilot-entries"
import { priorityForCategoryType } from "./priority"

const categoryInclude = {
  grade: true,
  theme: true,
  difficulty: true,
  pressBrand: true,
} as const

export async function getCategorySitemapEntries(siteUrl?: string): Promise<SitemapUrlEntry[]> {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://hibou-et-mots.fr"

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
      const indexable = computeIsIndexable({
        status: category.status,
        puzzleCount,
        minPuzzleThreshold: category.minPuzzleThreshold,
      })
      if (!indexable) continue

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

    if (entries.length > 0) return entries
  } catch {
    // DB unavailable — fall back to pilot entries below.
  }

  return pilotCategorySitemapEntries(base.replace(/\/$/, ""))
}
