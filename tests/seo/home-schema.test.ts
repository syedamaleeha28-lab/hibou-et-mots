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

  it("builds Organization with logo, email, social profiles, founder and description", () => {
    const organization = buildOrganizationSchema(SITE) as Record<string, unknown>

    expect(organization["@type"]).toBe("Organization")
    expect(organization.logo).toBe(`${SITE}/icon.svg`)
    expect(organization.email).toBe("hibou.et.mots@gmail.com")
    expect(organization.description).toBeTruthy()
    expect(organization.founder).toBeTruthy()
    expect(organization.sameAs).toEqual([
      "https://www.instagram.com/hibou.et.mots/",
      "https://x.com/hibouetmots",
      "https://pin.it/5J8yqtESq",
    ])
  })

  it("composes homepage @graph with website, organization, person, popular puzzles and FAQ", () => {
    const graph = buildHomePageSchemaGraph(SITE)
    const nodes = graph["@graph"] as Array<Record<string, unknown>>

    expect(nodes.some((node) => node["@type"] === "WebSite")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "Organization")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "Person")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "ItemList")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "FAQPage")).toBe(true)
  })
})
