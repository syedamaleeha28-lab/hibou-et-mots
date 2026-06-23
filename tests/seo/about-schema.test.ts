import { describe, expect, it } from "vitest"
import { buildAboutPageSchemaGraph } from "@/lib/seo/schema/about-page"
import { DEFAULT_SITE_URL, ROUTES } from "@/lib/seo/routes"

const SITE = DEFAULT_SITE_URL

describe("about page schema", () => {
  it("includes WebPage, BreadcrumbList and Organization", () => {
    const graph = buildAboutPageSchemaGraph(SITE)
    const nodes = graph["@graph"] as Array<Record<string, unknown>>

    expect(nodes.some((node) => node["@type"] === "WebPage")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "BreadcrumbList")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "Organization")).toBe(true)
  })

  it("links WebPage to the about URL and organization", () => {
    const graph = buildAboutPageSchemaGraph(SITE)
    const nodes = graph["@graph"] as Array<Record<string, unknown>>
    const webPage = nodes.find((node) => node["@type"] === "WebPage") as Record<string, unknown>

    expect(webPage.url).toBe(`${SITE}${ROUTES.aPropos}`)
    expect((webPage.about as Record<string, string>)["@id"]).toContain("#organization")
  })
})
