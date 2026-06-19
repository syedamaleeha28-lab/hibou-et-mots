import { describe, expect, it } from "vitest"
import {
  resolveCategoryPath,
  gradePath,
  comboPath,
  ROUTES,
} from "@/lib/seo/routes"

describe("resolveCategoryPath", () => {
  it("resolves grade leaf paths", () => {
    expect(
      resolveCategoryPath({
        type: "GRADE",
        slug: "ce1",
        grade: { slug: "ce1" },
      }),
    ).toBe(gradePath("ce1"))
  })

  it("resolves combo paths", () => {
    expect(
      resolveCategoryPath({
        type: "COMBO",
        slug: "ce1-noel",
        grade: { slug: "ce1" },
        theme: { slug: "noel" },
      }),
    ).toBe(comboPath("ce1", "noel"))
  })

  it("resolves hub slugs", () => {
    expect(resolveCategoryPath({ type: "GRADE", slug: "hub-ecole" })).toBe(
      ROUTES.ecoleHub,
    )
  })

  it("resolves audience paths", () => {
    expect(resolveCategoryPath({ type: "AUDIENCE", slug: "enfants" })).toBe(
      ROUTES.enfants,
    )
  })
})
