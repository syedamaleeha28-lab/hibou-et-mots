import { describe, expect, it } from "vitest"
import { getStaticSitemapEntries } from "@/lib/seo/sitemap/static"
import { seedCategorySitemapPaths } from "@/lib/seo/sitemap/seed-entries"
import { ROUTES } from "@/lib/seo/routes"
import { findMissingStaticSitemapRoutes } from "@/lib/seo/sitemap/routability"

const MOTS_MELES_STATIC_HUBS = [
  ROUTES.gratuits,
  ROUTES.imprimer,
  ROUTES.enfants,
  ROUTES.adultes,
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

  it("maps every static mots-mêlés hub to an existing app route file", () => {
    const missing = findMissingStaticSitemapRoutes(process.cwd())
    const missingHubs = missing.filter((path) => path.startsWith("/mots-meles"))
    expect(missingHubs).toEqual([])
  })
})
