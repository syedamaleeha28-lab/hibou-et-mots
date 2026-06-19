import type { PrismaClient } from "@prisma/client"
import {
  generatePuzzleBatch,
  GRADE_ORDER,
  resolveGenerateOptions,
  selectWordsFromBank,
  toPrismaPuzzlePayload,
  type DifficultySlug,
  type GradeSlug,
  type ThemeWordInput,
} from "@/lib/puzzle-engine"
import {
  HUB_CATEGORY_SLUGS,
  MVP_P1_COMBOS,
  MVP_PRESS_BRANDS,
  MVP_P0_GRADE_SLUGS,
  MVP_P0_THEME_SLUGS,
  PILOT_PUZZLE_SLUG,
} from "@/lib/db/adapters/category-constants"
import { gradeSeed } from "./grades"
import { themeSeed } from "./themes"

export type PuzzleSeedSpec = {
  id: string
  slug: string
  title: string
  themeSlug: string
  gradeSlug?: GradeSlug
  difficulty: DifficultySlug
  seed: number
  categorySlugs: string[]
  viewCount: number
  isComboExclusive?: boolean
}

const MVP_SEASONAL_P0 = new Set(["noel", "halloween"])
const DIFFICULTY_ROTATION: DifficultySlug[] = ["facile", "moyen", "difficile"]

function puzzleCountForTheme(slug: string, isSeasonal: boolean): number {
  if (MVP_P0_THEME_SLUGS.includes(slug as (typeof MVP_P0_THEME_SLUGS)[number])) return 8
  if (MVP_SEASONAL_P0.has(slug)) return 8
  return isSeasonal ? 6 : 6
}

function categorySlugsForSpec(spec: Pick<PuzzleSeedSpec, "themeSlug" | "gradeSlug" | "difficulty">): string[] {
  const slugs = new Set<string>([
    HUB_CATEGORY_SLUGS.gratuits,
    HUB_CATEGORY_SLUGS.imprimer,
    spec.themeSlug,
    spec.difficulty,
    HUB_CATEGORY_SLUGS.difficulte,
  ])

  const theme = themeSeed.find((entry) => entry.slug === spec.themeSlug)
  if (theme?.isSeasonal) {
    slugs.add(HUB_CATEGORY_SLUGS.fetes)
  } else {
    slugs.add(HUB_CATEGORY_SLUGS.thematiques)
  }

  if (spec.gradeSlug) {
    slugs.add(spec.gradeSlug)
    slugs.add(HUB_CATEGORY_SLUGS.ecole)
    const comboSlug = `${spec.gradeSlug}-${spec.themeSlug}`
    if (MVP_P1_COMBOS.some((combo) => `${combo.grade}-${combo.theme}` === comboSlug)) {
      slugs.add(comboSlug)
    }
    slugs.add("enfants")
  }

  if (!spec.gradeSlug && spec.difficulty === "difficile") {
    slugs.add("adultes")
  }

  if (spec.difficulty === "moyen" || spec.difficulty === "difficile") {
    slugs.add("seniors")
  }

  return [...slugs]
}

function buildThemePuzzleSpecs(): PuzzleSeedSpec[] {
  const specs: PuzzleSeedSpec[] = []
  let seedBase = 1000

  for (const theme of themeSeed) {
    const count = puzzleCountForTheme(theme.slug, theme.isSeasonal)
    for (let index = 0; index < count; index++) {
      const difficulty = DIFFICULTY_ROTATION[index % DIFFICULTY_ROTATION.length]!
      const nn = String(index + 1).padStart(2, "0")
      let slug = `${theme.slug}-${difficulty}-${nn}`
      if (theme.slug === "animaux" && difficulty === "facile" && nn === "01") {
        slug = PILOT_PUZZLE_SLUG
      }

      const gradeSlug =
        index % 2 === 0
          ? (MVP_P0_GRADE_SLUGS[index % MVP_P0_GRADE_SLUGS.length] as GradeSlug)
          : undefined

      const themeName = theme.name
      const title = gradeSlug
        ? `Mots mêlés ${themeName} — ${gradeSlug.toUpperCase()} ${nn}`
        : `Mots mêlés ${themeName} — ${difficulty} ${nn}`

      specs.push({
        id: `theme-${theme.slug}-${nn}`,
        slug,
        title,
        themeSlug: theme.slug,
        gradeSlug,
        difficulty,
        seed: seedBase++,
        categorySlugs: categorySlugsForSpec({ themeSlug: theme.slug, gradeSlug, difficulty }),
        viewCount: 180 - index * 7,
      })
    }
  }

  return specs
}

