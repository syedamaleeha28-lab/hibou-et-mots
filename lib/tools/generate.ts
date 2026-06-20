import {
  generatePuzzle,
  normalizeWord,
  resolveGenerateOptions,
  selectWordsFromBank,
  type DifficultySlug,
  type PuzzleResult,
  type ThemeWordInput,
} from "@/lib/puzzle-engine"
import { themeWordSeed } from "@/prisma/seed/theme-words"
import { resolveToolDirections } from "./directions"

export function parseWordList(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[\n,]+/)
        .map((word) => normalizeWord(word))
        .filter((word) => word.length >= 2),
    ),
  )
}

export function generateToolPuzzle(input: {
  words: string[]
  difficulty: DifficultySlug
  size: number
  allowDiagonals: boolean
  seed: number
}): PuzzleResult | null {
  if (input.words.length === 0) return null

  try {
    const base = resolveGenerateOptions({
      difficulty: input.difficulty,
      words: input.words,
      size: input.size,
      seed: input.seed,
    })
    const directions = resolveToolDirections(input.difficulty, input.allowDiagonals)

    return generatePuzzle({
      ...base,
      words: input.words,
      directions,
      seed: input.seed,
    })
  } catch {
    return null
  }
}

const themeWordBank = new Map<string, ThemeWordInput[]>()

for (const entry of themeWordSeed) {
  const list = themeWordBank.get(entry.themeSlug) ?? []
  list.push({
    word: entry.word,
    length: entry.word.length,
    minGradeOrder: entry.minGradeOrder,
  })
  themeWordBank.set(entry.themeSlug, list)
}

export function getThemeWordsForPlay(
  themeSlug: string,
  difficulty: DifficultySlug,
  seed: number,
): string[] {
  const bank = themeWordBank.get(themeSlug) ?? []
  if (bank.length === 0) return []

  const gradeOrders = [4, 6, 2, 0]
  const attempts: DifficultySlug[] =
    difficulty === "difficile"
      ? ["difficile", "moyen", "facile"]
      : difficulty === "moyen"
        ? ["moyen", "facile"]
        : ["facile"]

  for (const gradeOrder of gradeOrders) {
    for (const level of attempts) {
      try {
        return selectWordsFromBank(bank, gradeOrder, level, seed)
      } catch {
        // try next fallback
      }
    }
  }

  return []
}
