import type { CategoryPageData } from "@/lib/db/types/page-data"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import {
  isKnownHubSlug,
  isKnownStaticSupportPath,
  mockAudienceCategoryPageData,
  mockComboCategoryPageData,
  mockDifficultyCategoryPageData,
  mockEcoleHubPageData,
  mockGradeCategoryPageData,
  mockHubCategoryPageData,
  mockPressBrandCategoryPageData,
  mockSeasonalCategoryPageData,
  mockStaticSupportCategoryPageData,
  mockThemeCategoryPageData,
} from "@/lib/db/adapters/mock-categories"
import {
  getCategoryByDifficultySlug,
  getCategoryByGradeSlug,
  getCategoryByPressBrandSlug,
  getCategoryBySeasonalThemeSlug,
  getCategoryByThemeSlug,
  getCategoryPageData,
  getComboCategory,
} from "./category"

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

async function resolveFromDbSlug(slug: string, page: number): Promise<CategoryPageData | null> {
  return tryDb(() => getCategoryPageData(slug, page))
}

async function resolveFromDbCategory(
  fetchCategory: () => Promise<{ slug: string } | null>,
  page: number,
): Promise<CategoryPageData | null> {
  return tryDb(async () => {
    const category = await fetchCategory()
    if (!category) return null
    return getCategoryPageData(category.slug, page)
  })
}

export async function resolveHubCategoryPageData(
  hubSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbSlug(hubSlug, page)
  if (fromDb) return fromDb
  if (isKnownHubSlug(hubSlug)) return mockHubCategoryPageData(hubSlug, page)
  return null
}

export async function resolveEcoleHubPageData(page = 1): Promise<CategoryPageData> {
  return (await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.ecole, page)) ?? mockEcoleHubPageData(page)
}

export async function resolveGradeCategoryPageData(
  gradeSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByGradeSlug(gradeSlug), page)
  return fromDb ?? mockGradeCategoryPageData(gradeSlug, page)
}

export async function resolveThemeCategoryPageData(
  themeSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByThemeSlug(themeSlug), page)
  return fromDb ?? mockThemeCategoryPageData(themeSlug, page)
}

export async function resolveSeasonalCategoryPageData(
  themeSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryBySeasonalThemeSlug(themeSlug), page)
  return fromDb ?? mockSeasonalCategoryPageData(themeSlug, page)
}

export async function resolveDifficultyCategoryPageData(
  levelSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByDifficultySlug(levelSlug), page)
  return fromDb ?? mockDifficultyCategoryPageData(levelSlug, page)
}

export async function resolveComboCategoryPageData(
  gradeSlug: string,
  themeSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getComboCategory(gradeSlug, themeSlug), page)
  return fromDb ?? mockComboCategoryPageData(gradeSlug, themeSlug, page)
}

export async function resolveAudienceCategoryPageData(
  audienceSlug: "enfants" | "adultes" | "seniors",
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbSlug(audienceSlug, page)
  return fromDb ?? mockAudienceCategoryPageData(audienceSlug, page)
}

export async function resolvePressBrandCategoryPageData(
  brandSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByPressBrandSlug(brandSlug), page)
  return fromDb ?? mockPressBrandCategoryPageData(brandSlug, page)
}

export async function resolveStaticSupportCategoryPageData(
  path: string,
  page = 1,
): Promise<CategoryPageData | null> {
  if (!isKnownStaticSupportPath(path)) return null
  return mockStaticSupportCategoryPageData(path, page)
}

export { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
