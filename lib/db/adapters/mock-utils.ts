import type { PuzzleCardData } from "@/lib/db/types/page-data"
import type { CategoryRecord } from "@/lib/db/queries/mappers"
import { getSeedPuzzlesForCategory } from "@/lib/db/adapters/puzzle-catalog"

/** Seed-backed puzzle cards for a category slug (only slugs that exist after db seed). */
export function staticMockPuzzleCards(categorySlug: string, count = 6): PuzzleCardData[] {
  return getSeedPuzzlesForCategory(categorySlug, count)
}

export function mockCategoryRecord(
  overrides: Partial<CategoryRecord> &
    Pick<CategoryRecord, "type" | "slug" | "h1" | "seoTitle" | "metaDescription" | "introText">,
): CategoryRecord {
  const now = new Date()
  return {
    id: `mock-${overrides.slug}`,
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
}) {
  const now = new Date()
  return {
    id: `mock-theme-${theme.slug}`,
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
}) {
  const now = new Date()
  return {
    id: `mock-grade-${grade.slug}`,
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

export function mockDifficultyRecord(difficulty: { slug: string; name: string }) {
  const now = new Date()
  return {
    id: `mock-diff-${difficulty.slug}`,
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
