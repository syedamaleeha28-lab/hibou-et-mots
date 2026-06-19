import type { CategoryPageData, PuzzlePageData } from "@/lib/db/types/page-data"
import {
  mockAnimauxCategoryPageData,
  mockAnimauxPuzzlePageData,
  mockEcoleHubPageData,
  PILOT_PUZZLE_SLUG,
} from "@/lib/db/adapters/mock-pilot"
import { getCategoryPageData, getCategoryByThemeSlug } from "./category"
import { getPuzzlePageData } from "./puzzle"

async function tryDb<T>(fn: () => Promise<T | null>): Promise<T | null> {
  if (process.env.VITEST === "true" || process.env.PILOT_USE_MOCK_ONLY === "true") {
    return null
  }
  try {
    return await fn()
  } catch {
    return null
  }
}

/** Pilot: /mots-meles-ecole/ */
export async function resolveEcoleHubPageData(page = 1): Promise<CategoryPageData> {
  const fromDb = await tryDb(() => getCategoryPageData("hub-ecole", page))
  return fromDb ?? mockEcoleHubPageData(page)
}

/** Pilot: /mots-meles-thematiques/{theme}/ */
export async function resolveThemeCategoryPageData(
  themeSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await tryDb(async () => {
    const category = await getCategoryByThemeSlug(themeSlug)
    if (!category) return null
    return getCategoryPageData(category.slug, page)
  })

  if (fromDb) return fromDb

  if (themeSlug === "animaux") {
    return mockAnimauxCategoryPageData(page)
  }

  return null
}

/** Pilot: /mots-meles/{slug}/ */
export async function resolvePuzzlePageData(slug: string): Promise<PuzzlePageData | null> {
  const fromDb = await tryDb(() => getPuzzlePageData(slug))
  if (fromDb) return fromDb

  if (slug === PILOT_PUZZLE_SLUG) {
    return mockAnimauxPuzzlePageData()
  }

  return null
}

export { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/mock-pilot"
