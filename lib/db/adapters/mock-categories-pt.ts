/**
 * PT-BR mock category content — v1 test scope.
 *
 * Mirrors the shape of lib/db/adapters/mock-categories.ts but scoped to
 * only what's needed to test the first batch of Portuguese pages:
 * - hub-imprimer (the "caça palavras para imprimir" hub)
 * - 2 themes: animais, esporte
 * - 3 difficulty levels: facil, medio, dificil
 *
 * This is intentionally a fresh, small file rather than a translation of
 * the full French mock-categories.ts (which pulls in ~6 French-only prose
 * content files). Extend the *_PT objects below as you add more PT pages.
 */
import type { CategoryPageData, SubCategoryLink } from "@/lib/db/types/page-data"
import { mapCategoryToPageData } from "@/lib/db/queries/mappers"
import { mockCategoryRecord, mockDifficultyRecord, mockThemeRecord, staticMockPuzzleCards } from "@/lib/db/adapters/mock-utils"
import { difficultySeedPt } from "@/prisma/seed/difficulties.pt"
import { themeSeedPt } from "@/prisma/seed/themes.pt"
import { ptDifficultyPath, ptThemePath, PT_ROUTES } from "@/lib/seo/routes"

const themeSubCategoriesPt: SubCategoryLink[] = themeSeedPt.map((theme) => ({
  id: `mock-theme-pt-${theme.slug}`,
  label: theme.name,
  href: ptThemePath(theme.slug),
  description: `Caça-palavras sobre ${theme.name.toLowerCase()}.`,
  puzzleCount: 0,
}))

const difficultySubCategoriesPt: SubCategoryLink[] = difficultySeedPt.map((level) => ({
  id: `mock-difficulty-pt-${level.slug}`,
  label: level.name,
  href: ptDifficultyPath(level.slug),
  description: `Grades de nível ${level.name.toLowerCase()}.`,
  puzzleCount: 0,
}))

// ------------------------------------------------------------
// Hub: /caca-palavras-para-imprimir/
// ------------------------------------------------------------
export function mockHubImprimirPageDataPt(page = 1): CategoryPageData {
  const category = mockCategoryRecord({
    locale: "pt-BR",
    type: "AUDIENCE",
    slug: "hub-imprimer",
    h1: "Caça-Palavras para Imprimir",
    seoTitle: "Caça-Palavras para Imprimir Grátis em PDF | Hibou & Mots",
    metaDescription:
      "Centenas de grades de caça-palavras 100% grátis para imprimir em PDF, com gabarito. Ideal para casa, escola e toda a família.",
    introText:
      "Baixe e imprima grades de caça-palavras gratuitas em PDF, formato A4, com gabarito na segunda página. Escolha por tema ou por nível de dificuldade.",
    faqJson: [
      {
        question: "O caça-palavras para imprimir é realmente grátis?",
        answer: "Sim, todas as grades são 100% gratuitas, sem necessidade de cadastro.",
      },
      {
        question: "Como faço para imprimir uma grade?",
        answer:
          "Escolha uma grade, baixe o PDF e imprima em papel A4. O gabarito vem na segunda página.",
      },
    ],
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards("hub-imprimer-pt", 6), {
    page,
    subCategories: [...themeSubCategoriesPt, ...difficultySubCategoriesPt],
    relatedCategories: [],
  })
}

// ------------------------------------------------------------
// Themes: /caca-palavras-tematicos/[theme]/
// ------------------------------------------------------------
export function mockThemeCategoryPageDataPt(themeSlug: string, page = 1): CategoryPageData | null {
  const theme = themeSeedPt.find((entry) => entry.slug === themeSlug)
  if (!theme) return null

  const themeRecord = mockThemeRecord({ ...theme, locale: "pt-BR" })
  const category = mockCategoryRecord({
    locale: "pt-BR",
    type: "THEME",
    slug: theme.slug,
    h1: `Caça-Palavras de ${theme.name}`,
    seoTitle: `Caça-Palavras de ${theme.name} — Grátis para Imprimir | Hibou & Mots`,
    metaDescription: `Caça-palavras grátis sobre ${theme.name.toLowerCase()}, para imprimir em PDF ou jogar online.`,
    introText: `Escolha uma grade de caça-palavras sobre ${theme.name.toLowerCase()} e divirta-se aprendendo novas palavras em português.`,
    faqJson: [
      {
        question: `Os caça-palavras de ${theme.name.toLowerCase()} são grátis?`,
        answer: "Sim, todas as grades deste tema são gratuitas para imprimir ou jogar online.",
      },
    ],
    theme: themeRecord,
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards(`${theme.slug}-pt`, 6), {
    page,
    relatedCategories: themeSubCategoriesPt.filter((entry) => entry.href !== ptThemePath(theme.slug)),
  })
}

// ------------------------------------------------------------
// Difficulty levels: /caca-palavras-nivel/[level]/
// ------------------------------------------------------------
export function mockDifficultyCategoryPageDataPt(levelSlug: string, page = 1): CategoryPageData | null {
  const level = difficultySeedPt.find((entry) => entry.slug === levelSlug)
  if (!level) return null

  const category = mockCategoryRecord({
    locale: "pt-BR",
    type: "DIFFICULTY",
    slug: level.slug,
    h1: `Caça-Palavras Nível ${level.name}`,
    seoTitle: `Caça-Palavras ${level.name} para Imprimir | Hibou & Mots`,
    metaDescription: `Grades de caça-palavras nível ${level.name.toLowerCase()}, grátis para imprimir em PDF.`,
    introText: `Grades de nível ${level.name.toLowerCase()} para praticar no seu próprio ritmo.`,
    faqJson: [
      {
        question: `Qual o tamanho das grades de nível ${level.name.toLowerCase()}?`,
        answer: `As grades variam de ${level.gridSizeMin}×${level.gridSizeMin} a ${level.gridSizeMax}×${level.gridSizeMax} letras.`,
      },
    ],
    difficulty: mockDifficultyRecord({ ...level, locale: "pt-BR" }),
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards(`${level.slug}-pt`, 6), {
    page,
    relatedCategories: difficultySubCategoriesPt.filter(
      (entry) => entry.href !== ptDifficultyPath(level.slug),
    ),
  })
}

export function isKnownPtThemeCategorySlug(slug: string): boolean {
  return themeSeedPt.some((t) => t.slug === slug)
}

export function isKnownPtDifficultyCategorySlug(slug: string): boolean {
  return difficultySeedPt.some((d) => d.slug === slug)
}
