import type { FaqItem } from "@/lib/db/types/page-data"
import { ANIMAUX_FAQ, ANIMAUX_INTRO, ANIMAUX_META_DESCRIPTION } from "./animaux"

const THEME_INTROS: Record<string, string> = {
  animaux: ANIMAUX_INTRO,
}

const THEME_FAQS: Record<string, FaqItem[]> = {
  animaux: ANIMAUX_FAQ,
}

const THEME_META_DESCRIPTIONS: Record<string, string> = {
  animaux: ANIMAUX_META_DESCRIPTION,
}

export function getThemeIntro(slug: string): string | undefined {
  return THEME_INTROS[slug]
}

export function getThemeFaq(slug: string): FaqItem[] | undefined {
  return THEME_FAQS[slug]
}

export function getThemeMetaDescription(slug: string): string | undefined {
  return THEME_META_DESCRIPTIONS[slug]
}

export { ANIMAUX_FAQ, ANIMAUX_INTRO, ANIMAUX_META_DESCRIPTION } from "./animaux"
