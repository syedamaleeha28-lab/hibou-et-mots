import { describe, expect, it } from "vitest"
import {
  PEDAGOGIE_EDUCATIONAL_LINKS,
  PEDAGOGIE_FAQ,
  PEDAGOGIE_GRADE_ROWS,
  PEDAGOGIE_INTRO,
  PEDAGOGIE_SECTIONS,
  pedagogieEditorialPlainText,
} from "@/lib/content/pedagogie"
import { countWords } from "@/lib/content/phase1/intros"
import { mockStaticSupportCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { ROUTES, gradePath } from "@/lib/seo/routes"

const REQUIRED_TOPICS = [
  "bienfaits",
  "vocabulaire",
  "lecture",
  "orthographe",
  "concentration",
  "repérage visuel",
  "classe",
  "maison",
] as const

const REQUIRED_GRADES = ["cp", "ce1", "ce2", "cm1", "cm2"] as const

describe("pedagogie authority hub", () => {
  it("editorial copy exceeds 1200 words and covers required topics", () => {
    const words = countWords(pedagogieEditorialPlainText())
    expect(words).toBeGreaterThanOrEqual(1200)

    const lower = pedagogieEditorialPlainText().toLowerCase()
    for (const topic of REQUIRED_TOPICS) {
      expect(lower).toContain(topic)
    }
  })

  it("defines eight pedagogical sections", () => {
    expect(PEDAGOGIE_SECTIONS).toHaveLength(8)
    expect(PEDAGOGIE_SECTIONS.map((section) => section.id)).toEqual([
      "bienfaits",
      "vocabulaire",
      "lecture",
      "orthographe",
      "concentration",
      "repérage-visuel",
      "classe",
      "maison",
    ])
  })

  it("links to all primary educational sections including CP through CM2", () => {
    const hrefs = PEDAGOGIE_EDUCATIONAL_LINKS.map((link) => link.href)

    expect(hrefs).toContain(ROUTES.ecoleHub)
    expect(hrefs).toContain(ROUTES.enfants)
    expect(hrefs).toContain(ROUTES.ressources)

    for (const grade of REQUIRED_GRADES) {
      expect(hrefs).toContain(gradePath(grade))
    }
  })

  it("grade table includes CP, CE1, CE2, CM1 and CM2", () => {
    expect(PEDAGOGIE_GRADE_ROWS.map((row) => row.slug)).toEqual([...REQUIRED_GRADES])
  })

  it("mock category page uses pedagogie intro and expanded FAQ", () => {
    const page = mockStaticSupportCategoryPageData(ROUTES.pedagogie)
    expect(page?.introText).toBe(PEDAGOGIE_INTRO)
    expect(page?.faqJson).toEqual(PEDAGOGIE_FAQ)
    expect(page?.canonicalPath).toBe("/mots-meles-pedagogie/")
    expect(page?.metaDescription).toContain("vocabulaire")
  })
})
