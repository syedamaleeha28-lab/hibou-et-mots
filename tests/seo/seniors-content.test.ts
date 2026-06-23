import { describe, expect, it } from "vitest"
import {
  SENIORS_FAQ,
  SENIORS_HUB_LINKS,
  SENIORS_INTRO,
  SENIORS_SECTIONS,
  seniorsEditorialPlainText,
} from "@/lib/content/seniors"
import { countWords } from "@/lib/content/phase1/intros"
import { mockAudienceCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { ROUTES, difficultyPath } from "@/lib/seo/routes"

const REQUIRED_TOPICS = [
  "grand format",
  "mémoire",
  "stimulation cognitive",
  "retraite",
  "ehpad",
  "confort visuel",
  "imprim",
] as const

describe("seniors authority hub", () => {
  it("editorial copy exceeds 800 words and covers required topics", () => {
    const words = countWords(seniorsEditorialPlainText())
    expect(words).toBeGreaterThanOrEqual(800)

    const lower = seniorsEditorialPlainText().toLowerCase()
    for (const topic of REQUIRED_TOPICS) {
      expect(lower).toContain(topic)
    }
  })

  it("defines six editorial sections for seniors", () => {
    expect(SENIORS_SECTIONS).toHaveLength(6)
    expect(SENIORS_SECTIONS.map((section) => section.id)).toEqual([
      "grand-format",
      "memoire",
      "stimulation-cognitive",
      "retraite",
      "ehpad",
      "imprimables",
    ])
  })

  it("includes expanded FAQ with at least five entries", () => {
    expect(SENIORS_FAQ.length).toBeGreaterThanOrEqual(5)
    expect(SENIORS_FAQ.every((item) => item.answer.toLowerCase().includes("seniors"))).toBe(true)
  })

  it("links to printable, online, and difficulty hubs", () => {
    const hrefs = SENIORS_HUB_LINKS.map((link) => link.href)

    expect(hrefs).toContain(ROUTES.imprimer)
    expect(hrefs).toContain(ROUTES.jouer)
    expect(hrefs).toContain(ROUTES.generateur)
    expect(hrefs).toContain(ROUTES.adultes)
    expect(hrefs).toContain(ROUTES.difficulteHub)
    expect(hrefs).toContain(difficultyPath("facile"))
    expect(hrefs).toContain(ROUTES.thematiquesHub)
  })

  it("mock audience page uses seniors intro and expanded FAQ", () => {
    const page = mockAudienceCategoryPageData("seniors")
    expect(page?.introText).toBe(SENIORS_INTRO)
    expect(page?.faqJson).toEqual(SENIORS_FAQ)
    expect(page?.canonicalPath).toBe("/mots-meles-seniors/")
    expect(page?.metaDescription).toContain("grand format")
  })
})
