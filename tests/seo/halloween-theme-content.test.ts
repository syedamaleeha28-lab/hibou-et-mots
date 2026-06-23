import { describe, expect, it } from "vitest"
import { HALLOWEEN_FAQ, HALLOWEEN_INTRO } from "@/lib/content/themes/halloween"
import { countWords, seasonalCategoryIntro } from "@/lib/content/phase1/intros"
import { mockSeasonalCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { faqPlaceholderFor } from "@/prisma/seed/faq"

const REQUIRED_ENTITIES = [
  "citrouille",
  "fantôme",
  "sorcière",
  "vampire",
  "chauve-souris",
  "monstre",
  "bonbons",
  "déguisement",
  "araignée",
  "squelette",
] as const

describe("halloween theme topical content", () => {
  it("intro is 250-350 words and includes required entities", () => {
    const words = countWords(HALLOWEEN_INTRO)
    expect(words).toBeGreaterThanOrEqual(250)
    expect(words).toBeLessThanOrEqual(350)

    const lower = HALLOWEEN_INTRO.toLowerCase()
    for (const entity of REQUIRED_ENTITIES) {
      expect(lower).toContain(entity)
    }
  })

  it("intro is not the generic seasonal template", () => {
    expect(HALLOWEEN_INTRO).not.toBe(seasonalCategoryIntro("Halloween"))
    expect(HALLOWEEN_INTRO.length).toBeGreaterThan(seasonalCategoryIntro("Halloween").length * 3)
  })

  it("FAQ is unique to halloween and not the generic seasonal template", () => {
    const genericSeasonal = faqPlaceholderFor("SEASONAL", { isSeasonal: true })
    expect(HALLOWEEN_FAQ.length).toBeGreaterThanOrEqual(4)
    expect(HALLOWEEN_FAQ).not.toEqual(genericSeasonal)
    expect(HALLOWEEN_FAQ.some((item) => item.answer.toLowerCase().includes("citrouille"))).toBe(true)
    expect(HALLOWEEN_FAQ.some((item) => item.answer.toLowerCase().includes("déguisement"))).toBe(
      true,
    )
  })

  it("mock seasonal page uses halloween intro and FAQ", () => {
    const page = mockSeasonalCategoryPageData("halloween")
    expect(page?.introText).toBe(HALLOWEEN_INTRO)
    expect(page?.faqJson).toEqual(HALLOWEEN_FAQ)
    expect(page?.metaDescription).toContain("mots cachés Halloween")
  })
})
