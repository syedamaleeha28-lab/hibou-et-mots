import { describe, expect, it } from "vitest"
import {
  HOME_PEDAGOGICAL_APPROACH_TITLE,
  HOME_SEMANTIC_FAQ,
  HOME_SEMANTIC_LINKS,
  HOME_SYNONYM_DIFFERENCE_TITLE,
} from "@/lib/content/home"
import { HOME_FAQ } from "@/lib/content/phase1"
import { ROUTES } from "@/lib/seo/routes"

describe("homepage semantic coverage", () => {
  it("defines the two new editorial section titles", () => {
    expect(HOME_SYNONYM_DIFFERENCE_TITLE).toBe("Mots mêlés ou mots cachés : quelle différence ?")
    expect(HOME_PEDAGOGICAL_APPROACH_TITLE).toBe("Notre approche pédagogique")
  })

  it("includes the three semantic FAQ questions on HOME_FAQ", () => {
    const questions = HOME_FAQ.map((item) => item.question)
    for (const item of HOME_SEMANTIC_FAQ) {
      expect(questions).toContain(item.question)
    }
  })

  it("surfaces internal links to pedagogie, solutions and seniors hubs", () => {
    const hrefs = HOME_SEMANTIC_LINKS.map((link) => link.href)
    expect(hrefs).toContain(ROUTES.pedagogie)
    expect(hrefs).toContain(ROUTES.solutions)
    expect(hrefs).toContain(ROUTES.seniors)
  })
})
