import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { findMissingStaticSitemapRoutes, listStaticSitemapRoutability } from "@/lib/seo/sitemap/routability"
import { ROUTES } from "@/lib/seo/routes"

describe("sitemap routability", () => {
  it("maps every static sitemap URL to an existing app page", () => {
    const missing = findMissingStaticSitemapRoutes(process.cwd())
    expect(missing).toEqual([])
  })

  it("includes legal pages with route files", () => {
    const root = process.cwd()
    const entries = listStaticSitemapRoutability(root)
    const paths = entries.map((entry) => entry.path)

    expect(paths).toContain(ROUTES.mentionsLegales)
    expect(paths).toContain(ROUTES.confidentialite)
    expect(paths).toContain(ROUTES.contact)
    expect(paths).toContain(ROUTES.aPropos)
    expect(paths).toContain(ROUTES.auteur)

    for (const legalPath of [
      ROUTES.mentionsLegales,
      ROUTES.confidentialite,
      ROUTES.contact,
      ROUTES.aPropos,
      ROUTES.auteur,
    ]) {
      const entry = entries.find((item) => item.path === legalPath)
      expect(entry?.exists).toBe(true)
    }
  })

  it("does not list search in static sitemap entries", () => {
    const entries = listStaticSitemapRoutability(process.cwd())
    expect(entries.some((entry) => entry.path.includes("recherche"))).toBe(false)
  })

  it("has homepage route file", () => {
    expect(existsSync(resolve(process.cwd(), "app/page.tsx"))).toBe(true)
  })
})
