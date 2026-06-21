import { describe, expect, it } from "vitest"
import { auditRenderedPuzzleLinks } from "@/lib/audit/puzzle-links"
import { MVP_SEASONAL_THEME_SLUGS } from "@/lib/db/adapters/category-constants"

describe("rendered puzzle links resolve", () => {
  it("resolves every homepage and category puzzle href to a page", async () => {
    const { records, unresolved, missingSeed } = await auditRenderedPuzzleLinks()

    expect(records.length).toBeGreaterThan(0)
    expect(missingSeed).toEqual([])
    expect(unresolved).toEqual([])
  })

  it("resolves seasonal category grids (carnaval, ete, halloween, noel, paques, rentree)", async () => {
    const { records, unresolved } = await auditRenderedPuzzleLinks()

    for (const theme of MVP_SEASONAL_THEME_SLUGS) {
      const seasonalLinks = records.filter((r) => r.source.startsWith(`seasonal:${theme}`))
      expect(seasonalLinks.length).toBeGreaterThan(0)
      expect(unresolved.filter((r) => r.source.startsWith(`seasonal:${theme}`))).toEqual([])
    }
  })
})
