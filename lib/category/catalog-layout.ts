import { isStaticSupportCategorySlug } from "@/lib/db/adapters/category-constants"

type EmptyCatalogCategory = {
  slug: string
  puzzleCount: number
}

/** True for puzzle-catalog pages with no puzzles (excludes static-support editorial routes). */
export function shouldUseEmptyCatalogMode(category: EmptyCatalogCategory): boolean {
  return category.puzzleCount === 0 && !isStaticSupportCategorySlug(category.slug)
}
