import { describe, it, expect } from "vitest"
import { MINI_CROSSWORD_GRIDS } from "../../lib/mini-crossword/grids"

function extract(grid: (string | null)[][], row: number, col: number, len: number, dir: "across" | "down"): string {
  let out = ""
  for (let i = 0; i < len; i++) {
    const r = dir === "across" ? row : row + i
    const c = dir === "across" ? col + i : col
    out += grid[r]?.[c] ?? "?"
  }
  return out
}

describe("MINI_CROSSWORD_GRIDS integrity", () => {
  it("has at least one grid per Force tier (1-5)", () => {
    const tiers = new Set(MINI_CROSSWORD_GRIDS.map((g) => g.tier))
    for (const tier of [1, 2, 3, 4, 5] as const) {
      expect(tiers.has(tier)).toBe(true)
    }
  })

  it("has no duplicate grid ids", () => {
    const ids = MINI_CROSSWORD_GRIDS.map((g) => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  for (const grid of MINI_CROSSWORD_GRIDS) {
    describe(`grid "${grid.id}" (Force ${grid.tier})`, () => {
      it("every across entry matches the letters actually in the grid", () => {
        for (const entry of grid.across) {
          expect(extract(grid.rows, entry.row, entry.col, entry.len, "across")).toBe(entry.answer)
        }
      })

      it("every down entry matches the letters actually in the grid", () => {
        for (const entry of grid.down) {
          expect(extract(grid.rows, entry.row, entry.col, entry.len, "down")).toBe(entry.answer)
        }
      })

      it("every entry has a non-empty clue", () => {
        for (const entry of [...grid.across, ...grid.down]) {
          expect(entry.clue.trim().length).toBeGreaterThan(0)
        }
      })

      it("every answer contains only unaccented A-Z letters", () => {
        for (const entry of [...grid.across, ...grid.down]) {
          expect(entry.answer).toMatch(/^[A-Z]+$/)
        }
      })
    })
  }
})