function buildComboPuzzleSpecs(): PuzzleSeedSpec[] {
  const specs: PuzzleSeedSpec[] = []
  let seedBase = 5000

  for (const combo of MVP_P1_COMBOS) {
    const theme = themeSeed.find((entry) => entry.slug === combo.theme)!
    const grade = gradeSeed.find((entry) => entry.slug === combo.grade)!

    for (let index = 0; index < 4; index++) {
      const nn = String(index + 1).padStart(2, "0")
      const difficulty: DifficultySlug = index < 2 ? "facile" : "moyen"
      const slug = `${combo.grade}-${combo.theme}-${difficulty}-${nn}`

      specs.push({
        id: `combo-${combo.grade}-${combo.theme}-${nn}`,
        slug,
        title: `Mots mêlés ${grade.name} ${theme.name} — ${nn}`,
        themeSlug: combo.theme,
        gradeSlug: combo.grade as GradeSlug,
        difficulty,
        seed: seedBase++,
        categorySlugs: [
          ...categorySlugsForSpec({
            themeSlug: combo.theme,
            gradeSlug: combo.grade as GradeSlug,
            difficulty,
          }),
          `${combo.grade}-${combo.theme}`,
        ],
        viewCount: 150 - index * 5,
        isComboExclusive: true,
      })
    }
  }

  return specs
}

function buildGradeBoosterSpecs(existingSlugs: Set<string>): PuzzleSeedSpec[] {
  const specs: PuzzleSeedSpec[] = []
  let seedBase = 7000
  const boosterThemes = ["animaux", "vocabulaire", "sport"] as const

  for (const grade of gradeSeed) {
    for (let index = 0; index < 2; index++) {
      const themeSlug = boosterThemes[index % boosterThemes.length]!
      const difficulty: DifficultySlug = grade.order <= 2 ? "facile" : "moyen"
      const nn = String(index + 1).padStart(2, "0")
      const slug = `${grade.slug}-${themeSlug}-bonus-${nn}`
      if (existingSlugs.has(slug)) continue

      specs.push({
        id: `grade-boost-${grade.slug}-${nn}`,
        slug,
        title: `Mots mêlés ${grade.name} — ${themeSlug} ${nn}`,
        themeSlug,
        gradeSlug: grade.slug as GradeSlug,
        difficulty,
        seed: seedBase++,
        categorySlugs: categorySlugsForSpec({
          themeSlug,
          gradeSlug: grade.slug as GradeSlug,
          difficulty,
        }),
        viewCount: 90 - index * 3,
      })
      existingSlugs.add(slug)
    }
  }

  return specs
}

export function buildPuzzlePlan(): PuzzleSeedSpec[] {
  const themeSpecs = buildThemePuzzleSpecs()
  const slugSet = new Set(themeSpecs.map((spec) => spec.slug))
  const comboSpecs = buildComboPuzzleSpecs().filter((spec) => {
    if (slugSet.has(spec.slug)) return false
    slugSet.add(spec.slug)
    return true
  })
  const gradeSpecs = buildGradeBoosterSpecs(slugSet)

  return [...themeSpecs, ...comboSpecs, ...gradeSpecs]
}

type WordBankByTheme = Map<string, ThemeWordInput[]>

async function loadWordBanks(prisma: PrismaClient): Promise<WordBankByTheme> {
  const rows = await prisma.themeWord.findMany({
    include: { theme: { select: { slug: true } } },
  })

  const banks = new Map<string, ThemeWordInput[]>()
  for (const row of rows) {
    const list = banks.get(row.theme.slug) ?? []
    list.push({
      word: row.word,
      length: row.length,
      minGradeOrder: row.minGradeOrder,
    })
    banks.set(row.theme.slug, list)
  }
  return banks
}

function gradeOrderForSlug(gradeSlug?: GradeSlug): number {
  if (!gradeSlug) return 4
  return GRADE_ORDER[gradeSlug] ?? 4
}

function selectWordsWithFallback(
  bank: ThemeWordInput[],
  gradeOrder: number,
  difficulty: DifficultySlug,
  seed: number,
): string[] {
  const attempts: DifficultySlug[] =
    difficulty === "difficile"
      ? ["difficile", "moyen", "facile"]
      : difficulty === "moyen"
        ? ["moyen", "facile"]
        : ["facile"]

  const gradeOrders = [gradeOrder, 6, 4, 0]
  let lastError: unknown

  for (const order of gradeOrders) {
    for (const level of attempts) {
      try {
        return selectWordsFromBank(bank, order, level, seed)
      } catch (error) {
        lastError = error
      }
    }
  }

  throw lastError
}

