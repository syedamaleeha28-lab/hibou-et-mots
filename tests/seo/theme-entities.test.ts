import { describe, expect, it } from "vitest"
import { getThemeFaq, getThemeIntro } from "@/lib/content/themes"
import { countWords } from "@/lib/content/phase1/intros"
import {
  buildThemeEntityCoverageReport,
  MAX_THEME_INTRO_WORDS,
  MIN_THEME_FAQ_ITEMS,
  MIN_THEME_INTRO_WORDS,
  THEME_ENTITY_DEFINITIONS,
  themeEntityCoveragePercent,
} from "@/lib/seo/theme-entities"
import { getThemeExploreCopy } from "@/lib/content/themes/theme-explore-links"

describe("theme entity coverage", () => {
  it("covers all ten audited themes with editorial content", () => {
    const report = buildThemeEntityCoverageReport()
    expect(report.themes).toHaveLength(THEME_ENTITY_DEFINITIONS.length)
    expect(report.themesWithoutContent).toEqual([])
  })

  it("meets intro word count and FAQ minimums on every theme", () => {
    for (const definition of THEME_ENTITY_DEFINITIONS) {
      const intro = getThemeIntro(definition.slug)
      expect(intro, definition.slug).toBeTruthy()
      const words = countWords(intro!)
      expect(words, definition.slug).toBeGreaterThanOrEqual(MIN_THEME_INTRO_WORDS)
      expect(words, definition.slug).toBeLessThanOrEqual(MAX_THEME_INTRO_WORDS)

      const faq = getThemeFaq(definition.slug)
      expect(faq?.length ?? 0, definition.slug).toBeGreaterThanOrEqual(MIN_THEME_FAQ_ITEMS)
    }
  })

  it("achieves full competitor entity coverage after expansion", () => {
    for (const definition of THEME_ENTITY_DEFINITIONS) {
      const intro = getThemeIntro(definition.slug)!
      const faq = getThemeFaq(definition.slug) ?? []
      const fullText = [
        intro,
        ...faq.flatMap((item) => [item.question, item.answer]),
        getThemeExploreCopy(definition.slug),
      ].join(" ")

      const coverage = themeEntityCoveragePercent(fullText, definition.competitorEntities)
      expect(coverage, definition.label).toBe(100)
    }
  })

  it("report table has no missing entities", () => {
    const report = buildThemeEntityCoverageReport()
    for (const theme of report.themes) {
      expect(theme.missingEntities, theme.label).toEqual([])
      expect(theme.introWordCountOk, theme.label).toBe(true)
      expect(theme.faqCountOk, theme.label).toBe(true)
    }
  })
})
