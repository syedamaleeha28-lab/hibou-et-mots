import { generatePuzzle } from "./generate"
import { puzzleResultToLegacyGrid } from "./solution"
import { normalizeWord } from "./normalize"
import type { Grid } from "./types"
import { ALL_DIRECTIONS } from "./directions"

/**
 * @deprecated Use `generatePuzzle()` instead. Kept for homepage hero compatibility.
 */
export function generateGrid(
  rawWords: string[],
  size: number,
  allowDiagonals = true,
  seed = 1,
): Grid {
  const directions = allowDiagonals
    ? ALL_DIRECTIONS
    : (["HORIZONTAL", "VERTICAL"] as const)

  const result = generatePuzzle({
    words: rawWords,
    size,
    directions: [...directions],
    simplifyAccents: true,
    seed,
    maxAttemptsPerWord: 100,
    maxSize: size + 5,
    timeBudgetMs: 10_000,
  })

  return puzzleResultToLegacyGrid(result)
}

export { normalizeWord }
