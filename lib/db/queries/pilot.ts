import type { CategoryPageData, PuzzlePageData } from "@/lib/db/types/page-data"
import { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/category-constants"
import { mockAnimauxPuzzlePageData } from "@/lib/db/adapters/mock-pilot"
import { getPuzzlePageData } from "./puzzle"

export {
  resolveEcoleHubPageData,
  resolveThemeCategoryPageData,
  resolveHubCategoryPageData,
  resolveGradeCategoryPageData,
  resolveSeasonalCategoryPageData,
  resolveDifficultyCategoryPageData,
  resolveComboCategoryPageData,
  resolveAudienceCategoryPageData,
  resolvePressBrandCategoryPageData,
  resolveStaticSupportCategoryPageData,
  HUB_CATEGORY_SLUGS,
} from "./category-resolvers"

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

/** Pilot: /mots-meles/{slug}/ */
export async function resolvePuzzlePageData(slug: string): Promise<PuzzlePageData | null> {
  const fromDb = await tryDb(() => getPuzzlePageData(slug))
  if (fromDb) return fromDb

  if (slug === PILOT_PUZZLE_SLUG) {
    return mockAnimauxPuzzlePageData()
  }

  return null
}

export { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/category-constants"
