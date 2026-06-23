import { describe, expect, it } from "vitest"
import { collectInternalLinksForMap } from "@/lib/audit/collect-internal-links"
import {
  buildInternalLinkMap,
  IMPORTANT_PAGE_PATHS,
  MIN_INBOUND_LINKS,
} from "@/lib/seo/link-map"
import { validateLinkGraph } from "@/lib/seo/link-graph/validate"
import { ROUTES } from "@/lib/seo/routes"

describe("internal link map", () => {
  it("gives every important page at least 3 inbound internal links", async () => {
    const links = await collectInternalLinksForMap()
    const report = buildInternalLinkMap(links)

    expect(report.orphanPages).toEqual([])
    expect(report.belowMinimum).toEqual([])
    expect(IMPORTANT_PAGE_PATHS.length).toBeGreaterThanOrEqual(30)

    for (const path of IMPORTANT_PAGE_PATHS) {
      const page = report.pages.find((entry) => entry.path === path)
      expect(
        page?.inboundCount ?? 0,
        `${path} should have >= ${MIN_INBOUND_LINKS} inbound links`,
      ).toBeGreaterThanOrEqual(MIN_INBOUND_LINKS)
    }
  })

  it("connects pillar pages in the seed link graph", async () => {
    const report = await validateLinkGraph()
    expect(report.orphanCount).toBe(0)
    expect(report.ok).toBe(true)
  })

  it("reports strong inbound coverage on homepage, generator, and printable hubs", async () => {
    const links = await collectInternalLinksForMap()
    const report = buildInternalLinkMap(links)

    expect(report.pillarSummary[ROUTES.home]).toBeGreaterThanOrEqual(3)
    expect(report.pillarSummary[ROUTES.generateur]).toBeGreaterThanOrEqual(MIN_INBOUND_LINKS)
    expect(report.pillarSummary[ROUTES.imprimer]).toBeGreaterThanOrEqual(MIN_INBOUND_LINKS)
    expect(report.pillarSummary[ROUTES.gratuits]).toBeGreaterThanOrEqual(MIN_INBOUND_LINKS)
    expect(report.pillarSummary[ROUTES.thematiquesHub]).toBeGreaterThanOrEqual(MIN_INBOUND_LINKS)
    expect(report.pillarSummary[ROUTES.enfants]).toBeGreaterThanOrEqual(MIN_INBOUND_LINKS)
  })
})
