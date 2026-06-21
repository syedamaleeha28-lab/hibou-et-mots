import {
  generatePuzzle,
  resolveGenerateOptions,
  type DifficultySlug,
} from "@/lib/puzzle-engine"
import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { getThemeWordsForPlay } from "@/lib/tools/generate"
import { difficultySeed } from "@/prisma/seed/difficulties"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"
import { mapPuzzleToPageData } from "@/lib/db/queries/mappers"
import {
  getSeedPuzzlePlan,
  getSeedPuzzlesForCategory,
} from "@/lib/db/adapters/puzzle-catalog"
import type { PuzzleSeedSpec } from "@/prisma/seed/puzzles"
import {
  mockCategoryRecord,
  mockDifficultyRecord,
  mockGradeRecord,
  mockThemeRecord,
} from "@/lib/db/adapters/mock-utils"

const FALLBACK_WORDS = ["CHAT", "CHIEN", "OISEAU", "LAPIN", "LION", "TIGRE", "OURS", "LOUP"]

function pickWords(spec: PuzzleSeedSpec): string[] {
  const fromBank = getThemeWordsForPlay(spec.themeSlug, spec.difficulty, spec.seed)
  if (fromBank.length > 0) return fromBank
  return FALLBACK_WORDS
}

function buildGeneratedGrid(spec: PuzzleSeedSpec) {
  const words = pickWords(spec)
  const options = resolveGenerateOptions({
    difficulty: spec.difficulty,
    grade: spec.gradeSlug,
    words,
    seed: spec.seed,
  })

  return generatePuzzle({
    ...options,
    words,
    seed: spec.seed,
  })
}

function mockDifficultyForSlug(slug: DifficultySlug) {
  const entry = difficultySeed.find((d) => d.slug === slug)!
  return mockDifficultyRecord({ slug: entry.slug, name: entry.name })
}

function mockThemeForSlug(themeSlug: string) {
  const theme = themeSeed.find((entry) => entry.slug === themeSlug)!
  return mockThemeRecord(theme)
}

function mockGradeForSlug(gradeSlug: string) {
  const grade = gradeSeed.find((entry) => entry.slug === gradeSlug)!
  return mockGradeRecord({
    slug: grade.slug,
    name: grade.name,
    order: grade.order,
    defaultGridSize: grade.defaultGridSize,
  })
}

function primaryCategorySlug(spec: PuzzleSeedSpec): string {
  if (spec.isComboExclusive && spec.gradeSlug) {
    return `${spec.gradeSlug}-${spec.themeSlug}`
  }
  return spec.themeSlug
}

export function mockPuzzlePageDataFromSeed(slug: string): PuzzlePageData | null {
  const spec = getSeedPuzzlePlan().find((entry) => entry.slug === slug)
  if (!spec) return null

  const generated = buildGeneratedGrid(spec)
  const now = new Date()
  const theme = mockThemeForSlug(spec.themeSlug)
  const difficulty = mockDifficultyForSlug(spec.difficulty)
  const grade = spec.gradeSlug ? mockGradeForSlug(spec.gradeSlug) : null
  const categorySlug = primaryCategorySlug(spec)

  const puzzleRecord = {
    id: `seed-${spec.slug}`,
    slug: spec.slug,
    title: spec.title,
    gridData: generated.grid,
    wordList: generated.wordList,
    solutionData: generated.solutionData,
    size: generated.size,
    difficultyId: difficulty.id,
    gradeId: grade?.id ?? null,
    themeId: theme.id,
    language: "fr",
    status: "PUBLISHED" as const,
    largePrint: false,
    pdfUrl: null,
    thumbnailUrl: null,
    viewCount: spec.viewCount,
    printCount: 0,
    metaTitle: spec.title,
    metaDescription: `Jouez et imprimez ce mots mêlés gratuit sur le thème ${theme.name}.`,
    createdAt: now,
    updatedAt: now,
    difficulty,
    grade,
    theme,
    categories: [
      {
        categoryId: `seed-cat-${categorySlug}`,
        puzzleId: `seed-${spec.slug}`,
        category: mockCategoryRecord({
          type: theme.isSeasonal ? "SEASONAL" : "THEME",
          slug: categorySlug,
          h1: `Mots mêlés ${theme.name}`,
          seoTitle: `Mots mêlés ${theme.name}`,
          metaDescription: theme.name,
          introText: theme.name,
          theme,
          grade: grade ?? undefined,
        }),
      },
    ],
  }

  const relatedCandidates = getSeedPuzzlesForCategory(categorySlug, 12)
    .filter((card) => card.slug !== spec.slug)
    .map((card) => ({
      ...card,
      themeId: theme.id,
      gradeId: grade?.id ?? null,
      difficultyId: difficulty.id,
    }))

  return mapPuzzleToPageData(puzzleRecord, relatedCandidates)
}
