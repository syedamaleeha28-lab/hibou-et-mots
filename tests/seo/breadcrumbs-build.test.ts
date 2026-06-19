import { describe, expect, it } from "vitest"
import { buildCategoryBreadcrumbs, buildPuzzleBreadcrumbs } from "@/lib/seo/breadcrumbs"
import { gradePath, ROUTES } from "@/lib/seo/routes"

describe("buildCategoryBreadcrumbs", () => {
  it("builds grade trail", () => {
    const trail = buildCategoryBreadcrumbs({
      type: "GRADE",
      h1: "Mots mêlés CE1",
      canonicalPath: gradePath("ce1"),
      grade: { slug: "ce1", name: "CE1" },
    })

    expect(trail.map((item) => item.label)).toEqual(["Accueil", "École", "CE1"])
  })

  it("builds combo trail", () => {
    const trail = buildCategoryBreadcrumbs({
      type: "COMBO",
      h1: "CE1 Noël",
      canonicalPath: "/mots-meles-ecole/ce1/noel/",
      grade: { slug: "ce1", name: "CE1" },
      theme: { slug: "noel", name: "Noël" },
    })

    expect(trail.map((item) => item.label)).toEqual(["Accueil", "École", "CE1", "Noël"])
  })
})

describe("buildPuzzleBreadcrumbs", () => {
  it("appends puzzle title after category trail", () => {
    const trail = buildPuzzleBreadcrumbs(
      { title: "Sapin et Cadeaux", canonicalPath: "/mots-meles/noel-ce1-facile-01/" },
      [
        { id: "1", type: "COMBO", slug: "ce1-noel", label: "CE1 Noël", href: "/mots-meles-ecole/ce1/noel/" },
        { id: "2", type: "GRADE", slug: "ce1", label: "CE1", href: gradePath("ce1") },
        { id: "3", type: "SEASONAL", slug: "noel", label: "Noël", href: "/mots-meles-fetes-saisons/noel/" },
      ],
    )

    expect(trail.map((item) => item.label)).toEqual([
      "Accueil",
      "École",
      "CE1",
      "Noël",
      "Sapin et Cadeaux",
    ])
  })

  it("falls back to home when no parents", () => {
    const trail = buildPuzzleBreadcrumbs({
      title: "Grille libre",
      canonicalPath: "/mots-meles/grille-libre/",
    })

    expect(trail[0]?.label).toBe("Accueil")
    expect(trail.at(-1)?.label).toBe("Grille libre")
  })
})
