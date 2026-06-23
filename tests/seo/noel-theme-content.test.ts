import { describe, expect, it } from "vitest"
import { NOEL_FAQ, NOEL_INTRO } from "@/lib/content/themes/noel"
import { seasonalCategoryIntro } from "@/lib/content/phase1/intros"
import { countWords } from "@/lib/content/phase1/intros"
import { mockSeasonalCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { faqPlaceholderFor } from "@/prisma/seed/faq"

const REQUIRED_ENTITIES = [
  "père noël",
  "renne",
  "traîneau",
  "sapin",
  "cadeaux",
  "lutins",
  "guirlande",
  "bonhomme de neige",
  "calendrier de l'avent",
  "réveillon",
] as const

const SEMANTIC_PHRASES = [
  "mots cachés noël",
  "activité de noël",
  "vacances scolaires",
  "vocabulaire de noël",
] as const

describe("noel theme topical content", () => {
  it("intro is 250-350 words and includes required entities", () => {
    const words = countWords(NOEL_INTRO)
    expect(words).toBeGreaterThanOrEqual(250)
    expect(words).toBeLessThanOrEqual(400)

    const lower = NOEL_INTRO.toLowerCase()
    for (const entity of REQUIRED_ENTITIES) {
      expect(lower).toContain(entity)
    }
    for (const phrase of SEMANTIC_PHRASES) {
      expect(lower).toContain(phrase)
    }
  })

  it("intro is not the generic seasonal template", () => {
    expect(NOEL_INTRO).not.toBe(seasonalCategoryIntro("Noël"))
    expect(NOEL_INTRO.length).toBeGreaterThan(seasonalCategoryIntro("Noël").length * 3)
  })

  it("FAQ is unique to noel and not the generic seasonal template", () => {
    const genericSeasonal = faqPlaceholderFor("SEASONAL", { isSeasonal: true })
    expect(NOEL_FAQ.length).toBeGreaterThanOrEqual(4)
    expect(NOEL_FAQ).not.toEqual(genericSeasonal)
    expect(NOEL_FAQ.some((item) => item.answer.toLowerCase().includes("père noël"))).toBe(true)
    expect(NOEL_FAQ.some((item) => item.answer.toLowerCase().includes("vacances scolaires"))).toBe(
      true,
    )
  })

  it("mock seasonal page uses noel intro and FAQ", () => {
    const page = mockSeasonalCategoryPageData("noel")
    expect(page?.introText).toBe(NOEL_INTRO)
    expect(page?.faqJson).toEqual(NOEL_FAQ)
    expect(page?.metaDescription).toContain("mots cachés Noël")
  })
})
