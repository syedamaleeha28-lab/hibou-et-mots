/**
 * Guaranteed sitemap coverage for public /mots-meles-* listing pages.
 * Paths match generateStaticParams + audience hubs, always with trailing slash.
 */
import {
  difficultyStaticParams,
  gradeStaticParams,
  seasonalStaticParams,
  themeStaticParams,
  ptDifficultyStaticParams,
  ptThemeStaticParams,
} from "@/lib/app/category-route-params"
import {
  ROUTES,
  difficultyPath,
  gradePath,
  seasonalPath,
  themePath,
  ptDifficultyPath,
  ptThemePath,
  PT_ROUTES,
} from "@/lib/seo/routes"

/** Audience hubs that must always appear in the sitemap. */
export const MOTS_MELES_AUDIENCE_PATHS = [
  ROUTES.enfants,
  ROUTES.adultes,
  ROUTES.seniors,
] as const

/**
 * Every publicly routed theme / grade / seasonal / difficulty / audience page.
 * Used so Google discovers trailing-slash canonicals instead of non-slash URLs.
 *
 * REVERTED to French-only (as it originally was). A prior pack added PT-BR
 * paths directly into this function, which broke an important invariant:
 * this function is shared by BOTH the real DB-backed sitemap (categories.ts,
 * which legitimately needs PT coverage) AND the DB-unavailable fallback
 * (seed-entries.ts, which is documented and tested as French-only by
 * design). Mixing PT into the shared function silently leaked it into the
 * fallback too, which is wrong. PT coverage now lives in the separate
 * getAllCacaPalavrasListingPaths() below, merged in ONLY by categories.ts.
 */
export function getAllMotsMelesListingPaths(): string[] {
  const paths = new Set<string>(MOTS_MELES_AUDIENCE_PATHS)

  for (const { theme } of themeStaticParams()) {
    paths.add(themePath(theme))
  }
  for (const { grade } of gradeStaticParams()) {
    paths.add(gradePath(grade))
  }
  for (const { theme } of seasonalStaticParams()) {
    paths.add(seasonalPath(theme))
  }
  for (const { level } of difficultyStaticParams()) {
    paths.add(difficultyPath(level))
  }

  return [...paths].sort()
}

/**
 * PT-BR equivalent of getAllMotsMelesListingPaths() — kept SEPARATE on
 * purpose (see note above). Only categories.ts's real (DB-backed) sitemap
 * merge step should use this; the seed-entries.ts fallback deliberately
 * does not.
 */
export const PT_HUB_PATHS = [
  PT_ROUTES.imprimir,
  PT_ROUTES.difficulteHub,
  PT_ROUTES.thematiquesHub,
] as const

export function getAllCacaPalavrasListingPaths(): string[] {
  const paths = new Set<string>(PT_HUB_PATHS)

  for (const { theme } of ptThemeStaticParams()) {
    paths.add(ptThemePath(theme))
  }
  for (const { level } of ptDifficultyStaticParams()) {
    paths.add(ptDifficultyPath(level))
  }

  return [...paths].sort()
}

/** Category types always listed in the sitemap (even below puzzle threshold). */
const ALWAYS_SITEMAP_TYPES = new Set(["THEME", "GRADE", "SEASONAL", "DIFFICULTY"])

const AUDIENCE_SITEMAP_SLUGS = new Set(["enfants", "adultes", "seniors"])

export function shouldAlwaysIncludeCategoryInSitemap(input: {
  type: string
  slug: string
}): boolean {
  if (ALWAYS_SITEMAP_TYPES.has(input.type)) return true
  return input.type === "AUDIENCE" && AUDIENCE_SITEMAP_SLUGS.has(input.slug)
}
