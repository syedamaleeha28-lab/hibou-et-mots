import { describe, expect, it } from "vitest"
import {
  ContentPageCtaSection,
  ContentPageHero,
  ContentPageTemplate,
  ContentRelatedLinks,
} from "@/components/templates/content"
import { renderContentPage, contentGenerateMetadata } from "@/lib/app/content-page"

describe("content page template module", () => {
  it("exports the template, sections, and app render helpers", () => {
    expect(ContentPageTemplate).toBeTypeOf("function")
    expect(ContentPageHero).toBeTypeOf("function")
    expect(ContentPageCtaSection).toBeTypeOf("function")
    expect(ContentRelatedLinks).toBeTypeOf("function")
    expect(renderContentPage).toBeTypeOf("function")
    expect(contentGenerateMetadata).toBeTypeOf("function")
  })
})
