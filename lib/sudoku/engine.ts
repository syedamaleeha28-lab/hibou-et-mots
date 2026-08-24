import { SUDOKU_PUZZLES, type SudokuPuzzle } from "./puzzles"

/** Separate epoch from the daily word game, crossword, and mots coupés
 *  epochs, so all four daily rotations are independent of each other. */
const EPOCH_UTC_MS = Date.UTC(2024, 8, 1)

export function getDayIndex(date: Date = new Date()): number {
  const localMidnightAsUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((localMidnightAsUtc - EPOCH_UTC_MS) / 86_400_000)
}

export function getPuzzleForDay(
  dayIndex: number,
  puzzles: SudokuPuzzle[] = SUDOKU_PUZZLES,
): SudokuPuzzle {
  const size = puzzles.length
  const idx = ((dayIndex % size) + size) % size
  return puzzles[idx]!
}

export function cellKey(row: number, col: number): string {
  return `${row}-${col}`
}

export function isGivenCell(puzzle: SudokuPuzzle, row: number, col: number): boolean {
  return puzzle.puzzle[row]![col] !== 0
}

/** Cell values keyed by "row-col", as typed by the player so far
 *  (given cells are not stored here — they're read directly from the
 *  puzzle). */
export type SudokuCellValues = Record<string, number>

export function isCellCorrect(
  puzzle: SudokuPuzzle,
  row: number,
  col: number,
  values: SudokuCellValues,
): boolean {
  const value = values[cellKey(row, col)]
  if (!value) return false
  return value === puzzle.solution[row]![col]
}

export function isPuzzleComplete(puzzle: SudokuPuzzle, values: SudokuCellValues): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (isGivenCell(puzzle, r, c)) continue
      if (!isCellCorrect(puzzle, r, c, values)) return false
    }
  }
  return true
}

/** Every currently-filled (non-given) cell that's wrong — used by the
 *  "Vérifier" button to highlight mistakes, same UX pattern as the
 *  crossword's check button. */
export function findIncorrectCells(
  puzzle: SudokuPuzzle,
  values: SudokuCellValues,
): Set<string> {
  const wrong = new Set<string>()
  for (const key of Object.keys(values)) {
    const [rowStr, colStr] = key.split("-")
    const row = Number(rowStr)
    const col = Number(colStr)
    if (isGivenCell(puzzle, row, col)) continue
    if (!isCellCorrect(puzzle, row, col, values)) wrong.add(key)
  }
  return wrong
}

/** Basic structural validation, used by tests — confirms a completed
 *  9x9 grid is a valid sudoku solution (every row/column/3x3 box
 *  contains each digit 1–9 exactly once). Does NOT check puzzle-solution
 *  uniqueness — that was verified offline at authoring time, see the
 *  comment in puzzles.ts. */
export function isValidCompleteSolution(grid: number[][]): boolean {
  const isOneToNine = (values: number[]) =>
    JSON.stringify([...values].sort((a, b) => a - b)) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9])

  for (let i = 0; i < 9; i++) {
    const row = grid[i]!
    const col = grid.map((r) => r[i]!)
    if (!isOneToNine(row)) return false
    if (!isOneToNine(col)) return false
  }
  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      const box: number[] = []
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          box.push(grid[br + i]![bc + j]!)
        }
      }
      if (!isOneToNine(box)) return false
    }
  }
  return true
}
