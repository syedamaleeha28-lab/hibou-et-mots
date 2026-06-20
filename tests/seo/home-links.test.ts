import { describe, expect, it } from "vitest"
import { featuredThemeCategories } from "@/lib/home/featured-themes"
import { themePath } from "@/lib/seo/routes"

describe("homepage featured categories", () => {
  it("links to real category routes instead of mock anchors", () => {
    for (const category of featuredThemeCategories) {
      expect(category.href.startsWith("/")).toBe(true)
      expect(category.href.endsWith("/")).toBe(true)
      expect(category.href.includes("#")).toBe(false)
    }

    expect(featuredThemeCategories.some((entry) => entry.href === themePath("animaux"))).toBe(
      true,
    )
  })
})
