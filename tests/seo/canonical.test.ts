import { describe, expect, it } from "vitest"
import {
  buildCanonicalPath,
  buildCanonicalUrl,
  normalizePath,
  stripTrackingParams,
} from "@/lib/seo/canonical"
import { resolveSiteOrigin } from "@/lib/seo/routes"
import { isWwwHost, needsTrailingSlash, toApexUrl } from "@/lib/seo/host"

describe("canonical", () => {
  it("normalizes trailing slashes", () => {
    expect(normalizePath("mots-meles-ecole")).toBe("/mots-meles-ecole/")
    expect(normalizePath("/")).toBe("/")
    expect(normalizePath("https://www.hibou-et-mots.com/mots-meles-adultes")).toBe(
      "/mots-meles-adultes/",
    )
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

  it("forces apex host and trailing slash on canonical URLs", () => {
    expect(
      buildCanonicalUrl({
        path: "/mots-meles-adultes",
        siteUrl: "https://www.hibou-et-mots.com",
      }),
    ).toBe("https://hibou-et-mots.com/mots-meles-adultes/")
  })

  it("strips utm tracking params", () => {
    const url = new URL("https://example.test/page/?utm_source=x&page=2")
    const cleaned = stripTrackingParams(url)
    expect(cleaned.searchParams.has("utm_source")).toBe(false)
    expect(cleaned.searchParams.get("page")).toBe("2")
  })
})

describe("site origin", () => {
  it("strips www and forces https", () => {
    expect(resolveSiteOrigin("http://www.hibou-et-mots.com/")).toBe(
      "https://hibou-et-mots.com",
    )
    expect(resolveSiteOrigin("hibou-et-mots.com")).toBe("https://hibou-et-mots.com")
  })
})

describe("www host redirect helpers", () => {
  it("detects www hosts", () => {
    expect(isWwwHost("www.hibou-et-mots.com")).toBe(true)
    expect(isWwwHost("hibou-et-mots.com")).toBe(false)
  })

  it("adds trailing slash when redirecting www → apex", () => {
    const apex = toApexUrl(new URL("https://www.hibou-et-mots.com/mots-meles-adultes"))
    expect(apex.toString()).toBe("https://hibou-et-mots.com/mots-meles-adultes/")
    expect(needsTrailingSlash("/sitemap.xml")).toBe(false)
  })
})
