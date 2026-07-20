import { describe, expect, it } from "vitest"
import { buildHomeMetadata } from "@/lib/seo/metadata"
import { DEFAULT_SITE_URL } from "@/lib/seo/routes"

describe("buildHomeMetadata", () => {
  it("returns canonical home metadata with Open Graph", async () => {
    const metadata = await buildHomeMetadata(DEFAULT_SITE_URL)

    expect(metadata.title).toContain("Hibou & Mots")
    expect(metadata.description).toContain("mots mêlés")
    expect(metadata.alternates?.canonical).toBe(`${DEFAULT_SITE_URL}/`)
    expect(metadata.openGraph?.title).toBeTruthy()
  })
})
