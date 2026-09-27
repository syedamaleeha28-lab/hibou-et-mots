import { cache } from "react"
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

/**
 * FIX for the metadata-streaming race condition found via the SEO
 * audit follow-up: every one of these resolvers was a plain async
 * function, and every one of the ~24 pages that call them does so
 * TWICE per request — once from generateMetadata, once from the page
 * component — completely independently, with no coordination between
 * the two calls. On fully dynamic (searchParams-driven) routes, this
 * created a genuine race: Next.js's streaming renderer could flush the
 * initial <head> before whichever of the two independent async calls
 * happened to resolve first, causing title/description/canonical/
 * robots to intermittently land in <body> instead — confirmed via
 * repeated back-to-back fetches of the same URL returning DIFFERENT
 * results.
 *
 * React's cache() is the officially documented fix for exactly this
 * scenario (Next.js App Router docs: "Sharing data between
 * generateMetadata and Page"). It memoizes a function's result within
 * a single request — not across requests, not across users — so both
 * call sites resolve from the SAME promise instead of racing two
 * independent ones. Purely additive: no resolver's actual logic
 * changed, each was just renamed to an Impl function and wrapped.
 */

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

async function resolveHubCategoryPageDataImpl(
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
export const resolveHubCategoryPageData = cache(resolveHubCategoryPageDataImpl)

async function resolveEcoleHubPageDataImpl(page = 1): Promise<CategoryPageData> {
  return (await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.ecole, page)) ?? mockEcoleHubPageData(page)
}
export const resolveEcoleHubPageData = cache(resolveEcoleHubPageDataImpl)

async function resolveGradeCategoryPageDataImpl(
  gradeSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByGradeSlug(gradeSlug, locale), page, locale)
  if (fromDb) return fromDb
  // No PT-BR grade mocks — real DB rows exist for these now (see the
  // school-grade cluster seeding), so the DB path above should
  // normally succeed for pt-BR before ever reaching here.
  if (locale === "pt-BR") return null
  return mockGradeCategoryPageData(gradeSlug, page)
}
export const resolveGradeCategoryPageData = cache(resolveGradeCategoryPageDataImpl)

async function resolveThemeCategoryPageDataImpl(
  themeSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByThemeSlug(themeSlug, locale), page, locale)
  if (fromDb) return fromDb
  if (locale === "pt-BR") return mockThemeCategoryPageDataPt(themeSlug, page)
  return mockThemeCategoryPageData(themeSlug, page)
}
export const resolveThemeCategoryPageData = cache(resolveThemeCategoryPageDataImpl)

async function resolveSeasonalCategoryPageDataImpl(
  themeSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryBySeasonalThemeSlug(themeSlug, locale), page, locale)
  if (fromDb) return fromDb
  if (locale === "pt-BR") return null
  return mockSeasonalCategoryPageData(themeSlug, page)
}
export const resolveSeasonalCategoryPageData = cache(resolveSeasonalCategoryPageDataImpl)

async function resolveDifficultyCategoryPageDataImpl(
  levelSlug: string,
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByDifficultySlug(levelSlug, locale), page, locale)
  if (fromDb) return fromDb
  if (locale === "pt-BR") return mockDifficultyCategoryPageDataPt(levelSlug, page)
  return mockDifficultyCategoryPageData(levelSlug, page)
}
export const resolveDifficultyCategoryPageData = cache(resolveDifficultyCategoryPageDataImpl)

async function resolveComboCategoryPageDataImpl(
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
export const resolveComboCategoryPageData = cache(resolveComboCategoryPageDataImpl)

async function resolveAudienceCategoryPageDataImpl(
  audienceSlug: "enfants" | "adultes" | "seniors",
  page = 1,
  locale: Locale = "fr",
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbSlug(audienceSlug, page, locale)
  if (fromDb) return fromDb
  if (locale === "pt-BR") return null
  return mockAudienceCategoryPageData(audienceSlug, page)
}
export const resolveAudienceCategoryPageData = cache(resolveAudienceCategoryPageDataImpl)

async function resolvePressBrandCategoryPageDataImpl(
  brandSlug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const fromDb = await resolveFromDbCategory(() => getCategoryByPressBrandSlug(brandSlug), page, "fr")
  return fromDb ?? mockPressBrandCategoryPageData(brandSlug, page)
}
export const resolvePressBrandCategoryPageData = cache(resolvePressBrandCategoryPageDataImpl)

async function resolveStaticSupportCategoryPageDataImpl(
  path: string,
  page = 1,
): Promise<CategoryPageData | null> {
  if (!isKnownStaticSupportPath(path)) return null
  return mockStaticSupportCategoryPageData(path, page)
}
export const resolveStaticSupportCategoryPageData = cache(resolveStaticSupportCategoryPageDataImpl)

export { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
