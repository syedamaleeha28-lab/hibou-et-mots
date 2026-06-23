import { describe, expect, it } from "vitest"
import {
  ADULTES_FAQ,
  ADULTES_HUB_LINKS,
  ADULTES_INTRO,
  ADULTES_SECTIONS,
  adultesEditorialPlainText,
} from "@/lib/content/adultes"
import { countWords } from "@/lib/content/phase1/intros"
import { mockAudienceCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { ROUTES, difficultyPath } from "@/lib/seo/routes"

const REQUIRED_TOPICS = [
  "détente",
  "vocabulaire",
  "culture générale",
  "loisir",
  "difficile",
  "géant",
] as const

describe("adultes authority hub", () => {
  it("editorial copy exceeds 800 words and covers required topics", () => {
    const words = countWords(adultesEditorialPlainText())
    expect(words).toBeGreaterThanOrEqual(800)

    const lower = adultesEditorialPlainText().toLowerCase()
    for (const topic of REQUIRED_TOPICS) {
      expect(lower).toContain(topic)
    }
  })

  it("defines six editorial sections for adults", () => {
    expect(ADULTES_SECTIONS).toHaveLength(6)
    expect(ADULTES_SECTIONS.map((section) => section.id)).toEqual([
      "detente",
      "vocabulaire",
      "culture-generale",
      "loisir",
      "difficile",
      "geant",
    ])
  })

  it("includes expanded FAQ with at least five entries", () => {
    expect(ADULTES_FAQ.length).toBeGreaterThanOrEqual(5)
    expect(ADULTES_FAQ.every((item) => item.answer.toLowerCase().includes("adultes"))).toBe(true)
  })

  it("links to difficulty levels, tools, and related audiences", () => {
    const hrefs = ADULTES_HUB_LINKS.map((link) => link.href)

    expect(hrefs).toContain(ROUTES.imprimer)
    expect(hrefs).toContain(ROUTES.jouer)
    expect(hrefs).toContain(ROUTES.generateur)
    expect(hrefs).toContain(ROUTES.seniors)
    expect(hrefs).toContain(ROUTES.difficulteHub)
    expect(hrefs).toContain(difficultyPath("difficile"))
    expect(hrefs).toContain(difficultyPath("geant"))
    expect(hrefs).toContain(ROUTES.thematiquesHub)
    expect(hrefs).toContain(ROUTES.presseHub)
  })

  it("mock audience page uses adultes intro and expanded FAQ", () => {
    const page = mockAudienceCategoryPageData("adultes")
    expect(page?.introText).toBe(ADULTES_INTRO)
    expect(page?.faqJson).toEqual(ADULTES_FAQ)
    expect(page?.canonicalPath).toBe("/mots-meles-adultes/")
    expect(page?.metaDescription).toContain("vocabulaire")
  })
})
