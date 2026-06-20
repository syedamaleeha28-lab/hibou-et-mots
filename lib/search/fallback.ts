import { mockAnimauxPuzzlePageData } from "@/lib/db/adapters/mock-pilot"
import { staticMockPuzzleCards } from "@/lib/db/adapters/mock-utils"
import { PILOT_PUZZLE_SLUG } from "@/lib/db/adapters/category-constants"
import type { PuzzleCardData } from "@/lib/db/types/page-data"
import { puzzlePath } from "@/lib/seo/routes"
import { difficultySeed } from "@/prisma/seed/difficulties"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"
import { CATEGORY_SEED_DEFINITIONS } from "@/prisma/seed/categories"
import {
  difficultyPath,
  gradePath,
  resolveCategoryPath,
  ROUTES,
  seasonalPath,
  themePath,
} from "@/lib/seo/routes"
import { normalizeSearchText } from "./normalize"
import type { SearchCategoryHit, SearchFilters, SearchInput, SearchPagination } from "./types"
import { SEARCH_PAGE_SIZE as PAGE_SIZE } from "./types"

function pilotCard(): PuzzleCardData {
  const puzzle = mockAnimauxPuzzlePageData()
  return {
    id: puzzle.id,
    slug: puzzle.slug,
    title: puzzle.title,
    href: puzzle.canonicalPath,
    difficulty: puzzle.difficulty,
    grade: puzzle.grade,
    theme: puzzle.theme,
    size: puzzle.size,
    wordCount: puzzle.wordList.length,
    viewCount: 128,
  }
}

function buildFallbackPuzzleCatalog(): PuzzleCardData[] {
  const bySlug = new Map<string, PuzzleCardData>()
  const add = (card: PuzzleCardData) => {
    if (!bySlug.has(card.slug)) bySlug.set(card.slug, card)
  }

  add(pilotCard())

  const presets: Array<{ prefix: string; theme?: { slug: string; name: string }; grade?: { slug: string; name: string } }> = [
    { prefix: "animaux", theme: { slug: "animaux", name: "Animaux" } },
    { prefix: "sport", theme: { slug: "sport", name: "Sport" } },
    { prefix: "noel", theme: { slug: "noel", name: "Noël" } },
    { prefix: "fruits", theme: { slug: "fruits", name: "Fruits" } },
    { prefix: "ce1", grade: { slug: "ce1", name: "CE1" } },
    { prefix: "cm2", grade: { slug: "cm2", name: "CM2" } },
  ]

  for (const preset of presets) {
    for (const card of staticMockPuzzleCards(preset.prefix, 4)) {
      add({
        ...card,
        theme: preset.theme ?? card.theme,
        grade: preset.grade ?? card.grade,
      })
    }
  }

  return [...bySlug.values()]
}

function buildFallbackCategoryCatalog(): SearchCategoryHit[] {
  const hits: SearchCategoryHit[] = [
    {
      id: "hub-gratuits",
      slug: "hub-gratuits",
      label: "Mots mêlés gratuits",
      href: ROUTES.gratuits,
      type: "HUB",
      description: "Toutes les grilles gratuites du site.",
    },
    {
      id: "hub-ecole",
      slug: "hub-ecole",
      label: "Mots mêlés École",
      href: ROUTES.ecoleHub,
      type: "HUB",
      description: "Grilles par niveau scolaire.",
    },
    {
      id: "hub-thematiques",
      slug: "hub-thematiques",
      label: "Mots mêlés thématiques",
      href: ROUTES.thematiquesHub,
      type: "HUB",
    },
  ]

  for (const theme of themeSeed) {
    hits.push({
      id: `theme-${theme.slug}`,
      slug: theme.slug,
      label: theme.name,
      href: theme.isSeasonal ? seasonalPath(theme.slug) : themePath(theme.slug),
      type: theme.isSeasonal ? "SEASONAL" : "THEME",
      description: `Mots mêlés sur le thème ${theme.name}.`,
    })
  }

  for (const grade of gradeSeed) {
    hits.push({
      id: `grade-${grade.slug}`,
      slug: grade.slug,
      label: grade.name,
      href: gradePath(grade.slug),
      type: "GRADE",
      description: grade.introText.slice(0, 100),
    })
  }

  for (const difficulty of difficultySeed) {
    hits.push({
      id: `difficulty-${difficulty.slug}`,
      slug: difficulty.slug,
      label: difficulty.name,
      href: difficultyPath(difficulty.slug),
      type: "DIFFICULTY",
    })
  }

  for (const category of CATEGORY_SEED_DEFINITIONS.slice(0, 20)) {
    hits.push({
      id: category.slug,
      slug: category.slug,
      label: category.h1,
      href: resolveCategoryPath({
        type: category.type,
        slug: category.slug,
        grade: category.gradeSlug ? { slug: category.gradeSlug } : null,
        theme: category.themeSlug ? { slug: category.themeSlug } : null,
        difficulty: category.difficultySlug ? { slug: category.difficultySlug } : null,
      }),
      type: category.type,
      description: category.introText.slice(0, 100),
    })
  }

  return hits
}

