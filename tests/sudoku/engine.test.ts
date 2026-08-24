import { describe, expect, it } from "vitest"
import { SUDOKU_PUZZLES } from "@/lib/sudoku/puzzles"
import {
  cellKey,
  findIncorrectCells,
  getDayIndex,
  getPuzzleForDay,
  isCellCorrect,
  isGivenCell,
  isPuzzleComplete,
  isValidCompleteSolution,
} from "@/lib/sudoku/engine"

describe("sudoku — engine", () => {
  it("cellKey is stable and unique per coordinate", () => {
    expect(cellKey(0, 0)).toBe("0-0")
    expect(cellKey(3, 5)).not.toBe(cellKey(5, 3))
  })

  it("isGivenCell matches non-zero puzzle cells", () => {
    const puzzle = SUDOKU_PUZZLES[0]!
    expect(isGivenCell(puzzle, 0, 0)).toBe(puzzle.puzzle[0]![0] !== 0)
    expect(isGivenCell(puzzle, 0, 2)).toBe(puzzle.puzzle[0]![2] !== 0)
  })

  it("isCellCorrect only true when the filled value matches the solution", () => {
    const puzzle = SUDOKU_PUZZLES[0]!
    // find a blank cell
    let blankRow = -1
    let blankCol = -1
    outer: for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle.puzzle[r]![c] === 0) {
          blankRow = r
          blankCol = c
          break outer
        }
      }
    }
    const correctValue = puzzle.solution[blankRow]![blankCol]!
    const values = { [cellKey(blankRow, blankCol)]: correctValue }
    expect(isCellCorrect(puzzle, blankRow, blankCol, values)).toBe(true)

    const wrongValue = correctValue === 9 ? 1 : correctValue + 1
    const wrongValues = { [cellKey(blankRow, blankCol)]: wrongValue }
    expect(isCellCorrect(puzzle, blankRow, blankCol, wrongValues)).toBe(false)
  })

  it("isPuzzleComplete is true only when every blank cell is filled correctly", () => {
    const puzzle = SUDOKU_PUZZLES[0]!
    const allCorrect: Record<string, number> = {}
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!isGivenCell(puzzle, r, c)) {
          allCorrect[cellKey(r, c)] = puzzle.solution[r]![c]!
        }
      }
    }
    expect(isPuzzleComplete(puzzle, allCorrect)).toBe(true)
    expect(isPuzzleComplete(puzzle, {})).toBe(false)
  })

  it("findIncorrectCells flags only wrong filled cells, ignores given cells", () => {
    const puzzle = SUDOKU_PUZZLES[0]!
    let blankRow = -1
    let blankCol = -1
    outer: for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle.puzzle[r]![c] === 0) {
          blankRow = r
          blankCol = c
          break outer
        }
      }
    }
    const wrongValue = puzzle.solution[blankRow]![blankCol] === 9 ? 1 : puzzle.solution[blankRow]![blankCol]! + 1
    const values = { [cellKey(blankRow, blankCol)]: wrongValue }
    const wrong = findIncorrectCells(puzzle, values)
    expect(wrong.has(cellKey(blankRow, blankCol))).toBe(true)
    expect(wrong.size).toBe(1)
  })

  it("isValidCompleteSolution accepts every puzzle's own solution grid", () => {
    for (const puzzle of SUDOKU_PUZZLES) {
      expect(isValidCompleteSolution(puzzle.solution), puzzle.id).toBe(true)
    }
  })

  it("isValidCompleteSolution rejects an obviously broken grid", () => {
    const broken = Array.from({ length: 9 }, () => Array(9).fill(1))
    expect(isValidCompleteSolution(broken)).toBe(false)
  })

  it("getPuzzleForDay wraps around via modulo for any day index", () => {
    const size = SUDOKU_PUZZLES.length
    for (const dayIndex of [0, 1, size - 1, size, size * 3 + 2, -1, -size - 1]) {
      const puzzle = getPuzzleForDay(dayIndex, SUDOKU_PUZZLES)
      expect(SUDOKU_PUZZLES).toContain(puzzle)
    }
  })

  it("getDayIndex returns a stable integer for a fixed local date", () => {
    const d1 = getDayIndex(new Date(2026, 7, 20, 1, 0, 0))
    const d2 = getDayIndex(new Date(2026, 7, 20, 23, 0, 0))
    expect(d1).toBe(d2)
    expect(Number.isInteger(d1)).toBe(true)
  })
})
