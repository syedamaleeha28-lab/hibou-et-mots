import { describe, expect, it } from "vitest"
import { getStaticSitemapEntries } from "@/lib/seo/sitemap/static"
import { seedCategorySitemapPaths } from "@/lib/seo/sitemap/seed-entries"
import { getAllMotsMelesListingPaths } from "@/lib/seo/sitemap/mots-meles-coverage"
import { ROUTES, seasonalPath } from "@/lib/seo/routes"
import { findMissingStaticSitemapRoutes } from "@/lib/seo/sitemap/routability"
import { MVP_SEASONAL_THEME_SLUGS } from "@/lib/db/adapters/category-constants"
import {
  difficultyStaticParams,
  gradeStaticParams,
  seasonalStaticParams,
  themeStaticParams,
} from "@/lib/app/category-route-params"

const MOTS_MELES_STATIC_HUBS = [
  ROUTES.gratuits,
  ROUTES.imprimer,
  ROUTES.enfants,
  ROUTES.adultes,
  ROUTES.seniors,
  ROUTES.ecoleHub,
  ROUTES.thematiquesHub,
  ROUTES.fetesHub,
  ROUTES.difficulteHub,
  ROUTES.presseHub,
] as const

describe("sitemap — /mots-meles-* coverage", () => {
  it("lists all mots-mêlés hub pages in the static sitemap", () => {
    const staticPaths = getStaticSitemapEntries("https://example.test").map(
      (entry) => new URL(entry.loc).pathname,
    )

    for (const hub of MOTS_MELES_STATIC_HUBS) {
      expect(staticPaths).toContain(hub)
    }
  })

  it("auto-includes seeded category pages under /mots-meles- without manual STATIC_PATHS edits", () => {
    const categoryPaths = seedCategorySitemapPaths()

    expect(categoryPaths.length).toBeGreaterThan(0)
    expect(categoryPaths.every((path) => path.startsWith("/mots-meles"))).toBe(true)

    // Grade subpages are category-driven, not static list entries
    expect(categoryPaths.some((path) => path.includes("/mots-meles-ecole/cp/"))).toBe(true)
    expect(categoryPaths.some((path) => path.includes("/mots-meles-thematiques/"))).toBe(true)
  })

  it("includes every theme, grade, seasonal, difficulty, and audience listing with trailing slash", () => {
    const categoryPaths = new Set(seedCategorySitemapPaths())
    const required = getAllMotsMelesListingPaths()

    expect(required.length).toBe(
      themeStaticParams().length +
        gradeStaticParams().length +
        seasonalStaticParams().length +
        difficultyStaticParams().length +
        3,
    )

    for (const path of required) {
      expect(path.endsWith("/")).toBe(true)
      expect(categoryPaths.has(path)).toBe(true)
    }

    // Thin grades / difficulty must still be listed (not gated by puzzle threshold)
    expect(categoryPaths.has("/mots-meles-ecole/maternelle/")).toBe(true)
    expect(categoryPaths.has("/mots-meles-ecole/ce2/")).toBe(true)
    expect(categoryPaths.has("/mots-meles-ecole/cm1/")).toBe(true)
    expect(categoryPaths.has("/mots-meles-ecole/6e/")).toBe(true)
    expect(categoryPaths.has("/mots-meles-difficulte/geant/")).toBe(true)
  })

  it("maps every static mots-mêlés hub to an existing app route file", () => {
    const missing = findMissingStaticSitemapRoutes(process.cwd())
    const missingHubs = missing.filter((path) => path.startsWith("/mots-meles"))
    expect(missingHubs).toEqual([])
  })

  it("never lists fêtes/saisons pages under /mots-meles-thematiques/", () => {
    const categoryPaths = seedCategorySitemapPaths()
    const listingPaths = getAllMotsMelesListingPaths()

    for (const slug of MVP_SEASONAL_THEME_SLUGS) {
      const wrong = `/mots-meles-thematiques/${slug}/`
      const correct = seasonalPath(slug)
      expect(categoryPaths).not.toContain(wrong)
      expect(listingPaths).not.toContain(wrong)
      expect(categoryPaths).toContain(correct)
      expect(listingPaths).toContain(correct)
    }
  })
})
