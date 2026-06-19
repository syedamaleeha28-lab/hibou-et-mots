import { describe, expect, it } from "vitest"
import {
  buildBreadcrumbListSchema,
  gradePath,
  ROUTES,
  withHome,
} from "@/lib/seo"

describe("breadcrumbs", () => {
  it("builds BreadcrumbList schema with absolute URLs", () => {
    const items = withHome([
      { label: "École", href: ROUTES.ecoleHub },
      { label: "CE1", href: gradePath("ce1") },
    ])

    const schema = buildBreadcrumbListSchema(items, "https://example.test")

    expect(schema["@type"]).toBe("BreadcrumbList")
    expect(schema.itemListElement).toHaveLength(3)
    expect(schema.itemListElement[0]?.name).toBe("Accueil")
    expect(schema.itemListElement[0]?.item).toBe("https://example.test/")
    expect(schema.itemListElement[2]?.item).toBe("https://example.test/mots-meles-ecole/ce1/")
  })

  it("withHome prepends Accueil when missing", () => {
    const items = withHome([{ label: "Thématiques", href: ROUTES.thematiquesHub }])
    expect(items[0]?.label).toBe("Accueil")
    expect(items[1]?.label).toBe("Thématiques")
  })

  it("withHome does not duplicate Accueil", () => {
    const items = withHome([{ label: "Accueil", href: "/" }])
    expect(items).toHaveLength(1)
  })
})

describe("routes", () => {
  it("builds grade and theme paths", () => {
    expect(gradePath("ce1")).toBe("/mots-meles-ecole/ce1/")
    expect(ROUTES.thematiquesHub).toMatch(/\/$/)
  })
})
