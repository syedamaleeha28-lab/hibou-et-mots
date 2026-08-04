import { describe, it, expect } from "vitest"
import {
  getDayIndex,
  getGridForDay,
  entryCells,
  isEntryFilled,
  isEntryCorrect,
  isGridComplete,
  cellKey,
  type CellValues,
} from "../../lib/mini-crossword/engine"
import { MINI_CROSSWORD_GRIDS } from "../../lib/mini-crossword/grids"

describe("getDayIndex / getGridForDay", () => {
  it("is deterministic for the same calendar date", () => {
    const a = getDayIndex(new Date(2026, 6, 30, 1, 0, 0))
    const b = getDayIndex(new Date(2026, 6, 30, 23, 0, 0))
    expect(a).toBe(b)
  })

  it("wraps around the grid list without going out of bounds", () => {
    const grids = MINI_CROSSWORD_GRIDS
    expect(getGridForDay(0, grids)).toBe(grids[0])
    expect(getGridForDay(grids.length, grids)).toBe(grids[0])
    expect(getGridForDay(-1, grids)).toBe(grids[grids.length - 1])
  })
})

describe("entryCells", () => {
  it("computes across cells left to right", () => {
    const entry = { number: 1, row: 1, col: 0, len: 5, answer: "MONDE", clue: "" }
    expect(entryCells(entry, "across")).toEqual([
      { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
    ])
  })

  it("computes down cells top to bottom", () => {
    const entry = { number: 1, row: 0, col: 2, len: 3, answer: "ANE", clue: "" }
    expect(entryCells(entry, "down")).toEqual([
      { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 },
    ])
  })
})

describe("isEntryFilled / isEntryCorrect", () => {
  const entry = { number: 1, row: 1, col: 0, len: 3, answer: "RUE", clue: "" }

  it("reports not filled when a cell is empty", () => {
    const values: CellValues = { [cellKey(1, 0)]: "R", [cellKey(1, 1)]: "U" }
    expect(isEntryFilled(entry, "across", values)).toBe(false)
  })

  it("reports filled and correct when all letters match", () => {
    const values: CellValues = { [cellKey(1, 0)]: "R", [cellKey(1, 1)]: "U", [cellKey(1, 2)]: "E" }
    expect(isEntryFilled(entry, "across", values)).toBe(true)
    expect(isEntryCorrect(entry, "across", values)).toBe(true)
  })

  it("reports filled but incorrect when letters are wrong", () => {
    const values: CellValues = { [cellKey(1, 0)]: "R", [cellKey(1, 1)]: "U", [cellKey(1, 2)]: "X" }
    expect(isEntryFilled(entry, "across", values)).toBe(true)
    expect(isEntryCorrect(entry, "across", values)).toBe(false)
  })

  it("is case-insensitive", () => {
    const values: CellValues = { [cellKey(1, 0)]: "r", [cellKey(1, 1)]: "u", [cellKey(1, 2)]: "e" }
    expect(isEntryCorrect(entry, "across", values)).toBe(true)
  })
})

describe("isGridComplete", () => {
  it("returns true only when every across and down entry is correct", () => {
    const grid = MINI_CROSSWORD_GRIDS.find((g) => g.id === "rue")!
    const values: CellValues = {}
    // Fill in the full RUE grid correctly: across RUE + down ARC/BUT/PEU
    const solved: Record<string, string> = {
      "0-0": "A", "0-1": "B", "0-2": "P",
      "1-0": "R", "1-1": "U", "1-2": "E",
      "2-0": "C", "2-1": "T", "2-2": "U",
    }
    Object.assign(values, solved)
    expect(isGridComplete(grid, values)).toBe(true)

    const incomplete = { ...values, "2-2": "X" }
    expect(isGridComplete(grid, incomplete)).toBe(false)
  })
})
