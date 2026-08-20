import { describe, expect, it } from "vitest"
import { MOTS_COUPES_PUZZLES } from "@/lib/mots-coupes/puzzles"
import {
  getDayIndex,
  getPuzzleForDay,
  isDerangement,
  isMatch,
  isPuzzleComplete,
} from "@/lib/mots-coupes/engine"

describe("mots coupés — engine", () => {
  it("isMatch is true only for equal pair ids", () => {
    expect(isMatch("maison", "maison")).toBe(true)
    expect(isMatch("maison", "table")).toBe(false)
  })

  it("isPuzzleComplete requires every pair id present", () => {
    const puzzle = MOTS_COUPES_PUZZLES[0]!
    const allIds = new Set(puzzle.pairs.map((p) => p.id))
    expect(isPuzzleComplete(allIds, puzzle)).toBe(true)
    const partial = new Set([puzzle.pairs[0]!.id])
    expect(isPuzzleComplete(partial, puzzle)).toBe(false)
  })

  it("getPuzzleForDay wraps around via modulo for any day index", () => {
    const size = MOTS_COUPES_PUZZLES.length
    for (const dayIndex of [0, 1, size - 1, size, size * 3 + 2, -1, -size - 1]) {
      const puzzle = getPuzzleForDay(dayIndex, MOTS_COUPES_PUZZLES)
      expect(MOTS_COUPES_PUZZLES).toContain(puzzle)
    }
  })

  it("getDayIndex returns a stable integer for a fixed local date", () => {
    // Local Date constructor args (year, month, day, h, m, s) — not UTC ISO
    // strings, which can cross a local-day boundary depending on the
    // runner's timezone (caught in review: this exact mistake failed on a
    // UTC+4 machine with the previous version of this test). Matches the
    // pattern the crossword engine's own tests use, for the same reason —
    // getDayIndex is deliberately keyed to the visitor's LOCAL calendar
    // date, not UTC, so the daily puzzle rotates at local midnight.
    const d1 = getDayIndex(new Date(2026, 7, 20, 1, 0, 0))
    const d2 = getDayIndex(new Date(2026, 7, 20, 23, 0, 0))
    expect(d1).toBe(d2)
    expect(Number.isInteger(d1)).toBe(true)
  })

  describe("isDerangement", () => {
    it("rejects an order with a fixed point", () => {
      expect(isDerangement(["a", "b", "c"], ["a", "b", "c"])).toBe(false)
      expect(isDerangement(["b", "a", "c"], ["a", "b", "c"])).toBe(false) // c fixed
    })

    it("accepts a valid derangement", () => {
      expect(isDerangement(["b", "c", "a"], ["a", "b", "c"])).toBe(true)
    })

    it("rejects mismatched length, unknown ids, or duplicates", () => {
      expect(isDerangement(["a", "b"], ["a", "b", "c"])).toBe(false)
      expect(isDerangement(["a", "b", "z"], ["a", "b", "c"])).toBe(false)
      expect(isDerangement(["a", "a", "b"], ["a", "b", "c"])).toBe(false)
    })
  })
})