export async function seedPuzzles(
  prisma: PrismaClient,
  categoryIdBySlug: Map<string, string>,
): Promise<{ puzzleCount: number; linkCount: number }> {
  const specs = buildPuzzlePlan()
  const wordBanks = await loadWordBanks(prisma)

  const difficultyIdBySlug = new Map(
    (await prisma.difficulty.findMany()).map((entry) => [entry.slug, entry.id]),
  )
  const gradeIdBySlug = new Map((await prisma.grade.findMany()).map((entry) => [entry.slug, entry.id]))
  const themeIdBySlug = new Map((await prisma.theme.findMany()).map((entry) => [entry.slug, entry.id]))

  const batchRequests = specs.map((spec) => {
    const bank = wordBanks.get(spec.themeSlug) ?? []
    const gradeOrder = gradeOrderForSlug(spec.gradeSlug)
    const words = selectWordsWithFallback(bank, gradeOrder, spec.difficulty, spec.seed)
    const options = resolveGenerateOptions({
      difficulty: spec.difficulty,
      grade: spec.gradeSlug,
      words,
      seed: spec.seed,
    })
    return { id: spec.id, options }
  })

  const batch = generatePuzzleBatch(batchRequests, { seedBase: 42_000, globalTimeBudgetMs: 300_000 })
  if (batch.failures.length > 0) {
    const summary = batch.failures
      .slice(0, 5)
      .map((failure) => `${failure.id}: ${failure.message}`)
      .join("; ")
    throw new Error(`Puzzle generation failed for ${batch.failures.length} specs. ${summary}`)
  }

  const resultById = new Map(batch.successes.map((entry) => [entry.id, entry.result]))
  let linkCount = 0

  for (const spec of specs) {
    const result = resultById.get(spec.id)
    if (!result) continue

    const themeName = themeSeed.find((entry) => entry.slug === spec.themeSlug)?.name ?? spec.themeSlug
    const payload = toPrismaPuzzlePayload(result, {
      slug: spec.slug,
      title: spec.title,
      difficultyId: difficultyIdBySlug.get(spec.difficulty)!,
      gradeId: spec.gradeSlug ? gradeIdBySlug.get(spec.gradeSlug) : undefined,
      themeId: themeIdBySlug.get(spec.themeSlug),
    })

    const puzzle = await prisma.puzzle.upsert({
      where: { slug: spec.slug },
      create: {
        ...payload,
        status: "PUBLISHED",
        viewCount: spec.viewCount,
        metaTitle: `Mots mêlés ${themeName} — ${spec.title}`,
        metaDescription: `Jouez et imprimez ce mots mêlés gratuit sur le thème ${themeName}. Grille ${result.size}×${result.size}, difficulté ${spec.difficulty}.`,
      },
      update: {
        title: payload.title,
        gridData: payload.gridData,
        wordList: payload.wordList,
        solutionData: payload.solutionData,
        size: payload.size,
        difficultyId: payload.difficultyId,
        gradeId: payload.gradeId ?? null,
        themeId: payload.themeId ?? null,
        status: "PUBLISHED",
        viewCount: spec.viewCount,
        metaTitle: `Mots mêlés ${themeName} — ${spec.title}`,
        metaDescription: `Jouez et imprimez ce mots mêlés gratuit sur le thème ${themeName}. Grille ${result.size}×${result.size}, difficulté ${spec.difficulty}.`,
      },
    })

    const categorySlugs = [...new Set(spec.categorySlugs)]
    for (const categorySlug of categorySlugs) {
      const categoryId = categoryIdBySlug.get(categorySlug)
      if (!categoryId) continue
      await prisma.categoryPuzzle.upsert({
        where: {
          categoryId_puzzleId: { categoryId, puzzleId: puzzle.id },
        },
        create: { categoryId, puzzleId: puzzle.id },
        update: {},
      })
      linkCount += 1
    }
  }

  // Press brand categories: link top puzzles per brand
  let pressIndex = 0
  for (const brand of MVP_PRESS_BRANDS) {
    const categoryId = categoryIdBySlug.get(brand.slug)
    if (!categoryId) continue
    const pressPuzzles = specs
      .filter((spec) => spec.themeSlug === "animaux" || spec.themeSlug === "sport")
      .slice(pressIndex, pressIndex + 4)
    for (const spec of pressPuzzles) {
      const puzzle = await prisma.puzzle.findUnique({ where: { slug: spec.slug } })
      if (!puzzle) continue
      await prisma.categoryPuzzle.upsert({
        where: { categoryId_puzzleId: { categoryId, puzzleId: puzzle.id } },
        create: { categoryId, puzzleId: puzzle.id },
        update: {},
      })
      linkCount += 1
    }
    pressIndex += 2
  }

  // Static support + audience pages: link representative puzzles
  const supportSlugs = [
    "pedagogie",
    "personnages",
    "application",
    "solutions",
    "jeux-magazines",
    "ressources-enseignants",
    "adultes",
    "seniors",
  ]
  const supportPuzzles = specs.slice(0, 6)
  for (const supportSlug of supportSlugs) {
    const categoryId = categoryIdBySlug.get(supportSlug)
    if (!categoryId) continue
    for (const spec of supportPuzzles) {
      const puzzle = await prisma.puzzle.findUnique({ where: { slug: spec.slug } })
      if (!puzzle) continue
      await prisma.categoryPuzzle.upsert({
        where: { categoryId_puzzleId: { categoryId, puzzleId: puzzle.id } },
        create: { categoryId, puzzleId: puzzle.id },
        update: {},
      })
      linkCount += 1
    }
  }

  return { puzzleCount: specs.length, linkCount }
}

export const EXPECTED_PUZZLE_COUNT_MIN = 100
export const EXPECTED_PUZZLE_COUNT_MAX = 150
