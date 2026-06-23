import { describe, expect, it } from "vitest"
import { auditCategoryFaqs, getCategoryFaq } from "@/lib/content/category-faqs"
import { CATEGORY_SEED_DEFINITIONS } from "@/prisma/seed/categories"
import { resolveCategoryFaq } from "@/lib/seo/templates"

function faqFingerprint(faq: { question: string; answer: string }[]): string {
  return JSON.stringify(faq.map((item) => [item.question, item.answer]))
}

function topicHints(h1: string, slug: string): string[] {
  const hints = new Set<string>()
  for (const part of slug.split("-")) {
    if (part.length > 1) hints.add(part)
  }
  for (const word of h1.toLowerCase().split(/[^a-zàâçéèêëîïôùûüœ'-]+/)) {
    if (word.length > 3) hints.add(word)
  }
  return [...hints]
}

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/\p{Mark}/gu, "")
}

function answerMentionsTopic(answer: string, hints: string[]): boolean {
  const lower = stripAccents(answer.toLowerCase())
  return hints.some((hint) => {
    const normalizedHint = stripAccents(hint)
    if (lower.includes(normalizedHint)) return true
    if (normalizedHint.endsWith("s") && lower.includes(normalizedHint.slice(0, -1))) return true
    return false
  })
}

describe("category FAQ uniqueness audit", () => {
  const seedSlugs = CATEGORY_SEED_DEFINITIONS.map((def) => def.slug)

  it("covers every seeded category with a page-specific FAQ", () => {
    const missing: string[] = []
    for (const def of CATEGORY_SEED_DEFINITIONS) {
      const faq = getCategoryFaq(def.slug)
      if (!faq || faq.length < 3) missing.push(def.slug)
    }
    expect(missing).toEqual([])
    expect(seedSlugs.length).toBeGreaterThanOrEqual(45)
  })

  it("does not duplicate FAQ blocks across categories", () => {
    const byFingerprint = new Map<string, string[]>()
    for (const def of CATEGORY_SEED_DEFINITIONS) {
      const faq = getCategoryFaq(def.slug)!
      const fp = faqFingerprint(faq)
      const slugs = byFingerprint.get(fp) ?? []
      slugs.push(def.slug)
      byFingerprint.set(fp, slugs)
    }

    const duplicates = [...byFingerprint.entries()].filter(([, slugs]) => slugs.length > 1)
    expect(duplicates).toEqual([])
  })

  it("references the page topic in every answer", () => {
    for (const def of CATEGORY_SEED_DEFINITIONS) {
      const faq = getCategoryFaq(def.slug)!
      const hints = topicHints(def.h1, def.slug)
      for (const item of faq) {
        expect(
          answerMentionsTopic(item.answer, hints),
          `Answer for ${def.slug} should mention page topic: ${item.question}`,
        ).toBe(true)
      }
    }
  })

  it("resolveCategoryFaq uses slug-specific FAQs without generic fallback for seeds", () => {
    for (const def of CATEGORY_SEED_DEFINITIONS.slice(0, 8)) {
      const faq = resolveCategoryFaq(def.slug, def.type, null, Boolean(def.isHub))
      expect(faq).toEqual(getCategoryFaq(def.slug))
    }
  })

  it("audit summary matches seeded category count", () => {
    const audit = auditCategoryFaqs()
    expect(audit.length).toBeGreaterThanOrEqual(seedSlugs.length)
    expect(audit.every((entry) => entry.questionCount >= 3)).toBe(true)
  })
})
