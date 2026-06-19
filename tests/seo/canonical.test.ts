import { describe, expect, it } from "vitest"
import {
  buildCanonicalPath,
  buildCanonicalUrl,
  normalizePath,
  stripTrackingParams,
} from "@/lib/seo/canonical"

describe("canonical", () => {
  it("normalizes trailing slashes", () => {
    expect(normalizePath("mots-meles-ecole")).toBe("/mots-meles-ecole/")
    expect(normalizePath("/")).toBe("/")
  })

  it("builds paginated canonical paths", () => {
    expect(buildCanonicalPath({ path: "/mots-meles-ecole/", page: 2 })).toBe(
      "/mots-meles-ecole/?page=2",
    )
  })

  it("respects canonical override", () => {
    expect(
      buildCanonicalUrl({
        path: "/mots-meles-ecole/",
        override: "/custom-path/",
        siteUrl: "https://example.test",
      }),
    ).toBe("https://example.test/custom-path/")
  })

  it("strips utm tracking params", () => {
    const url = new URL("https://example.test/page/?utm_source=x&page=2")
    const cleaned = stripTrackingParams(url)
    expect(cleaned.searchParams.has("utm_source")).toBe(false)
    expect(cleaned.searchParams.get("page")).toBe("2")
  })
})
