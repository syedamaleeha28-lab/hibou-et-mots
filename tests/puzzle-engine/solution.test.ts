import { describe, expect, it } from "vitest"
import { generatePuzzle } from "@/lib/puzzle-engine"
import { ANIMAL_WORDS } from "./fixtures/words"

describe("solution data", () => {
  it("builds wordList and solutionData that match the grid", () => {
    const result = generatePuzzle({
      words: ANIMAL_WORDS.slice(0, 5),
      size: 10,
      directions: ["HORIZONTAL", "VERTICAL"],
      seed: 21,
    })

    for (const sw of result.solutionData.words) {
      const letters = sw.cells.map((c) => result.grid[c.row]![c.col]).join("")
      const placement = result.placements.find((p) => p.displayWord === sw.word)
      expect(letters).toBe(placement?.word)
    }
  })
})
