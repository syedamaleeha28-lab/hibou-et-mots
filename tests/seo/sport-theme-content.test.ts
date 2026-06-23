import { describe, expect, it } from "vitest"
import { SPORT_FAQ, SPORT_INTRO } from "@/lib/content/themes/sport"
import { countWords, themeCategoryIntro } from "@/lib/content/phase1/intros"
import { mockThemeCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { faqPlaceholderFor } from "@/prisma/seed/faq"

const REQUIRED_ENTITIES = [
  "football",
  "basket",
  "tennis",
  "natation",
  "vélo",
  "rugby",
  "gymnastique",
  "athlétisme",
  "handball",
  "course",
] as const

const SEMANTIC_PHRASES = [
  "activité sportive",
  "vocabulaire du sport",
  "éducation physique",
] as const

describe("sport theme topical content", () => {
  it("intro is 250-350 words and includes required entities", () => {
    const words = countWords(SPORT_INTRO)
    expect(words).toBeGreaterThanOrEqual(250)
    expect(words).toBeLessThanOrEqual(350)

    const lower = SPORT_INTRO.toLowerCase()
    for (const entity of REQUIRED_ENTITIES) {
      expect(lower).toContain(entity)
    }
    for (const phrase of SEMANTIC_PHRASES) {
      expect(lower).toContain(phrase)
    }
  })

  it("intro is not the generic theme template", () => {
    expect(SPORT_INTRO).not.toBe(themeCategoryIntro("Sport"))
    expect(SPORT_INTRO.length).toBeGreaterThan(themeCategoryIntro("Sport").length * 3)
  })

  it("FAQ is unique to sport and not the generic theme template", () => {
    const genericTheme = faqPlaceholderFor("THEME", {})
    expect(SPORT_FAQ.length).toBeGreaterThanOrEqual(4)
    expect(SPORT_FAQ).not.toEqual(genericTheme)
    expect(SPORT_FAQ.some((item) => item.answer.toLowerCase().includes("football"))).toBe(true)
    expect(SPORT_FAQ.some((item) => item.question.toLowerCase().includes("éducation physique"))).toBe(
      true,
    )
  })

  it("mock category page uses sport intro and FAQ", () => {
    const page = mockThemeCategoryPageData("sport")
    expect(page?.introText).toBe(SPORT_INTRO)
    expect(page?.faqJson).toEqual(SPORT_FAQ)
    expect(page?.metaDescription?.toLowerCase()).toContain("vocabulaire du sport")
  })
})
