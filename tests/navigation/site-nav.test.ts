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

  it("defines mega menus: Imprimer, École, Plus, 🇧🇷 Português", () => {
    expect(headerMegaMenus.map((m) => m.label)).toEqual([
      "Imprimer",
      "École",
      "Plus",
      "🇧🇷 Português",
    ])
  })

  it("includes imprimer sections for theme, grade, difficulty, word games, and number games", () => {
    const imprimer = headerMegaMenus[0]!
    const titles = imprimer.sections.map((s) => s.title)
    expect(titles).toContain("Par thème")
    expect(titles).toContain("Par niveau")
    expect(titles).toContain("Par difficulté")
    expect(titles).toContain("Autres jeux de mots")
    expect(titles).toContain("Jeux de chiffres")
    const autres = imprimer.sections.find((s) => s.title === "Autres jeux de mots")!
    expect(autres.links.map((l) => l.href)).toEqual([
      "/mots-croises-a-imprimer/",
      "/mini-mots-croises/",
      "/mots-coupes-a-imprimer/",
      "/mots-coupes/",
    ])
    const chiffres = imprimer.sections.find((s) => s.title === "Jeux de chiffres")!
    expect(chiffres.links.map((l) => l.href)).toEqual([
      "/sudoku-a-imprimer/",
      "/sudoku/",
    ])
  })

  it("covers all 8 PT-BR category pages in the Português mega menu", () => {
    const pt = headerMegaMenus.find((m) => m.id === "portugues")!
    expect(pt.featured?.map((l) => l.href)).toEqual(["/caca-palavras-para-imprimir/"])
    const hrefs = [
      ...(pt.featured ?? []).map((l) => l.href),
      ...pt.sections.flatMap((s) => s.links.map((l) => l.href)),
    ]
    expect(hrefs).toEqual([
      "/caca-palavras-para-imprimir/",
      "/caca-palavras-nivel/",
      "/caca-palavras-nivel/facil/",
      "/caca-palavras-nivel/medio/",
      "/caca-palavras-nivel/dificil/",
      "/caca-palavras-tematicos/",
      "/caca-palavras-tematicos/animais/",
      "/caca-palavras-tematicos/esporte/",
    ])
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

  it("maps footer to silo columns plus legal, including Português", () => {
    expect(footerSiloColumns).toHaveLength(9)
    expect(footerSiloColumns[0]?.title).toBe("Hub principal")
    expect(footerSiloColumns.map((c) => c.title)).toContain("Autres jeux de mots")
    expect(footerSiloColumns.map((c) => c.title)).toContain("Jeux de chiffres")
    const chiffres = footerSiloColumns.find((c) => c.title === "Jeux de chiffres")!
    expect(chiffres.links.map((l) => l.href)).toEqual(["/sudoku-a-imprimer/"])
    expect(footerSiloColumns.at(-1)?.title).toBe("🇧🇷 Português")
    expect(footerSiloColumns.at(-1)?.links.map((l) => l.href)).toEqual([
      "/caca-palavras-para-imprimir/",
      "/caca-palavras-nivel/",
      "/caca-palavras-tematicos/",
    ])
  })
})
