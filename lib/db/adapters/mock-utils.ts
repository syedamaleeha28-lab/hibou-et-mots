import type { PuzzleCardData } from "@/lib/db/types/page-data"
import type { CategoryRecord } from "@/lib/db/queries/mappers"
import { getSeedPuzzlesForCategory } from "@/lib/db/adapters/puzzle-catalog"

/**
 * Seed-backed puzzle cards for a category slug (only slugs that exist after
 * db seed). NOTE for PT-BR pack: this currently only knows French seed
 * slugs, so calling it with a Portuguese slug (e.g. "animais") returns an
 * empty array until real PT-BR puzzles are generated + seeded. PT-BR
 * category pages will render correctly with 0 puzzles until that's done —
 * see the pack's setup notes.
 */
export function staticMockPuzzleCards(categorySlug: string, count = 6): PuzzleCardData[] {
  return getSeedPuzzlesForCategory(categorySlug, count)
}

export function mockCategoryRecord(
  overrides: Partial<CategoryRecord> &
    Pick<CategoryRecord, "type" | "slug" | "h1" | "seoTitle" | "metaDescription" | "introText">,
): CategoryRecord {
  const now = new Date()
  return {
    id: `mock-${overrides.locale ?? "fr"}-${overrides.slug}`,
    locale: overrides.locale ?? "fr",
    parentCategoryId: null,
    gradeId: overrides.grade?.id ?? null,
    themeId: overrides.theme?.id ?? null,
    difficultyId: overrides.difficulty?.id ?? null,
    pressBrandId: overrides.pressBrand?.id ?? null,
    grade: overrides.grade ?? null,
    theme: overrides.theme ?? null,
    difficulty: overrides.difficulty ?? null,
    pressBrand: overrides.pressBrand ?? null,
    faqJson: null,
    status: "PUBLISHED",
    minPuzzleThreshold: 4,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

export function mockThemeRecord(theme: {
  slug: string
  name: string
  group: string
  isSeasonal?: boolean
  locale?: string
}) {
  const now = new Date()
  return {
    id: `mock-theme-${theme.locale ?? "fr"}-${theme.slug}`,
    locale: theme.locale ?? "fr",
    slug: theme.slug,
    name: theme.name,
    group: theme.group,
    iconUrl: null,
    isSeasonal: theme.isSeasonal ?? false,
    activeDateStart: null,
    activeDateEnd: null,
    seoTitle: null,
    metaDescription: null,
    introText: null,
    createdAt: now,
    updatedAt: now,
  }
}

export function mockGradeRecord(grade: {
  slug: string
  name: string
  order: number
  defaultGridSize: number
  locale?: string
}) {
  const now = new Date()
  return {
    id: `mock-grade-${grade.locale ?? "fr"}-${grade.slug}`,
    locale: grade.locale ?? "fr",
    slug: grade.slug,
    name: grade.name,
    ageRange: "",
    order: grade.order,
    defaultGridSize: grade.defaultGridSize,
    seoTitle: null,
    metaDescription: null,
    introText: null,
    createdAt: now,
    updatedAt: now,
  }
}

export function mockDifficultyRecord(difficulty: { slug: string; name: string; locale?: string }) {
  const now = new Date()
  return {
    id: `mock-diff-${difficulty.locale ?? "fr"}-${difficulty.slug}`,
    locale: difficulty.locale ?? "fr",
    slug: difficulty.slug,
    name: difficulty.name,
    gridSizeMin: 8,
    gridSizeMax: 12,
    wordCountMin: 6,
    wordCountMax: 10,
    directions: ["HORIZONTAL", "VERTICAL"],
    createdAt: now,
    updatedAt: now,
  }
}
