import { describe, expect, it } from "vitest"
import { collectAllInternalLinks } from "@/lib/audit/collect-internal-links"
import { runInternalLinkAudit } from "@/lib/audit/internal-link-audit"
import { auditRenderedPuzzleLinks } from "@/lib/audit/puzzle-links"
import { resolveInternalPath } from "@/lib/audit/resolve-internal-path"
import { popularPuzzleHref } from "@/lib/home/popular-puzzle-links"
import { popularPuzzles } from "@/lib/content"
import { MVP_SEASONAL_THEME_SLUGS } from "@/lib/db/adapters/category-constants"
import { seedCategorySitemapPaths, seedPuzzleSitemapPaths } from "@/lib/seo/sitemap/seed-entries"
import { getStaticSitemapEntries } from "@/lib/seo/sitemap/static"

describe("internal link integrity", () => {
  it("passes the full rendered + sitemap audit with zero 404s and zero orphans", async () => {
    const report = await runInternalLinkAudit()

    expect(report.totalChecked).toBeGreaterThan(200)
    expect(report.notFound).toBe(0)
    expect(report.graph.orphanCount).toBe(0)
    expect(report.puzzleLinks.unresolved).toBe(0)
    expect(report.puzzleLinks.missingSeed).toBe(0)
    expect(report.sitemapLinks.notFound).toBe(0)
    expect(report.ok).toBe(true)
  })

  it("resolves every homepage popular puzzle link", async () => {
    for (const puzzle of popularPuzzles) {
      const href = popularPuzzleHref(puzzle.title)
      const resolution = await resolveInternalPath(href)
      expect(resolution.status, `${puzzle.title} -> ${href}`).toBe("valid")
    }
  })

  it("resolves seasonal category puzzle grids", async () => {
    const { records, unresolved } = await auditRenderedPuzzleLinks()

    for (const theme of MVP_SEASONAL_THEME_SLUGS) {
      const seasonalLinks = records.filter((record) => record.source.startsWith(`seasonal:${theme}`))
      expect(seasonalLinks.length).toBeGreaterThan(0)
      expect(unresolved.filter((record) => record.source.startsWith(`seasonal:${theme}`))).toEqual([])
    }
  })

  it("resolves related puzzle links from puzzle pages", async () => {
    const relatedLinks = (await collectAllInternalLinks()).filter((link) =>
      link.source.includes(":related"),
    )

    expect(relatedLinks.length).toBeGreaterThan(0)

    for (const link of relatedLinks) {
      const resolution = await resolveInternalPath(link.href)
      expect(resolution.status, link.source).toBe("valid")
    }
  })

  it("resolves every static and seed sitemap URL", async () => {
    const siteUrl = "https://hibou-et-mots.fr"
    const paths = [
      ...getStaticSitemapEntries(siteUrl).map((entry) => new URL(entry.loc).pathname),
      ...seedCategorySitemapPaths(),
      ...seedPuzzleSitemapPaths(),
    ]

    expect(paths.length).toBeGreaterThan(100)

    for (const path of paths) {
      const resolution = await resolveInternalPath(path)
      expect(resolution.status, path).toBe("valid")
    }
  })

  it("includes navigation, footer, and tool page links in the audit scope", async () => {
    const links = await collectAllInternalLinks()
    const sections = new Set(links.map((link) => link.section))

    expect(sections.has("navigation")).toBe(true)
    expect(sections.has("footer")).toBe(true)
    expect(sections.has("tool")).toBe(true)
    expect(sections.has("homepage")).toBe(true)
    expect(sections.has("sitemap")).toBe(true)
  })
})
