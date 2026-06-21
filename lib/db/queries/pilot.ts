import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { isKnownSeedPuzzleSlug } from "@/lib/db/adapters/puzzle-catalog"
import { mockPuzzlePageDataFromSeed } from "@/lib/db/adapters/mock-puzzle-seed"
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

/** /mots-meles/{slug}/ — DB first, then deterministic seed mock for catalog slugs. */
export async function resolvePuzzlePageData(slug: string): Promise<PuzzlePageData | null> {
  const fromDb = await tryDb(() => getPuzzlePageData(slug))
  if (fromDb) return fromDb

  if (isKnownSeedPuzzleSlug(slug)) {
    return mockPuzzlePageDataFromSeed(slug)
  }

  return null
}

export { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/category-constants"
