import { describe, expect, it } from "vitest"
import { ecoleCyclePlainText } from "@/lib/content/educational-entities"
import {
  buildEducationalEntityReport,
  detectEducationalEntities,
  EDUCATIONAL_ENTITIES,
  MIN_ENTITIES_GRADE_PAGES,
  MIN_ENTITIES_HUB_PAGES,
} from "@/lib/seo/educational-entities"
import { ROUTES } from "@/lib/seo/routes"

describe("educational entity coverage", () => {
  it("ecole cycle copy references all three cycles and core skills", () => {
    const present = detectEducationalEntities(ecoleCyclePlainText())
    expect(present).toContain("cycle-1")
    expect(present).toContain("cycle-2")
    expect(present).toContain("cycle-3")
    expect(present).toContain("education-nationale")
    expect(present).toContain("vocabulaire-scolaire")
    expect(present).toContain("apprentissage-lecture")
    expect(present).toContain("comprehension-ecrite")
  })

  it("covers all seven entities across the educational corpus", async () => {
    const report = await buildEducationalEntityReport()
    expect(report.corpusMissingEntities).toEqual([])
    expect(report.pagesWithWeakCoverage).toEqual([])

    for (const term of EDUCATIONAL_ENTITIES) {
      expect(report.entityTotals[term.id]).toBeGreaterThan(0)
    }
  })

  it("meets thresholds on pedagogie and grade hubs", async () => {
    const report = await buildEducationalEntityReport()

    const pedagogie = report.pages.find((page) => page.path === ROUTES.pedagogie)
    expect(pedagogie?.entityCount).toBeGreaterThanOrEqual(MIN_ENTITIES_HUB_PAGES)

    const ecole = report.pages.find((page) => page.path === ROUTES.ecoleHub)
    expect(ecole?.entityCount).toBeGreaterThanOrEqual(MIN_ENTITIES_HUB_PAGES)

    const cp = report.pages.find((page) => page.slug === "cp")
    expect(cp?.entityCount).toBeGreaterThanOrEqual(MIN_ENTITIES_GRADE_PAGES)
  })
})
