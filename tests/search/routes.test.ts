import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { robotsDirective } from "@/lib/seo/indexability"
import { buildSearchMetadata } from "@/lib/seo/metadata"
import { ROUTES } from "@/lib/seo/routes"

describe("search routes", () => {
  it("defines the canonical search path", () => {
    expect(ROUTES.recherche).toBe("/recherche/")
  })

  it("has app router page and API route", () => {
    const root = process.cwd()
    expect(existsSync(resolve(root, "app/recherche/page.tsx"))).toBe(true)
    expect(existsSync(resolve(root, "app/api/search/route.ts"))).toBe(true)
  })

  it("marks search pages as noindex,follow", async () => {
    expect(robotsDirective({ pageType: "search" })).toEqual({
      index: false,
      follow: true,
    })

    const metadata = await buildSearchMetadata({ query: "animaux", page: 1 })
    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(metadata.title).toContain("animaux")
  })
})
