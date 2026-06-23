import type { FaqItem } from "@/lib/db/types/page-data"
import { getThemeFaq } from "@/lib/content/themes"
import { CATEGORY_FAQ_REGISTRY } from "./registry"

export { CATEGORY_FAQ_REGISTRY } from "./registry"

/** Resolve page-specific FAQ for a category slug (themes + registry). */
export function getCategoryFaq(slug: string): FaqItem[] | undefined {
  return getThemeFaq(slug) ?? CATEGORY_FAQ_REGISTRY[slug]
}

export function listCategoryFaqSlugs(): string[] {
  const slugs = new Set<string>(Object.keys(CATEGORY_FAQ_REGISTRY))
  for (const slug of [
    "animaux",
    "fruits",
    "sport",
    "halloween",
    "noel",
  ] as const) {
    if (getThemeFaq(slug)) slugs.add(slug)
  }
  return [...slugs].sort()
}

export type CategoryFaqAuditEntry = {
  slug: string
  source: "theme" | "registry"
  questionCount: number
}

export function auditCategoryFaqs(): CategoryFaqAuditEntry[] {
  return listCategoryFaqSlugs().map((slug) => {
    const themeFaq = getThemeFaq(slug)
    const faq = themeFaq ?? CATEGORY_FAQ_REGISTRY[slug]
    return {
      slug,
      source: themeFaq ? "theme" : "registry",
      questionCount: faq?.length ?? 0,
    }
  })
}
