import { describe, expect, it } from "vitest"
import { FRUITS_FAQ, FRUITS_INTRO } from "@/lib/content/themes/fruits"
import { countWords, themeCategoryIntro } from "@/lib/content/phase1/intros"
import { mockThemeCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { faqPlaceholderFor } from "@/prisma/seed/faq"

const REQUIRED_ENTITIES = [
  "pomme",
  "poire",
  "banane",
  "orange",
  "raisin",
  "fraise",
  "kiwi",
  "ananas",
  "mangue",
  "pastèque",
] as const

const SEMANTIC_PHRASES = [
  "vocabulaire fruits",
  "alimentation",
  "activité éducative",
] as const

describe("fruits theme topical content", () => {
  it("intro is 250-350 words and includes required entities", () => {
    const words = countWords(FRUITS_INTRO)
    expect(words).toBeGreaterThanOrEqual(250)
    expect(words).toBeLessThanOrEqual(350)

    const lower = FRUITS_INTRO.toLowerCase()
    for (const entity of REQUIRED_ENTITIES) {
      expect(lower).toContain(entity)
    }
    for (const phrase of SEMANTIC_PHRASES) {
      expect(lower).toContain(phrase)
    }
  })

  it("intro is not the generic theme template", () => {
    expect(FRUITS_INTRO).not.toBe(themeCategoryIntro("Fruits"))
    expect(FRUITS_INTRO.length).toBeGreaterThan(themeCategoryIntro("Fruits").length * 3)
  })

  it("FAQ is unique to fruits and not the generic theme template", () => {
    const genericTheme = faqPlaceholderFor("THEME", {})
    expect(FRUITS_FAQ.length).toBeGreaterThanOrEqual(4)
    expect(FRUITS_FAQ).not.toEqual(genericTheme)
    expect(FRUITS_FAQ.some((item) => item.answer.toLowerCase().includes("pomme"))).toBe(true)
    expect(FRUITS_FAQ.some((item) => item.answer.toLowerCase().includes("alimentation"))).toBe(
      true,
    )
  })

  it("mock category page uses fruits intro and FAQ", () => {
    const page = mockThemeCategoryPageData("fruits")
    expect(page?.introText).toBe(FRUITS_INTRO)
    expect(page?.faqJson).toEqual(FRUITS_FAQ)
    expect(page?.metaDescription?.toLowerCase()).toContain("vocabulaire fruits")
  })
})
