import type { FaqItem } from "@/lib/db/types/page-data"
import { cn } from "@/lib/utils"

type FaqAccordionProps = {
  items: FaqItem[]
  className?: string
  // NEW: was hardcoded French with no way to override. The questions/
  // answers themselves were already locale-correct (they come from
  // category.faqJson); only this heading was leaking French onto
  // PT-BR pages.
  locale?: "fr" | "pt-BR"
}

const HEADING: Record<"fr" | "pt-BR", string> = {
  fr: "Questions fréquentes",
  "pt-BR": "Perguntas frequentes",
}

export function FaqAccordion({ items, className, locale = "fr" }: FaqAccordionProps) {
  if (items.length === 0) return null

  return (
    <section className={cn("rounded-3xl border border-border bg-card p-6 sm:p-8", className)}>
      <h2 className="font-heading text-2xl font-extrabold text-foreground">{HEADING[locale]}</h2>
      <div className="mt-6 flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-border/80 bg-background/60 px-4 py-3 open:bg-background"
          >
            <summary className="cursor-pointer list-none font-heading text-base font-extrabold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
