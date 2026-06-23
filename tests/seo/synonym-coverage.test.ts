import { describe, expect, it } from "vitest"
import { IMPORTANT_PAGE_PATHS } from "@/lib/seo/link-map/important-pages"
import {
  buildSynonymCoverageReport,
  detectSynonymsInText,
  MIN_SECONDARY_SYNONYMS_IMPORTANT,
  WORD_SEARCH_SYNONYMS,
} from "@/lib/seo/synonyms"
import { CATEGORY_SYNONYM_NOTE } from "@/lib/content/synonym-phrases"

describe("synonym coverage audit", () => {
  it("detects all six word-search synonyms in the shared category note", () => {
    const present = detectSynonymsInText(CATEGORY_SYNONYM_NOTE)
    expect(present).toHaveLength(WORD_SEARCH_SYNONYMS.length)
  })

  it("reports no missing or weak coverage on important pages after enrichment", async () => {
    const report = await buildSynonymCoverageReport()

    expect(report.auditedPageCount).toBeGreaterThan(40)
    expect(report.pagesMissingSynonyms).toEqual([])

    const weakImportant = report.pagesWithWeakCoverage.filter((page) => page.isImportant)
    expect(weakImportant).toEqual([])

    for (const path of IMPORTANT_PAGE_PATHS) {
      const page = report.pages.find((entry) => entry.path === path)
      expect(page, `${path} should be audited`).toBeDefined()
      expect(page!.present).toContain("mots-meles")
      expect(page!.secondaryCount).toBeGreaterThanOrEqual(MIN_SECONDARY_SYNONYMS_IMPORTANT)
    }
  })

  it("tracks synonym totals across the catalog", async () => {
    const report = await buildSynonymCoverageReport()

    for (const term of WORD_SEARCH_SYNONYMS) {
      expect(report.synonymTotals[term.id]).toBeGreaterThan(0)
    }
  })
})
