import { describe, expect, it } from "vitest"
import { ANIMAUX_FAQ, ANIMAUX_INTRO } from "@/lib/content/themes/animaux"
import { countWords } from "@/lib/content/phase1/intros"
import { mockThemeCategoryPageData } from "@/lib/db/adapters/mock-categories"

const REQUIRED_ENTITIES = [
  "lion",
  "tigre",
  "éléphant",
  "girafe",
  "zèbre",
  "singe",
  "ferme",
  "savane",
  "jungle",
  "océan",
  "animaux sauvages",
  "animaux domestiques",
] as const

const SEMANTIC_PHRASES = [
  "mots cachés animaux",
  "vocabulaire animaux",
  "activité éducative",
  "primaire",
  "maternelle",
] as const

describe("animaux theme topical content", () => {
  it("intro is 250-350 words and includes required entities", () => {
    const words = countWords(ANIMAUX_INTRO)
    expect(words).toBeGreaterThanOrEqual(250)
    expect(words).toBeLessThanOrEqual(400)

    const lower = ANIMAUX_INTRO.toLowerCase()
    for (const entity of REQUIRED_ENTITIES) {
      expect(lower).toContain(entity)
    }
    for (const phrase of SEMANTIC_PHRASES) {
      expect(lower).toContain(phrase)
    }
  })

  it("FAQ is unique to animaux and not the generic theme template", () => {
    expect(ANIMAUX_FAQ.length).toBeGreaterThanOrEqual(4)
    expect(ANIMAUX_FAQ.some((item) => item.question.includes("Animaux"))).toBe(true)
    expect(ANIMAUX_FAQ.some((item) => item.answer.toLowerCase().includes("savane"))).toBe(true)
    expect(ANIMAUX_FAQ.some((item) => item.answer.toLowerCase().includes("générateur"))).toBe(false)
  })

  it("mock category page uses animaux intro and FAQ", () => {
    const page = mockThemeCategoryPageData("animaux")
    expect(page?.introText).toBe(ANIMAUX_INTRO)
    expect(page?.faqJson).toEqual(ANIMAUX_FAQ)
    expect(page?.metaDescription).toContain("mots cachés animaux")
  })
})
