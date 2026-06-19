import { describe, expect, it } from "vitest"
import { generatePuzzle, validatePuzzle } from "@/lib/puzzle-engine"
import { ANIMAL_WORDS } from "./fixtures/words"

describe("validatePuzzle", () => {
  it("passes validation on a generated puzzle", () => {
    const result = generatePuzzle({
      words: ANIMAL_WORDS,
      size: 12,
      directions: ["HORIZONTAL", "VERTICAL", "DIAGONAL_DESCENDANTE"],
      seed: 3,
    })

    const report = validatePuzzle(result)
    expect(report.valid).toBe(true)
    expect(report.errors).toHaveLength(0)
  })

  it("detects a corrupted grid", () => {
    const result = generatePuzzle({
      words: ANIMAL_WORDS.slice(0, 4),
      size: 10,
      directions: ["HORIZONTAL", "VERTICAL"],
      seed: 11,
    })

    const target = result.placements[0]!.cells[0]!
    result.grid[target.r]![target.c] = "Z"
    const report = validatePuzzle(result)
    expect(report.valid).toBe(false)
    expect(report.errors.some((e) => e.code === "GRID_PLACEMENT_MISMATCH")).toBe(true)
  })
})
