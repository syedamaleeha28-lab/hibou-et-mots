import type {
  DifficultySlug,
  Direction,
  GenerateOptions,
  GradeSlug,
  ThemeWordInput,
} from "./types"
import { PuzzleGenerationError } from "./errors"
import { randomInt, createRng } from "./rng"

/** Mirrors prisma/seed/difficulties.ts — keep in sync. */
export const DIFFICULTY_PRESETS: Record<
  DifficultySlug,
  {
    gridSizeMin: number
    gridSizeMax: number
    wordCountMin: number
    wordCountMax: number
    directions: Direction[]
    timeBudgetMs: number
  }
> = {
  facile: {
    gridSizeMin: 8,
    gridSizeMax: 8,
    wordCountMin: 6,
    wordCountMax: 8,
    directions: ["HORIZONTAL", "VERTICAL"],
    timeBudgetMs: 3000,
  },
  moyen: {
    gridSizeMin: 10,
    gridSizeMax: 10,
    wordCountMin: 8,
    wordCountMax: 10,
    directions: ["HORIZONTAL", "VERTICAL", "DIAGONAL_DESCENDANTE", "DIAGONAL_MONTANTE"],
    timeBudgetMs: 5000,
  },
  difficile: {
    gridSizeMin: 12,
    gridSizeMax: 15,
    wordCountMin: 12,
    wordCountMax: 15,
    directions: [
      "HORIZONTAL",
      "HORIZONTAL_INVERSE",
      "VERTICAL",
      "VERTICAL_INVERSE",
      "DIAGONAL_DESCENDANTE",
      "DIAGONAL_DESCENDANTE_INVERSE",
      "DIAGONAL_MONTANTE",
      "DIAGONAL_MONTANTE_INVERSE",
    ],
    timeBudgetMs: 8000,
  },
  geant: {
    gridSizeMin: 18,
    gridSizeMax: 20,
    wordCountMin: 18,
    wordCountMax: 25,
    directions: [
      "HORIZONTAL",
      "HORIZONTAL_INVERSE",
      "VERTICAL",
      "VERTICAL_INVERSE",
      "DIAGONAL_DESCENDANTE",
      "DIAGONAL_DESCENDANTE_INVERSE",
      "DIAGONAL_MONTANTE",
      "DIAGONAL_MONTANTE_INVERSE",
    ],
    timeBudgetMs: 15000,
  },
}

export const GRADE_ORDER: Record<GradeSlug, number> = {
  maternelle: 0,
  cp: 1,
  ce1: 2,
  ce2: 3,
  cm1: 4,
  cm2: 5,
  "6e": 6,
}

export const GRADE_DEFAULT_GRID_SIZE: Record<GradeSlug, number> = {
  maternelle: 8,
  cp: 8,
  ce1: 10,
  ce2: 10,
  cm1: 12,
  cm2: 12,
  "6e": 15,
}

/** PRD Section 7 — approximate word length bounds by grade order. */
export const GRADE_WORD_LENGTH: Record<number, { min: number; max: number }> = {
  0: { min: 3, max: 5 },
  1: { min: 3, max: 6 },
  2: { min: 4, max: 7 },
  3: { min: 4, max: 8 },
  4: { min: 5, max: 9 },
  5: { min: 5, max: 10 },
  6: { min: 6, max: 12 },
}

export function shouldSimplifyAccents(grade?: GradeSlug): boolean {
  if (!grade) return true
  return grade === "maternelle" || grade === "cp" || grade === "ce1"
}

export function resolveGridSize(
  difficulty: DifficultySlug,
  grade?: GradeSlug,
  explicitSize?: number,
  rng?: () => number,
): number {
  if (explicitSize !== undefined) return explicitSize

  const preset = DIFFICULTY_PRESETS[difficulty]
  if (preset.gridSizeMin === preset.gridSizeMax) return preset.gridSizeMin

  if (grade) {
    const gradeSize = GRADE_DEFAULT_GRID_SIZE[grade]
    const clamped = Math.min(
      preset.gridSizeMax,
      Math.max(preset.gridSizeMin, gradeSize),
    )
    return clamped
  }

  const random = rng ?? createRng(1)
  return randomInt(random, preset.gridSizeMin, preset.gridSizeMax)
}

export function resolveGenerateOptions(input: {
  difficulty: DifficultySlug
  grade?: GradeSlug
  words?: string[]
  size?: number
  seed?: number
  simplifyAccents?: boolean
}): GenerateOptions {
  const preset = DIFFICULTY_PRESETS[input.difficulty]
  const rng = createRng(input.seed)
  const size = resolveGridSize(input.difficulty, input.grade, input.size, rng)

  return {
    words: input.words ?? [],
    size,
    directions: [...preset.directions],
    maxAttemptsPerWord: 100,
    maxSize: input.difficulty === "geant" ? 25 : 22,
    simplifyAccents: input.simplifyAccents ?? shouldSimplifyAccents(input.grade),
    seed: input.seed,
    timeBudgetMs: preset.timeBudgetMs,
  }
}

export function selectWordsFromBank(
  bank: ThemeWordInput[],
  gradeOrder: number,
  difficulty: DifficultySlug,
  seed?: number,
): string[] {
  const preset = DIFFICULTY_PRESETS[difficulty]
  const lengthBounds = GRADE_WORD_LENGTH[gradeOrder] ?? { min: 3, max: 12 }
  const rng = createRng(seed)

  const eligible = bank.filter(
    (w) =>
      w.minGradeOrder <= gradeOrder &&
      w.length >= lengthBounds.min &&
      w.length <= lengthBounds.max,
  )

  if (eligible.length < preset.wordCountMin) {
    throw new PuzzleGenerationError(
      "INSUFFICIENT_WORD_BANK",
      `Banque insuffisante: ${eligible.length} mots éligibles, ${preset.wordCountMin} requis.`,
    )
  }

  const shuffled = [...eligible]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }

  const count = randomInt(rng, preset.wordCountMin, Math.min(preset.wordCountMax, shuffled.length))
  return shuffled.slice(0, count).map((w) => w.word)
}
