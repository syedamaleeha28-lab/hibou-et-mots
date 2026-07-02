import { SchemaJsonLd } from "@/components/seo"
import type { FaqItem } from "@/lib/db/types/page-data"
import { buildFaqPageSchema } from "@/lib/seo/schema/faq-page"
import { cn } from "@/lib/utils"
import { FaqAccordion } from "./faq-accordion"

type FaqProps = {
  items: FaqItem[]
  className?: string
  /** Set false when the parent page already embeds FAQPage in a larger schema graph. */
  includeSchema?: boolean
}

export function Faq({ items, className, includeSchema = true }: FaqProps) {
  if (items.length === 0) return null

  const faqSchema = includeSchema ? buildFaqPageSchema(items) : undefined

  return (
    <>
      {faqSchema ? <SchemaJsonLd data={faqSchema} /> : null}
      <FaqAccordion items={items} className={className} />
    </>
  )
}

export type { FaqItem }
