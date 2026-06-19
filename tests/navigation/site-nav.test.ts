import { describe, expect, it } from "vitest"
import {
  footerSiloColumns,
  headerMegaMenus,
  mobileBottomTabs,
} from "@/lib/navigation"
import { ROUTES, gradePath, themePath } from "@/lib/seo"

describe("site navigation", () => {
  it("uses trailing slashes on public routes except home", () => {
    const hrefs = [
      ROUTES.gratuits,
      ROUTES.imprimer,
      ROUTES.jouer,
      ROUTES.ecoleHub,
      gradePath("ce1"),
      themePath("animaux"),
    ]
    for (const href of hrefs) {
      expect(href.endsWith("/")).toBe(true)
    }
    expect(ROUTES.home).toBe("/")
  })

  it("defines PRD mega menus: Imprimer, École, Plus", () => {
    expect(headerMegaMenus.map((m) => m.label)).toEqual(["Imprimer", "École", "Plus"])
  })

  it("includes imprimer sections for theme, grade, and difficulty", () => {
    const imprimer = headerMegaMenus[0]!
    const titles = imprimer.sections.map((s) => s.title)
    expect(titles).toContain("Par thème")
    expect(titles).toContain("Par niveau")
    expect(titles).toContain("Par difficulté")
  })

  it("defines five mobile bottom tabs per PRD", () => {
    expect(mobileBottomTabs).toHaveLength(5)
    expect(mobileBottomTabs.map((t) => t.label)).toEqual([
      "Accueil",
      "Imprimer",
      "Jouer",
      "Créer",
      "Recherche",
    ])
  })

  it("maps footer to six silo columns plus legal", () => {
    expect(footerSiloColumns).toHaveLength(6)
    expect(footerSiloColumns[0]?.title).toBe("Hub principal")
  })
})
