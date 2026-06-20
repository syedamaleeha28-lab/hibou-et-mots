import { describe, expect, it } from "vitest"
import { normalizePath } from "@/lib/seo/canonical"
import {
  validateLinkGraphFromData,
  buildSeedLinkGraph,
  listSeedRequiredPages,
} from "@/lib/seo/link-graph/validate"
import { ROUTES } from "@/lib/seo/routes"

describe("link graph validation", () => {
  it("passes for the seed content graph within depth 3", () => {
    const report = validateLinkGraphFromData({
      adjacency: buildSeedLinkGraph(),
      requiredPages: listSeedRequiredPages(),
      source: "seed",
    })

    expect(report.ok).toBe(true)
    expect(report.orphanCount).toBe(0)
    expect(report.depthViolationCount).toBe(0)
    expect(report.requiredPageCount).toBeGreaterThan(100)
  })

  it("includes homepage navigation targets", () => {
    const adjacency = buildSeedLinkGraph()
    const homeLinks = adjacency.get("/") ?? new Set()

    expect(homeLinks.has(ROUTES.gratuits)).toBe(true)
    expect(homeLinks.has(ROUTES.ecoleHub)).toBe(true)
    expect(homeLinks.has("/mots-meles-thematiques/animaux/")).toBe(true)
  })

  it("flags unreachable pages", () => {
    const report = validateLinkGraphFromData({
      adjacency: new Map([[normalizePath("/"), new Set()]]),
      requiredPages: ["/", "/mots-meles-thematiques/animaux/"],
      source: "seed",
    })

    expect(report.ok).toBe(false)
    expect(report.orphans).toHaveLength(1)
  })
})
