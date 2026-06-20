import { describe, expect, it } from "vitest"
import { buildHomeMetadata } from "@/lib/seo/metadata"

describe("buildHomeMetadata", () => {
  it("returns canonical home metadata with Open Graph", async () => {
    const metadata = await buildHomeMetadata("https://hibou-et-mots.fr")

    expect(metadata.title).toContain("Hibou&Mots")
    expect(metadata.description).toContain("mots mêlés")
    expect(metadata.alternates?.canonical).toBe("https://hibou-et-mots.fr/")
    expect(metadata.openGraph?.title).toBeTruthy()
  })
})
