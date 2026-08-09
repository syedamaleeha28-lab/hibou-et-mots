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
  mockDifficultyCategoryPageDataPt,
  mockHubImprimirPageDataPt,
  mockThemeCategoryPageDataPt,
} from "@/lib/db/adapters/mock-categories-pt"
import {
  getCategoryByDifficultySlug,
  getCategoryByGradeSlug,
  getCategoryByPressBrandSlug,
  getCategoryBySeasonalThemeSlug,
  getCategoryByThemeSlug,
  getCategoryPageData,
  getComboCategory,
} from "./category"

type Locale = "fr" | "pt-BR"

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

async function resolveFromDbSlug(
  slug: string,
  page: number,
  locale: Locale,
): Promise<CategoryPageData | null> {
  return tryDb(() => getCategoryPageData(slug, page, locale))
}

async function resolveFromDbCategory(
  fetchCategory: () => Promise<{ slug: string } | null>,
  page: number,
  locale: Locale,
): Promise<CategoryPageData | null> {
  return tryDb(async () => {
    const category = await fetchCategory()
    if (!category) return null
    return getCategoryPageData(category.slug, page, locale)
  })
}

export async function resolveHubCategoryPageData(
  hubSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbSlug(hubSlug, page, locale)
  if (fromDb) return fromDb

  if (locale === "pt-BR") {
    // v1 scope: only hub-imprimer has a PT-BR mock today.
    if (hubSlug === HUB_CATEGORY_SLUGS.imprimer) return mockHubImprimirPageDataPt(page)
    return null
  }

  if (isKnownHubSlug(hubSlug)) return mockHubCategoryPageData(hubSlug, page)
  return null
}

export async function resolveEcoleHubPageData(page = 1): Promise<CategoryPageData> {
  return (await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.ecole, page)) ?? mockEcoleHubPageData(page)
}

export async function resolveGradeCategoryPageData(
  gradeSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByGradeSlug(gradeSlug, locale), page, locale)
  if (fromDb) return fromDb
  // No PT-BR grade mocks in this pack yet (grades weren't in the v1 test batch).
  if (locale === "pt-BR") return null
  return mockGradeCategoryPageData(gradeSlug, page)
}

export async function resolveThemeCategoryPageData(
  themeSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByThemeSlug(themeSlug, locale), page, locale)
  if (fromDb) return fromDb
  if (locale === "pt-BR") return mockThemeCategoryPageDataPt(themeSlug, page)
  return mockThemeCategoryPageData(themeSlug, page)
}

export async function resolveSeasonalCategoryPageData(
  themeSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryBySeasonalThemeSlug(themeSlug, locale), page, locale)
  if (fromDb) return fromDb
  // Not in v1 test scope for PT-BR.
  if (locale === "pt-BR") return null
  return mockSeasonalCategoryPageData(themeSlug, page)
}

export async function resolveDifficultyCategoryPageData(
  levelSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByDifficultySlug(levelSlug, locale), page, locale)
  if (fromDb) return fromDb
  if (locale === "pt-BR") return mockDifficultyCategoryPageDataPt(levelSlug, page)
  return mockDifficultyCategoryPageData(levelSlug, page)
}

export async function resolveComboCategoryPageData(
  gradeSlug: string,
  themeSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getComboCategory(gradeSlug, themeSlug, locale), page, locale)
  if (fromDb) return fromDb
  if (locale === "pt-BR") return null
  return mockComboCategoryPageData(gradeSlug, themeSlug, page)
}

export async function resolveAudienceCategoryPageData(
  audienceSlug: "enfants" | "adultes" | "seniors",
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbSlug(audienceSlug, page, locale)
  if (fromDb) return fromDb
  if (locale === "pt-BR") return null
  return mockAudienceCategoryPageData(audienceSlug, page)
}

export async function resolvePressBrandCategoryPageData(
  brandSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByPressBrandSlug(brandSlug), page, "fr")
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
