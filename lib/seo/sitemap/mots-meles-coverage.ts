/**
 * Guaranteed sitemap coverage for public /mots-meles-* listing pages.
 * Paths match generateStaticParams + audience hubs, always with trailing slash.
 */
import {
  difficultyStaticParams,
  gradeStaticParams,
  seasonalStaticParams,
  themeStaticParams,
  // PT-BR pack additions:
  ptDifficultyStaticParams,
  ptThemeStaticParams,
} from "@/lib/app/category-route-params"
import {
  ROUTES,
  difficultyPath,
  gradePath,
  seasonalPath,
  themePath,
  // PT-BR pack additions:
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
 * PT-BR pack: hub paths guaranteed in the sitemap the same way
 * MOTS_MELES_AUDIENCE_PATHS guarantees the French audience hubs — belt
 * and suspenders alongside the DB-category-driven path in categories.ts,
 * so PT hub coverage survives even if a hub category row is ever missing
 * (e.g. before a re-seed in some environment).
 */
export const PT_HUB_PATHS = [
  PT_ROUTES.imprimir,
  PT_ROUTES.difficulteHub,
  PT_ROUTES.thematiquesHub,
] as const

/**
 * Every publicly routed theme / grade / seasonal / difficulty / audience page.
 * Used so Google discovers trailing-slash canonicals instead of non-slash URLs.
 *
 * PT-BR pack: now also includes Portuguese theme/difficulty/hub paths,
 * matching how the French set has always worked. Grades and seasonal
 * have no PT-BR static params yet (out of this batch's scope), so
 * nothing to add there until that content exists.
 */
export function getAllMotsMelesListingPaths(): string[] {
  const paths = new Set<string>([...MOTS_MELES_AUDIENCE_PATHS, ...PT_HUB_PATHS])

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
