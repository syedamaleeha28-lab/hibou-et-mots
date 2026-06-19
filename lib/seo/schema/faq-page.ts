import type { FaqItem } from "@/lib/db/types/page-data"
import type { FaqPageSchema } from "./types"

export function buildFaqPageSchema(items: FaqItem[]): FaqPageSchema | undefined {
  if (items.length === 0) return undefined

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}
