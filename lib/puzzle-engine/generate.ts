import { fillEmptyCells } from "./alphabet"
import { createEmptyGrid, tryPlaceWordRandom } from "./place"
import { prepareWords } from "./normalize"
import { buildSolutionData, buildWordList } from "./solution"
import { validatePuzzle } from "./validate"
import { PuzzleGenerationError } from "./errors"
import { createRng } from "./rng"
import type { GenerateOptions, PuzzleResult } from "./types"

const DEFAULT_MAX_ATTEMPTS = 100
const DEFAULT_MAX_SIZE = 25
const DEFAULT_TIME_BUDGET_MS = 5000

export function generatePuzzle(options: GenerateOptions): PuzzleResult {
  const {
    words: rawWords,
    directions,
    maxAttemptsPerWord = DEFAULT_MAX_ATTEMPTS,
    maxSize = DEFAULT_MAX_SIZE,
    simplifyAccents = true,
    timeBudgetMs = DEFAULT_TIME_BUDGET_MS,
    seed,
  } = options

  if (!rawWords.length) {
    throw new PuzzleGenerationError("EMPTY_WORD_LIST", "La liste de mots est vide.")
  }

  const rng = createRng(seed)
  const startedAt = Date.now()

  let size = options.size ?? 8
  if (size < 2) size = 2

  while (size <= maxSize) {
    if (Date.now() - startedAt > timeBudgetMs) {
      throw new PuzzleGenerationError(
        "TIME_BUDGET_EXCEEDED",
        `Dépassement du budget temps (${timeBudgetMs} ms) lors de la génération.`,
      )
    }

    const prepared = prepareWords(rawWords, simplifyAccents, size)
    if (!prepared.length) {
      size += 1
      continue
    }

    const grid = createEmptyGrid(size)
    const placements = []
    let failed = false

    for (const word of prepared) {
      if (Date.now() - startedAt > timeBudgetMs) {
        throw new PuzzleGenerationError(
          "TIME_BUDGET_EXCEEDED",
          `Dépassement du budget temps (${timeBudgetMs} ms) lors du placement.`,
        )
      }

      const placement = tryPlaceWordRandom(
        grid,
        word,
        directions,
        size,
        maxAttemptsPerWord,
        rng,
      )

      if (!placement) {
        failed = true
        break
      }

      placements.push(placement)
    }

    if (!failed) {
      const filled = fillEmptyCells(grid, rng)
      const wordList = buildWordList(placements, simplifyAccents)
      const solutionData = buildSolutionData(placements, size, simplifyAccents)

      const result: PuzzleResult = {
        grid: filled,
        size,
        placements,
        wordList,
        solutionData,
        warnings: [],
      }

      const report = validatePuzzle(result)
      result.warnings = report.warnings

      if (!report.valid) {
        throw new PuzzleGenerationError(
          "PLACEMENT_FAILED",
          `Grille invalide après génération: ${report.errors.map((e) => e.code).join(", ")}`,
        )
      }

      return result
    }

    size += 1
  }

  throw new PuzzleGenerationError(
    "PLACEMENT_FAILED",
    `Impossible de placer tous les mots (taille max ${maxSize} atteinte).`,
  )
}
