import { describe, expect, it } from "vitest"
import { getCategoryFaq } from "@/lib/content/category-faqs"
import { GENERATOR_FAQ, HOME_FAQ, ONLINE_PLAY_FAQ } from "@/lib/content/phase1"
import { buildFaqPageSchema } from "@/lib/seo/schema/faq-page"

const FAQ_PAGE_SLUGS = [
  "hub-gratuits",
  "hub-imprimer",
  "hub-ecole",
  "enfants",
  "adultes",
  "cp",
  "maternelle",
  "noel",
  "animaux",
] as const

describe("FAQPage JSON-LD", () => {
  it("builds valid FAQPage schema for tool and hub FAQs", () => {
    for (const items of [HOME_FAQ, GENERATOR_FAQ, ONLINE_PLAY_FAQ]) {
      const schema = buildFaqPageSchema(items)
      expect(schema?.["@type"]).toBe("FAQPage")
      expect(schema?.mainEntity.length).toBe(items.length)
      for (const entity of schema?.mainEntity ?? []) {
        expect(entity["@type"]).toBe("Question")
        expect(entity.acceptedAnswer["@type"]).toBe("Answer")
        expect(entity.name.length).toBeGreaterThan(0)
        expect(entity.acceptedAnswer.text.length).toBeGreaterThan(0)
      }
    }
  })

  it("outputs FAQPage schema for every audited category slug", () => {
    for (const slug of FAQ_PAGE_SLUGS) {
      const items = getCategoryFaq(slug)
      expect(items?.length, slug).toBeGreaterThan(0)
      const schema = buildFaqPageSchema(items!)
      expect(schema?.["@type"], slug).toBe("FAQPage")
    }
  })
})
