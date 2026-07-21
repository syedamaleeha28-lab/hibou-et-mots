import { describe, expect, it } from "vitest"
import {
  absoluteUrl,
  DEFAULT_SITE_URL,
  resolveCategoryPath,
  gradePath,
  comboPath,
  ROUTES,
} from "@/lib/seo/routes"

describe("DEFAULT_SITE_URL", () => {
  it("uses the production .com domain as fallback", () => {
    expect(DEFAULT_SITE_URL).toBe("https://hibou-et-mots.com")
    expect(absoluteUrl("/")).toBe(`${DEFAULT_SITE_URL}/`)
  })
})

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

  it("routes seasonal themes to fetes-saisons even if typed as THEME", () => {
    expect(
      resolveCategoryPath({
        type: "THEME",
        slug: "noel",
        theme: { slug: "noel" },
      }),
    ).toBe("/mots-meles-fetes-saisons/noel/")
  })
})
