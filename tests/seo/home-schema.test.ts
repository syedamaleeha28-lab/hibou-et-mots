import { describe, expect, it } from "vitest"
import {
  buildHomePageSchemaGraph,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/schema/home"
import { DEFAULT_SITE_URL, ROUTES } from "@/lib/seo/routes"

const SITE = DEFAULT_SITE_URL

describe("home schema", () => {
  it("builds WebSite with SearchAction", () => {
    const website = buildWebSiteSchema(SITE) as Record<string, unknown>
    const action = website.potentialAction as Record<string, unknown>

    expect(website["@type"]).toBe("WebSite")
    expect(website.name).toBe("Hibou&Mots")
    expect(action["@type"]).toBe("SearchAction")
    expect(String((action.target as Record<string, string>).urlTemplate)).toContain(
      `${ROUTES.recherche}?q=`,
    )
  })

  it("builds Organization with logo", () => {
    const organization = buildOrganizationSchema(SITE) as Record<string, unknown>

    expect(organization["@type"]).toBe("Organization")
    expect(organization.logo).toBe(`${SITE}/icon.svg`)
  })

  it("composes homepage @graph with website, organization, popular puzzles and FAQ", () => {
    const graph = buildHomePageSchemaGraph(SITE)
    const nodes = graph["@graph"] as Array<Record<string, unknown>>

    expect(nodes.some((node) => node["@type"] === "WebSite")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "Organization")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "ItemList")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "FAQPage")).toBe(true)
  })
})
