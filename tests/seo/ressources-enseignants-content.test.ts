import { describe, expect, it } from "vitest"
import {
  RESSOURCES_CLASSROOM_ACTIVITIES,
  RESSOURCES_COMBO_LINKS,
  RESSOURCES_GRADE_CARDS,
  RESSOURCES_PEDAGOGIE_CROSS_LINK,
  RESSOURCES_PRINTABLE_ROWS,
  RESSOURCES_TEACHER_LINKS,
  RESSOURCES_THEME_CARDS,
  ressourcesEnseignantsEditorialPlainText,
} from "@/lib/content/ressources-enseignants"
import { countWords } from "@/lib/content/phase1/intros"
import {
  detectEducationalEntities,
  MIN_ENTITIES_HUB_PAGES,
} from "@/lib/seo/educational-entities"
import { ROUTES, gradePath } from "@/lib/seo/routes"

const REQUIRED_GRADES = [
  "maternelle",
  "cp",
  "ce1",
  "ce2",
  "cm1",
  "cm2",
  "6e",
] as const

describe("ressources enseignants editorial content", () => {
  it("editorial copy exceeds 800 words", () => {
    const words = countWords(ressourcesEnseignantsEditorialPlainText())
    expect(words).toBeGreaterThanOrEqual(800)
  })

  it("covers required educational entity terms for hub pages", () => {
    const present = detectEducationalEntities(ressourcesEnseignantsEditorialPlainText())
    expect(present.length).toBeGreaterThanOrEqual(MIN_ENTITIES_HUB_PAGES)
    expect(present).toContain("education-nationale")
    expect(present).toContain("vocabulaire-scolaire")
    expect(present).toContain("apprentissage-lecture")
    expect(present).toContain("comprehension-ecrite")
  })

  it("defines grade cards for maternelle through 6e", () => {
    expect(RESSOURCES_GRADE_CARDS.map((card) => card.slug)).toEqual([...REQUIRED_GRADES])
  })

  it("groups theme cards into programme and seasonal picks", () => {
    const programme = RESSOURCES_THEME_CARDS.filter((card) => card.group === "programme")
    const saison = RESSOURCES_THEME_CARDS.filter((card) => card.group === "saison")
    expect(programme.length).toBeGreaterThanOrEqual(5)
    expect(saison.length).toBeGreaterThanOrEqual(4)
  })

  it("lists printable resource entry points", () => {
    const hrefs = RESSOURCES_PRINTABLE_ROWS.map((row) => row.href)
    expect(hrefs).toContain(ROUTES.imprimer)
    expect(hrefs).toContain(ROUTES.generateur)
    expect(hrefs).toContain(gradePath("cp"))
  })

  it("defines classroom activity recipes", () => {
    expect(RESSOURCES_CLASSROOM_ACTIVITIES.length).toBeGreaterThanOrEqual(4)
    expect(RESSOURCES_CLASSROOM_ACTIVITIES.every((activity) => activity.steps.length >= 3)).toBe(
      true,
    )
  })

  it("links prominently to the pedagogie guide", () => {
    expect(RESSOURCES_PEDAGOGIE_CROSS_LINK.href).toBe(ROUTES.pedagogie)
    expect(RESSOURCES_TEACHER_LINKS.map((link) => link.href)).toContain(ROUTES.pedagogie)
  })

  it("includes teacher-focused internal links", () => {
    const hrefs = RESSOURCES_TEACHER_LINKS.map((link) => link.href)
    expect(hrefs).toContain(ROUTES.ecoleHub)
    expect(hrefs).toContain(ROUTES.imprimer)
    expect(hrefs).toContain(ROUTES.generateur)
    expect(hrefs).toContain(gradePath("ce1"))
  })

  it("provides niveau × thème combo links", () => {
    expect(RESSOURCES_COMBO_LINKS.length).toBeGreaterThanOrEqual(2)
  })
})