const FALLBACK_PUZZLES = buildFallbackPuzzleCatalog()
const FALLBACK_CATEGORIES = buildFallbackCategoryCatalog()

function textMatches(value: string | undefined, needle: string): boolean {
  if (!needle) return true
  if (!value) return false
  return normalizeSearchText(value).includes(needle)
}

function puzzleMatchesQuery(puzzle: PuzzleCardData, needle: string): boolean {
  if (!needle) return true
  return (
    textMatches(puzzle.title, needle) ||
    textMatches(puzzle.theme?.name, needle) ||
    textMatches(puzzle.grade?.name, needle) ||
    textMatches(puzzle.difficulty.name, needle) ||
    textMatches(puzzle.slug, needle)
  )
}

function puzzleMatchesFilters(puzzle: PuzzleCardData, filters: SearchFilters): boolean {
  if (filters.theme && puzzle.theme?.slug !== filters.theme) return false
  if (filters.grade && puzzle.grade?.slug !== filters.grade) return false
  if (filters.difficulty && puzzle.difficulty.slug !== filters.difficulty) return false
  if (filters.category) {
    const slugNeedle = normalizeSearchText(filters.category)
    const inSlug = normalizeSearchText(puzzle.slug).includes(slugNeedle)
    const inTheme = puzzle.theme?.slug === filters.category
    const inGrade = puzzle.grade?.slug === filters.category
    if (!inSlug && !inTheme && !inGrade) return false
  }
  return true
}

function categoryMatchesQuery(category: SearchCategoryHit, needle: string): boolean {
  if (!needle) return false
  return (
    textMatches(category.label, needle) ||
    textMatches(category.slug, needle) ||
    textMatches(category.description, needle) ||
    textMatches(category.type, needle)
  )
}

function paginate<T>(items: T[], page: number, pageSize: number): SearchPagination & { items: T[] } {
  const totalCount = items.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalCount,
    totalPages,
  }
}

export function searchPuzzlesFallback(input: SearchInput): {
  puzzles: SearchPagination
  categories: SearchCategoryHit[]
} {
  const needle = normalizeSearchText(input.query)

  let puzzles = FALLBACK_PUZZLES.filter(
    (puzzle) => puzzleMatchesQuery(puzzle, needle) && puzzleMatchesFilters(puzzle, input.filters),
  )

  if (needle && puzzles.length === 0) {
    puzzles = FALLBACK_PUZZLES.filter((puzzle) => puzzleMatchesFilters(puzzle, input.filters))
  }

  puzzles.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))

  const categories = FALLBACK_CATEGORIES.filter((category) => categoryMatchesQuery(category, needle)).slice(
    0,
    8,
  )

  return {
    puzzles: paginate(puzzles, input.page, PAGE_SIZE),
    categories,
  }
}

export function getPopularPuzzlesForSearch(limit = 6): PuzzleCardData[] {
  return [...FALLBACK_PUZZLES]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, limit)
}

export function getRelatedCategoriesForSearch(query: string, limit = 6): SearchCategoryHit[] {
  const needle = normalizeSearchText(query)
  if (!needle) {
    return FALLBACK_CATEGORIES.filter((entry) => entry.type === "HUB" || entry.type === "THEME").slice(
      0,
      limit,
    )
  }

  const matches = FALLBACK_CATEGORIES.filter((category) => categoryMatchesQuery(category, needle))
  return (matches.length > 0 ? matches : FALLBACK_CATEGORIES).slice(0, limit)
}

export function isFallbackSearchAvailable(): boolean {
  return FALLBACK_PUZZLES.length > 0
}

export { PILOT_PUZZLE_SLUG, puzzlePath }
