/**
 * Guaranteed sitemap coverage for public /mots-meles-* listing pages.
 * Paths match generateStaticParams + audience hubs, always with trailing slash.
 */
import {
  difficultyStaticParams,
  gradeStaticParams,
  seasonalStaticParams,
  themeStaticParams,
} from "@/lib/app/category-route-params"
import {
  ROUTES,
  difficultyPath,
  gradePath,
  seasonalPath,
  themePath,
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
