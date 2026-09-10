import { describe, expect, it } from "vitest"
import { getCategoryChrome } from "@/lib/content/category-chrome"

describe("category chrome overrides", () => {
  it("returns print-focused grid and how-to copy for hub-imprimer", () => {
    const chrome = getCategoryChrome("hub-imprimer")
    expect(chrome.gridHeading).toBe("Mots mêlés à imprimer en PDF")
    expect(chrome.howToPlay?.title).toBe("Comment télécharger et imprimer une grille")
    expect(chrome.howToPlay?.steps).toHaveLength(3)
    expect(chrome.howToPlay?.steps?.map((step) => step.text)).toEqual([
      "Choisissez une grille dans le catalogue ci-dessous.",
      "Cliquez sur « Télécharger le PDF » depuis la page du puzzle.",
      "Imprimez en format A4 — la grille sur la première page, le corrigé sur la seconde.",
    ])
  })

  it("leaves hubs without an entry on the generic chrome", () => {
    expect(getCategoryChrome("hub-gratuits")).toEqual({})
    expect(getCategoryChrome("enfants")).toEqual({})
  })
})
