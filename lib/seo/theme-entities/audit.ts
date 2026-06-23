import { getThemeFaq, getThemeIntro } from "@/lib/content/themes"
import { getThemeExploreCopy } from "@/lib/content/themes/theme-explore-links"
import { countWords } from "@/lib/content/phase1/intros"
import {
  getThemeEntityDefinition,
  MAX_THEME_INTRO_WORDS,
  MIN_THEME_FAQ_ITEMS,
  MIN_THEME_INTRO_WORDS,
  missingThemeEntities,
  themeEntityCoveragePercent,
  THEME_ENTITY_DEFINITIONS,
  type ThemeEntityDefinition,
} from "./terms"

export type ThemePageCopy = {
  slug: string
  label: string
  path: string
  introText: string
  faqText: string
  exploreText: string
  fullText: string
  introWordCount: number
}

export function collectThemePageCopy(definition: ThemeEntityDefinition): ThemePageCopy | null {
  const introText = getThemeIntro(definition.slug)
  if (!introText) return null

  const faq = getThemeFaq(definition.slug) ?? []
  const faqText = faq.flatMap((item) => [item.question, item.answer]).join(" ")
  const exploreText = getThemeExploreCopy(definition.slug)
  const fullText = [introText, faqText, exploreText].filter(Boolean).join(" ")

  return {
    slug: definition.slug,
    label: definition.label,
    path: definition.path,
    introText,
    faqText,
    exploreText,
    fullText,
    introWordCount: countWords(introText),
  }
}

export function collectAllThemePageCopies(): ThemePageCopy[] {
  return THEME_ENTITY_DEFINITIONS.map(collectThemePageCopy).filter(
    (copy): copy is ThemePageCopy => copy !== null,
  )
}

export type ThemeEntityPageReport = {
  slug: string
  label: string
  path: string
  coveragePercent: number
  presentEntities: string[]
  missingEntities: string[]
  introWordCount: number
  faqCount: number
  introWordCountOk: boolean
  faqCountOk: boolean
}

export type ThemeEntityCoverageReport = {
  generatedAt: string
  themes: ThemeEntityPageReport[]
  themesWithoutContent: string[]
}

export function scoreThemePage(copy: ThemePageCopy): ThemeEntityPageReport {
  const definition = getThemeEntityDefinition(copy.slug)!
  const presentEntities = definition.competitorEntities.filter(
    (entity) => !missingThemeEntities(copy.fullText, [entity]).includes(entity),
  )
  const missingEntities = missingThemeEntities(copy.fullText, definition.competitorEntities)
  const faqCount = (getThemeFaq(copy.slug) ?? []).length

  return {
    slug: copy.slug,
    label: copy.label,
    path: copy.path,
    coveragePercent: themeEntityCoveragePercent(copy.fullText, definition.competitorEntities),
    presentEntities: [...presentEntities],
    missingEntities,
    introWordCount: copy.introWordCount,
    faqCount,
    introWordCountOk:
      copy.introWordCount >= MIN_THEME_INTRO_WORDS && copy.introWordCount <= MAX_THEME_INTRO_WORDS,
    faqCountOk: faqCount >= MIN_THEME_FAQ_ITEMS,
  }
}

export function buildThemeEntityCoverageReport(): ThemeEntityCoverageReport {
  const copies = collectAllThemePageCopies()
  const coveredSlugs = new Set(copies.map((copy) => copy.slug))

  return {
    generatedAt: new Date().toISOString(),
    themes: copies.map(scoreThemePage),
    themesWithoutContent: THEME_ENTITY_DEFINITIONS.filter((def) => !coveredSlugs.has(def.slug)).map(
      (def) => def.label,
    ),
  }
}

export function formatThemeEntityCoverageReport(report: ThemeEntityCoverageReport): string {
  const lines: string[] = [
    "# Thematic Entity Coverage Report — Hibou&Mots",
    "",
    `Generated: ${report.generatedAt}`,
    `Audited themes: ${report.themes.length}`,
    "",
    "## Coverage table",
    "",
    "| Theme | Coverage % | Missing Entities |",
    "| --- | ---: | --- |",
  ]

  for (const theme of report.themes) {
    const missing =
      theme.missingEntities.length === 0 ? "—" : theme.missingEntities.join(", ")
    lines.push(`| ${theme.label} | ${theme.coveragePercent}% | ${missing} |`)
  }

  if (report.themesWithoutContent.length > 0) {
    lines.push("")
    lines.push("## Themes without editorial content")
    lines.push("")
    for (const label of report.themesWithoutContent) {
      lines.push(`- ${label}`)
    }
  }

  const weakIntros = report.themes.filter((theme) => !theme.introWordCountOk)
  if (weakIntros.length > 0) {
    lines.push("")
    lines.push("## Intro word count outside 250–400")
    lines.push("")
    for (const theme of weakIntros) {
      lines.push(`- ${theme.label}: ${theme.introWordCount} words`)
    }
  }

  lines.push("")
  lines.push("## Scope")
  lines.push("")
  lines.push(
    "Entity benchmarks derive from competitor word-search pages and Hibou&Mots theme word banks. Coverage scans intro, FAQ and internal link copy.",
  )

  return lines.join("\n")
}
