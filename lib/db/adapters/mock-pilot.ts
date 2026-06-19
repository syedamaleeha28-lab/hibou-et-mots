import { generatePuzzle, ALL_DIRECTIONS } from "@/lib/puzzle-engine"
import type { CategoryPageData, PuzzleCardData, PuzzlePageData } from "@/lib/db/types/page-data"
import { gradeSeed } from "@/prisma/seed/grades"
import {
  mapCategoryToPageData,
  mapPuzzleToPageData,
  type CategoryRecord,
} from "@/lib/db/queries/mappers"
import { gradePath, themePath } from "@/lib/seo/routes"

export const PILOT_PUZZLE_SLUG = "animaux-facile-01"

const ANIMAL_WORDS = ["CHAT", "CHIEN", "OISEAU", "LAPIN", "LION", "TIGRE", "OURS", "LOUP"]

const generated = generatePuzzle({
  words: ANIMAL_WORDS,
  size: 10,
  directions: [...ALL_DIRECTIONS],
  simplifyAccents: true,
  seed: 42,
})

function mockCategoryRecord(
  overrides: Partial<CategoryRecord> &
    Pick<CategoryRecord, "type" | "slug" | "h1" | "seoTitle" | "metaDescription" | "introText">,
): CategoryRecord {
  const now = new Date()
  return {
    id: `mock-${overrides.slug}`,
    parentCategoryId: null,
    gradeId: overrides.grade?.id ?? null,
    themeId: overrides.theme?.id ?? null,
    difficultyId: null,
    pressBrandId: null,
    grade: overrides.grade ?? null,
    theme: overrides.theme ?? null,
    difficulty: null,
    pressBrand: null,
    faqJson: null,
    status: "PUBLISHED",
    minPuzzleThreshold: 4,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

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

const mockEcoleSubCategories = gradeSeed.map((grade) => ({
  id: `mock-grade-${grade.slug}`,
  label: grade.name,
  href: gradePath(grade.slug),
  description: grade.introText.slice(0, 120),
  puzzleCount: 12,
  badge: grade.slug.toUpperCase(),
}))

const mockAnimauxRelated = [
  {
    id: "mock-theme-sport",
    label: "Mots mêlés Sport",
    href: themePath("sport"),
    description: "Football, natation, athlétisme…",
    puzzleCount: 8,
  },
  {
    id: "mock-theme-nature",
    label: "Mots mêlés Nature",
    href: themePath("nature"),
    description: "Forêt, rivière, montagne…",
    puzzleCount: 6,
  },
]

export function mockEcoleHubPageData(page = 1): CategoryPageData {
  const category = mockCategoryRecord({
    type: "GRADE",
    slug: "hub-ecole",
    h1: "Mots mêlés École — Grilles par niveau scolaire",
    seoTitle: "Mots mêlés École — CP, CE1, CM2 gratuits à imprimer",
    metaDescription:
      "Des mots mêlés gratuits pour chaque niveau scolaire : maternelle, CP, CE1, CE2, CM1, CM2 et 6e. PDF à imprimer et grilles en ligne.",
    introText:
      "Retrouve des mots mêlés adaptés à chaque classe, du CP au CM2. Des grilles calibrées pour le vocabulaire scolaire, prêtes à imprimer ou à jouer en ligne.",
  })

  const puzzles = buildMockPuzzleCards("ecole", 6)

  return mapCategoryToPageData(category, puzzles, {
    page,
    subCategories: mockEcoleSubCategories,
    relatedCategories: [
      {
        id: "mock-theme-animaux",
        label: "Mots mêlés Animaux",
        href: themePath("animaux"),
        description: "Grilles sur les animaux domestiques et sauvages.",
        puzzleCount: 6,
      },
    ],
  })
}

export function mockAnimauxCategoryPageData(page = 1): CategoryPageData {
  const category = mockCategoryRecord({
    type: "THEME",
    slug: "animaux",
    h1: "Mots mêlés Animaux — Grilles gratuites",
    seoTitle: "Mots mêlés Animaux — Grilles gratuites à imprimer",
    metaDescription:
      "Des mots mêlés sur le thème des animaux : chat, chien, lion, tigre… Grilles gratuites à imprimer et à jouer en ligne.",
    introText:
      "Explore des grilles de mots mêlés sur le thème des animaux, parfaites pour enrichir le vocabulaire des enfants en s'amusant.",
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  const puzzles = buildMockPuzzleCards("animaux", 6)

  return mapCategoryToPageData(category, puzzles, {
    page,
    relatedCategories: mockAnimauxRelated,
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
