import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/category-constants"
import {
  mockAnimauxCategoryPageData,
  mockEcoleHubPageData,
} from "@/lib/db/adapters/mock-categories"
import { mockPuzzlePageDataFromSeed } from "@/lib/db/adapters/mock-puzzle-seed"

export { PILOT_PUZZLE_SLUG, mockEcoleHubPageData, mockAnimauxCategoryPageData }

export function mockAnimauxPuzzlePageData(): PuzzlePageData {
  return mockPuzzlePageDataFromSeed(PILOT_PUZZLE_SLUG)!
}
