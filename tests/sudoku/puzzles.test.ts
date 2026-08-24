import { describe, expect, it } from "vitest"
import { SUDOKU_PUZZLES } from "@/lib/sudoku/puzzles"
import { isValidCompleteSolution } from "@/lib/sudoku/engine"

describe("sudoku — puzzle data integrity", () => {
  it("every solution grid is a valid complete sudoku (rows/cols/boxes all 1–9)", () => {
    for (const puzzle of SUDOKU_PUZZLES) {
      expect(isValidCompleteSolution(puzzle.solution), puzzle.id).toBe(true)
    }
  })

  it("every non-blank puzzle cell matches the solution at that cell", () => {
    // This is the cheap, always-true-if-authored-correctly check. The
    // real "does removing these particular cells still leave exactly
    // one solution" guarantee was verified offline with a backtracking
    // solver at authoring time — see the comment in puzzles.ts. This
    // test can't re-prove that without porting the solver into the app,
    // which wasn't worth the scope for a 4-puzzle v1.
    for (const puzzle of SUDOKU_PUZZLES) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const given = puzzle.puzzle[r]![c]
          if (given === 0) continue
          expect(given, `${puzzle.id} at [${r},${c}]`).toBe(puzzle.solution[r]![c])
        }
      }
    }
  })

  it("puzzle grids are 9x9 with values in [0,9]", () => {
    for (const puzzle of SUDOKU_PUZZLES) {
      expect(puzzle.puzzle.length, puzzle.id).toBe(9)
      expect(puzzle.solution.length, puzzle.id).toBe(9)
      for (const row of puzzle.puzzle) {
        expect(row.length, puzzle.id).toBe(9)
        for (const v of row) expect(v).toBeGreaterThanOrEqual(0)
        for (const v of row) expect(v).toBeLessThanOrEqual(9)
      }
      for (const row of puzzle.solution) {
        expect(row.length, puzzle.id).toBe(9)
        for (const v of row) expect(v).toBeGreaterThanOrEqual(1)
        for (const v of row) expect(v).toBeLessThanOrEqual(9)
      }
    }
  })

  it("puzzle ids are unique", () => {
    const ids = SUDOKU_PUZZLES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("has at least one puzzle per documented tier", () => {
    const tiers = new Set(SUDOKU_PUZZLES.map((p) => p.tier))
    expect(tiers.has(1)).toBe(true)
    expect(tiers.has(2)).toBe(true)
  })

  it("harder tier has strictly fewer given cells than the easier tier (on average)", () => {
    const countGivens = (grid: number[][]) => grid.flat().filter((v) => v !== 0).length
    const easyAvg =
      SUDOKU_PUZZLES.filter((p) => p.tier === 1).reduce((sum, p) => sum + countGivens(p.puzzle), 0) /
      SUDOKU_PUZZLES.filter((p) => p.tier === 1).length
    const hardAvg =
      SUDOKU_PUZZLES.filter((p) => p.tier === 2).reduce((sum, p) => sum + countGivens(p.puzzle), 0) /
      SUDOKU_PUZZLES.filter((p) => p.tier === 2).length
    expect(hardAvg).toBeLessThan(easyAvg)
  })
})
