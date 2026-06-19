import { generatePuzzle, ALL_DIRECTIONS } from "@/lib/puzzle-engine"
import type { PuzzleCardData, PuzzlePageData } from "@/lib/db/types/page-data"
import { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/category-constants"
import {
  mockAnimauxCategoryPageData,
  mockEcoleHubPageData,
} from "@/lib/db/adapters/mock-categories"
import { mapPuzzleToPageData } from "@/lib/db/queries/mappers"
import { mockCategoryRecord } from "@/lib/db/adapters/mock-utils"

export { PILOT_PUZZLE_SLUG, mockEcoleHubPageData, mockAnimauxCategoryPageData }

const ANIMAL_WORDS = ["CHAT", "CHIEN", "OISEAU", "LAPIN", "LION", "TIGRE", "OURS", "LOUP"]

const generated = generatePuzzle({
  words: ANIMAL_WORDS,
  size: 10,
  directions: [...ALL_DIRECTIONS],
  simplifyAccents: true,
  seed: 42,
})

function buildMockPuzzleCards(prefix: string, count = 6): PuzzleCardData[] {
  return Array.from({ length: count }, (_, index) => {
    const n = String(index + 1).padStart(2, "0")
    const slug = index === 0 ? PILOT_PUZZLE_SLUG : `${prefix}-facile-${n}`
    return {
      id: `mock-puzzle-${slug}`,
      slug,
      title: `Mots mêlés ${prefix} ${n}`,
      href: `/mots-meles/${slug}/`,
      difficulty: { slug: "facile", name: "Facile" },
      theme: { slug: "animaux", name: "Animaux" },
      size: generated.size,
      wordCount: ANIMAL_WORDS.length,
      viewCount: 100 - index * 10,
    }
  })
}

export function mockAnimauxPuzzlePageData(): PuzzlePageData {
  const now = new Date()
  const puzzleRecord = {
    id: "mock-puzzle-animaux-facile-01",
    slug: PILOT_PUZZLE_SLUG,
    title: "Animaux de la ferme",
    gridData: generated.grid,
    wordList: generated.wordList,
    solutionData: generated.solutionData,
    size: generated.size,
    difficultyId: "mock-diff-facile",
    gradeId: null,
    themeId: "mock-theme-animaux",
    language: "fr",
    status: "PUBLISHED" as const,
    largePrint: false,
    pdfUrl: null,
    thumbnailUrl: null,
    viewCount: 128,
    printCount: 0,
    metaTitle: "Mots mêlés Animaux — Animaux de la ferme",
    metaDescription:
      "Jouez et imprimez ce mots mêlés gratuit sur le thème des animaux. Grille 10×10, difficulté facile.",
    createdAt: now,
    updatedAt: now,
    difficulty: {
      id: "mock-diff-facile",
      slug: "facile",
      name: "Facile",
      gridSizeMin: 8,
      gridSizeMax: 12,
      wordCountMin: 6,
      wordCountMax: 10,
      directions: ["HORIZONTAL", "VERTICAL"],
    },
    grade: null,
    theme: {
      id: "mock-theme-animaux",
      slug: "animaux",
      name: "Animaux",
      group: "Nature & Animaux",
      iconUrl: null,
      isSeasonal: false,
      activeDateStart: null,
      activeDateEnd: null,
      seoTitle: null,
      metaDescription: null,
      introText: null,
      createdAt: now,
      updatedAt: now,
    },
    categories: [
      {
        categoryId: "mock-animaux",
        puzzleId: "mock-puzzle-animaux-facile-01",
        category: mockCategoryRecord({
          type: "THEME",
          slug: "animaux",
          h1: "Mots mêlés Animaux",
          seoTitle: "Mots mêlés Animaux",
          metaDescription: "Animaux",
          introText: "Animaux",
          theme: {
            id: "mock-theme-animaux",
            slug: "animaux",
            name: "Animaux",
            group: "Nature & Animaux",
            iconUrl: null,
            isSeasonal: false,
            activeDateStart: null,
            activeDateEnd: null,
            seoTitle: null,
            metaDescription: null,
            introText: null,
            createdAt: now,
            updatedAt: now,
          },
        }),
      },
    ],
  }

  const relatedCandidates = buildMockPuzzleCards("animaux", 6).map((card) => ({
    ...card,
    themeId: "mock-theme-animaux",
    gradeId: null,
    difficultyId: "mock-diff-facile",
  }))

  return mapPuzzleToPageData(puzzleRecord, relatedCandidates)
}
