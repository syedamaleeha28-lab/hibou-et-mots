import type { FaqItem } from "@/lib/db/types/page-data"
import { getCategoryFaq } from "@/lib/content/category-faqs"

/** @deprecated Use getCategoryFaq — kept for scripts that import PHASE1_FAQS by key. */
export const PHASE1_FAQS: Record<string, FaqItem[]> = {
  "hub-gratuits": getCategoryFaq("hub-gratuits")!,
  "hub-imprimer": getCategoryFaq("hub-imprimer")!,
  "hub-ecole": getCategoryFaq("hub-ecole")!,
  enfants: getCategoryFaq("enfants")!,
}

export function getPhase1Faq(slug: string): FaqItem[] | undefined {
  return getCategoryFaq(slug)
}
