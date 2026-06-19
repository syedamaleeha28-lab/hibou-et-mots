import type { FaqItem } from "@/lib/db/types/page-data"
import { cn } from "@/lib/utils"

type FaqAccordionProps = {
  items: FaqItem[]
  className?: string
}

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  if (items.length === 0) return null

  return (
    <section className={cn("rounded-3xl border border-border bg-card p-6 sm:p-8", className)}>
      <h2 className="font-heading text-2xl font-extrabold text-foreground">Questions fréquentes</h2>
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
