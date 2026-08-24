export type SudokuGrid = number[][] // 9x9, values 0–9 (0 = blank)

export type SudokuPuzzle = {
  id: string
  /** Small v1 scope, same spirit as mots coupés starting with 2 tiers —
   *  1 = facile, 2 = difficile. */
  tier: 1 | 2
  /** As shown to the player — 0 marks a cell to fill in. */
  puzzle: SudokuGrid
  /** The complete, correct solution. */
  solution: SudokuGrid
}

/**
 * IMPORTANT — how this data was produced (this matters more for sudoku
 * than for the other puzzle formats): a sudoku puzzle isn't just "pick
 * some numbers" — removing the wrong cells from a valid solution can
 * leave a puzzle with MORE THAN ONE valid completion, which is a
 * genuinely broken puzzle, not a stylistic choice. Hand-picking blanks
 * the way crossword/mots-coupés content was hand-picked isn't safe here
 * without checking.
 *
 * These 4 puzzles were generated and verified offline with a real
 * backtracking solver (not shipped as app code — this was an
 * authoring-time check, same spirit as the mots-coupés fragment-
 * collision check): two base solution grids were built from the
 * standard verified-valid construction
 * `(3*(r%3) + floor(r/3) + c) % 9 + 1`, a second grid was derived by a
 * digit relabeling of the first (a bijective 1↔9, 2↔8 … swap, which
 * preserves row/column/box validity), and for each difficulty tier
 * cells were removed ONE AT A TIME, re-solving after every single
 * removal and only keeping it if the puzzle still had EXACTLY one
 * solution. Every puzzle below passed that check for all of its blanks.
 * tests/sudoku/puzzles.test.ts re-verifies solution-grid validity and
 * puzzle/solution consistency on every test run; the full uniqueness
 * solve itself is not re-run in CI (it's an authoring-time guarantee,
 * not a runtime one — same tradeoff as the fragment-collision check).
 */
export const SUDOKU_PUZZLES: SudokuPuzzle[] = [
  {
    id: "facile-a",
    tier: 1,
    puzzle: [
      [1, 2, 0, 4, 0, 6, 7, 0, 9],
      [0, 0, 0, 7, 8, 9, 1, 0, 3],
      [7, 0, 9, 0, 2, 0, 4, 0, 6],
      [2, 3, 4, 0, 6, 7, 8, 9, 1],
      [0, 6, 0, 8, 0, 1, 0, 3, 0],
      [8, 9, 0, 2, 3, 0, 5, 0, 7],
      [3, 4, 0, 6, 7, 8, 9, 0, 2],
      [6, 7, 8, 9, 0, 0, 0, 0, 5],
      [9, 1, 2, 3, 0, 0, 0, 7, 0],
    ],
    solution: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 1, 2, 3],
      [7, 8, 9, 1, 2, 3, 4, 5, 6],
      [2, 3, 4, 5, 6, 7, 8, 9, 1],
      [5, 6, 7, 8, 9, 1, 2, 3, 4],
      [8, 9, 1, 2, 3, 4, 5, 6, 7],
      [3, 4, 5, 6, 7, 8, 9, 1, 2],
      [6, 7, 8, 9, 1, 2, 3, 4, 5],
      [9, 1, 2, 3, 4, 5, 6, 7, 8],
    ],
  },
  {
    id: "difficile-a",
    tier: 2,
    puzzle: [
      [0, 2, 0, 0, 5, 0, 0, 8, 0],
      [0, 5, 6, 0, 0, 9, 1, 0, 0],
      [0, 0, 9, 1, 0, 3, 4, 0, 0],
      [2, 0, 4, 0, 0, 7, 8, 9, 0],
      [0, 0, 0, 8, 0, 0, 0, 0, 0],
      [0, 9, 1, 0, 0, 4, 0, 6, 0],
      [0, 4, 5, 0, 0, 0, 9, 0, 0],
      [0, 7, 8, 0, 0, 0, 0, 4, 5],
      [9, 1, 0, 0, 0, 0, 6, 0, 0],
    ],
    solution: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 1, 2, 3],
      [7, 8, 9, 1, 2, 3, 4, 5, 6],
      [2, 3, 4, 5, 6, 7, 8, 9, 1],
      [5, 6, 7, 8, 9, 1, 2, 3, 4],
      [8, 9, 1, 2, 3, 4, 5, 6, 7],
      [3, 4, 5, 6, 7, 8, 9, 1, 2],
      [6, 7, 8, 9, 1, 2, 3, 4, 5],
      [9, 1, 2, 3, 4, 5, 6, 7, 8],
    ],
  },
  {
    id: "facile-b",
    tier: 1,
    puzzle: [
      [9, 8, 7, 0, 5, 0, 3, 0, 1],
      [6, 5, 0, 0, 2, 0, 0, 8, 7],
      [0, 2, 0, 0, 0, 7, 6, 5, 0],
      [8, 7, 6, 5, 4, 0, 2, 0, 0],
      [5, 4, 3, 0, 1, 0, 8, 0, 0],
      [0, 0, 9, 8, 7, 6, 0, 0, 3],
      [0, 6, 0, 4, 3, 2, 1, 0, 0],
      [0, 3, 2, 0, 9, 8, 7, 6, 5],
      [1, 9, 8, 7, 6, 0, 4, 3, 2],
    ],
    solution: [
      [9, 8, 7, 6, 5, 4, 3, 2, 1],
      [6, 5, 4, 3, 2, 1, 9, 8, 7],
      [3, 2, 1, 9, 8, 7, 6, 5, 4],
      [8, 7, 6, 5, 4, 3, 2, 1, 9],
      [5, 4, 3, 2, 1, 9, 8, 7, 6],
      [2, 1, 9, 8, 7, 6, 5, 4, 3],
      [7, 6, 5, 4, 3, 2, 1, 9, 8],
      [4, 3, 2, 1, 9, 8, 7, 6, 5],
      [1, 9, 8, 7, 6, 5, 4, 3, 2],
    ],
  },
  {
    id: "difficile-b",
    tier: 2,
    puzzle: [
      [0, 8, 7, 0, 0, 0, 3, 2, 1],
      [0, 0, 4, 0, 2, 0, 0, 8, 7],
      [0, 2, 0, 9, 8, 0, 0, 0, 0],
      [0, 7, 0, 5, 0, 0, 0, 0, 9],
      [0, 4, 3, 2, 0, 9, 0, 0, 0],
      [0, 1, 0, 0, 0, 6, 5, 4, 3],
      [0, 6, 0, 0, 0, 0, 0, 9, 0],
      [0, 0, 0, 1, 0, 0, 0, 6, 5],
      [0, 0, 8, 0, 0, 0, 4, 0, 0],
    ],
    solution: [
      [9, 8, 7, 6, 5, 4, 3, 2, 1],
      [6, 5, 4, 3, 2, 1, 9, 8, 7],
      [3, 2, 1, 9, 8, 7, 6, 5, 4],
      [8, 7, 6, 5, 4, 3, 2, 1, 9],
      [5, 4, 3, 2, 1, 9, 8, 7, 6],
      [2, 1, 9, 8, 7, 6, 5, 4, 3],
      [7, 6, 5, 4, 3, 2, 1, 9, 8],
      [4, 3, 2, 1, 9, 8, 7, 6, 5],
      [1, 9, 8, 7, 6, 5, 4, 3, 2],
    ],
  },
]

export function puzzlesForTier(tier: 1 | 2): SudokuPuzzle[] {
  return SUDOKU_PUZZLES.filter((p) => p.tier === tier)
}
