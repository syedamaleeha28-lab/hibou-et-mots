import { describe, expect, it } from "vitest"
import { SITE_AUTHOR } from "@/lib/content/author"
import { buildAuthorPageSchemaGraph } from "@/lib/seo/schema/author-page"
import { buildPersonSchema } from "@/lib/seo/schema/person"
import { buildOrganizationSchema } from "@/lib/seo/schema/home"
import { DEFAULT_SITE_URL, ROUTES } from "@/lib/seo/routes"

const SITE = DEFAULT_SITE_URL

describe("author page schema", () => {
  it("includes ProfilePage, Person and Organization", () => {
    const graph = buildAuthorPageSchemaGraph(SITE)
    const nodes = graph["@graph"] as Array<Record<string, unknown>>

    expect(nodes.some((node) => node["@type"] === "ProfilePage")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "Person")).toBe(true)
    expect(nodes.some((node) => node["@type"] === "Organization")).toBe(true)
  })

  it("links ProfilePage to the author URL and person entity", () => {
    const graph = buildAuthorPageSchemaGraph(SITE)
    const nodes = graph["@graph"] as Array<Record<string, unknown>>
    const profile = nodes.find((node) => node["@type"] === "ProfilePage") as Record<
      string,
      unknown
    >

    expect(profile.url).toBe(`${SITE}${ROUTES.auteur}`)
    expect((profile.mainEntity as Record<string, string>)["@id"]).toContain("#person")
    expect(profile.datePublished).toBeTruthy()
    expect(profile.dateModified).toBeTruthy()
  })
})

describe("Person schema", () => {
  it("describes the site author with email and expertise", () => {
    const person = buildPersonSchema(SITE) as Record<string, unknown>

    expect(person["@type"]).toBe("Person")
    expect(person.name).toBe(SITE_AUTHOR.name)
    expect(person.email).toBe(SITE_AUTHOR.email)
    expect(person.jobTitle).toBe(SITE_AUTHOR.jobTitle)
    expect(person.knowsAbout).toEqual(expect.arrayContaining(["Mots mêlés", "Vocabulaire scolaire"]))
  })
})

describe("Organization schema enhancements", () => {
  it("includes founder, description and knowsAbout", () => {
    const organization = buildOrganizationSchema(SITE) as Record<string, unknown>

    expect(organization.description).toBe(SITE_AUTHOR.mission)
    expect(organization.foundingDate).toBe("2024")
    expect(organization.founder).toEqual(expect.objectContaining({ "@id": expect.stringContaining("#person") }))
    expect(organization.knowsAbout).toEqual(expect.arrayContaining(["Mots cachés"]))
  })
})
