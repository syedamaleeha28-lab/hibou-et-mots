import { describe, expect, it } from "vitest"
import {
  buildBreadcrumbListSchema,
  buildCategoryBreadcrumbs,
  buildPuzzleBreadcrumbs,
} from "@/lib/seo/breadcrumbs"
import { buildCategoryPageSchemaGraph } from "@/lib/seo/schema/page-schemas"
import { gradePath, ROUTES } from "@/lib/seo/routes"
import { mockHubCategoryPageData } from "@/lib/db/adapters/mock-categories"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"

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

  it("builds flat trail for top-level hub pages without silo parent", () => {
    const gratuits = buildCategoryBreadcrumbs({
      type: "AUDIENCE",
      isHub: true,
      h1: "Mots Mêlés Gratuits : Jouez en Ligne ou Imprimez",
      canonicalPath: ROUTES.gratuits,
    })

    expect(gratuits.map((item) => item.label)).toEqual([
      "Accueil",
      "Mots Mêlés Gratuits : Jouez en Ligne ou Imprimez",
    ])
    expect(gratuits.some((item) => item.label === "École")).toBe(false)

    const imprimer = buildCategoryBreadcrumbs({
      type: "AUDIENCE",
      isHub: true,
      h1: "Mots mêlés à imprimer — PDF gratuits",
      canonicalPath: ROUTES.imprimer,
    })

    expect(imprimer.some((item) => item.label === "École")).toBe(false)
  })

  it("builds flat trail for silo hub pages", () => {
    const ecole = buildCategoryBreadcrumbs({
      type: "GRADE",
      isHub: true,
      h1: "Mots mêlés École — Grilles par niveau scolaire",
      canonicalPath: ROUTES.ecoleHub,
    })

    expect(ecole.map((item) => item.label)).toEqual([
      "Accueil",
      "Mots mêlés École — Grilles par niveau scolaire",
    ])
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

describe("hub category breadcrumbs and schema", () => {
  it("excludes École from gratuits hub mock page", () => {
    const page = mockHubCategoryPageData(HUB_CATEGORY_SLUGS.gratuits)

    expect(page.breadcrumbs.map((item) => item.label)).toEqual([
      "Accueil",
      "Mots Mêlés Gratuits : Jouez en Ligne ou Imprimez",
    ])
    expect(page.breadcrumbs.some((item) => item.label === "École")).toBe(false)
  })

  it("mirrors UI breadcrumbs in BreadcrumbList schema", () => {
    const page = mockHubCategoryPageData(HUB_CATEGORY_SLUGS.gratuits)
    const schema = buildCategoryPageSchemaGraph(page)
    const breadcrumbNode = (schema["@graph"] as Array<Record<string, unknown>>).find(
      (node) => node["@type"] === "BreadcrumbList",
    )

    expect(breadcrumbNode).toBeDefined()
    expect(
      (breadcrumbNode?.itemListElement as Array<{ name: string }>).map((item) => item.name),
    ).toEqual(["Accueil", "Mots Mêlés Gratuits : Jouez en Ligne ou Imprimez"])

    const listSchema = buildBreadcrumbListSchema(page.breadcrumbs)
    expect(listSchema.itemListElement).toHaveLength(2)
    expect(listSchema.itemListElement[0]?.name).toBe("Accueil")
    expect(listSchema.itemListElement[1]?.name).toBe(
      "Mots Mêlés Gratuits : Jouez en Ligne ou Imprimez",
    )
  })
})
