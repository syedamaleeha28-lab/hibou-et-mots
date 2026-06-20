import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { HOME_FAQ } from "@/lib/content/phase1"

export function HomeFaq() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <FaqAccordion items={HOME_FAQ} />
    </section>
  )
}
