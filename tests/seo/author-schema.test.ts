import { describe, expect, it } from "vitest"
import { SITE_AUTHOR, shouldShowAuthorAttribution } from "@/lib/content/author"
import {
  isReviewedPage,
  REVIEWER_BYLINE,
  REVIEWER_PAGE_TITLE,
  SITE_REVIEWER,
} from "@/lib/content/reviewer"
import { buildAuthorPageSchemaGraph } from "@/lib/seo/schema/author-page"
import {
  buildCategoryPageSchemaGraph,
  buildContentPageSchemaGraph,
} from "@/lib/seo/schema/page-schemas"
import {
  buildContentWebPageSchema,
  buildPersonSchema,
  buildReviewerPersonSchema,
  organizationSchemaId,
  reviewerSchemaId,
} from "@/lib/seo/schema/person"
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
    expect(profile.name).toBe(REVIEWER_PAGE_TITLE)
    expect((profile.mainEntity as Record<string, string>)["@id"]).toBe(reviewerSchemaId(SITE))
    expect((profile.author as Record<string, string>)["@id"]).toBe(organizationSchemaId(SITE))
    expect(profile.datePublished).toBeTruthy()
    expect(profile.dateModified).toBeTruthy()
  })
})

describe("author attribution pages", () => {
  it("shows the author block on hub-imprimer as well as hub-gratuits", () => {
    expect(shouldShowAuthorAttribution("hub-gratuits", "AUDIENCE")).toBe(true)
    expect(shouldShowAuthorAttribution("hub-imprimer", "AUDIENCE")).toBe(true)
  })
})

describe("Person schema", () => {
  it("publishes the reviewer, not a writer or founder", () => {
    const person = buildPersonSchema(SITE)

    expect(person).toEqual(buildReviewerPersonSchema(SITE))
    expect(person.name).toBe("Faqir Syed Iftikhar")
    expect(person).not.toHaveProperty("email")
    expect(SITE_AUTHOR.name).toBe("Hibou & Mots")
  })
})

describe("Organization schema enhancements", () => {
  it("includes description and knowsAbout without a founder", () => {
    const organization = buildOrganizationSchema(SITE) as Record<string, unknown>

    expect(organization.description).toBe(SITE_AUTHOR.mission)
    expect(organization.foundingDate).toBe("2024")
    expect(organization).not.toHaveProperty("founder")
    expect(organization.knowsAbout).toEqual(expect.arrayContaining(["Mots cachés"]))
  })
})

function graphNodes(graph: Record<string, unknown>): Array<Record<string, unknown>> {
  return graph["@graph"] as Array<Record<string, unknown>>
}

function categoryFixture(slug: string, type: "AUDIENCE" | "GRADE", canonicalPath: string) {
  return {
    slug,
    type,
    h1: slug,
    metaDescription: "Description de test.",
    canonicalPath,
    breadcrumbs: [{ label: "Accueil", href: ROUTES.home }],
    puzzles: {
      items: [],
      page: 1,
      pageSize: 24,
      totalCount: 0,
      totalPages: 0,
    },
    schema: {
      itemList: {
        "@context": "https://schema.org" as const,
        "@type": "ItemList" as const,
        name: slug,
        numberOfItems: 0,
        itemListElement: [],
      },
    },
  }
}

describe("reviewer Person schema", () => {
  it("describes Faqir Syed Iftikhar without url, sameAs, image or email", () => {
    const person = buildReviewerPersonSchema(SITE)

    expect(person["@type"]).toBe("Person")
    expect(person["@id"]).toBe(reviewerSchemaId(SITE))
    expect(person["@id"]).toBe(`${SITE}/#person-faqir-syed-iftikhar`)
    expect(person.name).toBe(SITE_REVIEWER.name)
    expect(person.jobTitle).toBe("Enseignant")
    expect(person.description).toBe(SITE_REVIEWER.description)
    expect(person.worksFor).toEqual({
      "@type": "EducationalOrganization",
      name: "Royal Academy School",
    })
    expect(person).not.toHaveProperty("url")
    expect(person).not.toHaveProperty("sameAs")
    expect(person).not.toHaveProperty("image")
    expect(person).not.toHaveProperty("email")
  })

  it("keeps the visible byline and the three allowlisted paths", () => {
    expect(REVIEWER_BYLINE).toBe(
      "Niveau et difficulté relus par Faqir Syed Iftikhar, enseignant à Royal Academy School.",
    )
    expect(isReviewedPage(ROUTES.pedagogie)).toBe(true)
    expect(isReviewedPage(ROUTES.ecoleHub)).toBe(true)
    expect(isReviewedPage(ROUTES.enfants)).toBe(true)
    expect(isReviewedPage("/mots-meles-ecole/cp/")).toBe(false)
    expect(isReviewedPage(ROUTES.auteur)).toBe(false)
    expect(isReviewedPage(undefined)).toBe(false)
  })
})

describe("reviewedBy on allowlisted pages only", () => {
  it("adds reviewedBy and the reviewer Person on pédagogie, école and enfants", () => {
    const pedagogie = buildContentPageSchemaGraph(
      {
        slug: "pedagogie",
        h1: "Pédagogie",
        metaDescription: "Guide pédagogique.",
        canonicalPath: ROUTES.pedagogie,
        breadcrumbs: [{ label: "Accueil", href: ROUTES.home }],
        faqJson: [],
        schema: {},
      },
      SITE,
    )
    const ecole = buildCategoryPageSchemaGraph(
      categoryFixture("hub-ecole", "AUDIENCE", ROUTES.ecoleHub),
      SITE,
    )
    const enfants = buildCategoryPageSchemaGraph(
      categoryFixture("enfants", "AUDIENCE", ROUTES.enfants),
      SITE,
    )

    for (const graph of [pedagogie, ecole, enfants]) {
      const nodes = graphNodes(graph)
      const webPage = nodes.find((node) => node["@type"] === "WebPage")
      const reviewer = nodes.find(
        (node) => node["@type"] === "Person" && node.name === SITE_REVIEWER.name,
      )

      expect(webPage?.reviewedBy).toEqual({ "@id": reviewerSchemaId(SITE) })
      expect(webPage?.author).toEqual({ "@id": organizationSchemaId(SITE) })
      expect(reviewer).toBeTruthy()
      expect(reviewer).not.toHaveProperty("url")
    }
  })

  it("leaves other pages without reviewedBy", () => {
    const grade = buildCategoryPageSchemaGraph(
      categoryFixture("cp", "GRADE", "/mots-meles-ecole/cp/"),
      SITE,
    )
    const other = buildContentWebPageSchema({
      path: ROUTES.generateur,
      name: "Générateur",
      description: "Créez une grille.",
      siteUrl: SITE,
    })
    const gradeNodes = graphNodes(grade)
    const gradePage = gradeNodes.find((node) => node["@type"] === "WebPage")

    expect(gradePage).toBeTruthy()
    expect(gradePage).not.toHaveProperty("reviewedBy")
    expect(gradeNodes.some((node) => node.name === SITE_REVIEWER.name)).toBe(false)
    expect(other).not.toHaveProperty("reviewedBy")
    expect(other.author).toEqual({ "@id": organizationSchemaId(SITE) })
  })
})
