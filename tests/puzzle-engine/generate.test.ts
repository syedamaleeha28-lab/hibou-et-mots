import { describe, expect, it } from "vitest"
import {
  generateGrid,
  generatePuzzle,
  PuzzleGenerationError,
} from "@/lib/puzzle-engine"
import { ANIMAL_WORDS, IMPOSSIBLE_WORDS, LONG_WORD } from "./fixtures/words"

describe("generatePuzzle", () => {
  it("rejects an empty word list", () => {
    expect(() =>
      generatePuzzle({
        words: [],
        directions: ["HORIZONTAL", "VERTICAL"],
      }),
    ).toThrow(PuzzleGenerationError)
  })

  it("auto-increases grid size for a long word", () => {
    const result = generatePuzzle({
      words: [LONG_WORD],
      size: 8,
      directions: ["HORIZONTAL", "VERTICAL"],
      seed: 42,
    })

    expect(result.size).toBeGreaterThanOrEqual(LONG_WORD.length)
    expect(result.wordList).toHaveLength(1)
  })

  it("fails cleanly on an impossible word set", () => {
    expect(() =>
      generatePuzzle({
        words: IMPOSSIBLE_WORDS,
        size: 8,
        directions: ["HORIZONTAL", "VERTICAL"],
        maxSize: 12,
        timeBudgetMs: 3000,
        seed: 1,
      }),
    ).toThrow(PuzzleGenerationError)
  })

  it("produces deterministic output with the same seed", () => {
    const opts = {
      words: ANIMAL_WORDS,
      size: 10,
      directions: ["HORIZONTAL", "VERTICAL", "DIAGONAL_DESCENDANTE"] as const,
      seed: 99,
    }

    const a = generatePuzzle({ ...opts, directions: [...opts.directions] })
    const b = generatePuzzle({ ...opts, directions: [...opts.directions] })

    expect(a.grid).toEqual(b.grid)
    expect(a.wordList).toEqual(b.wordList)
  })

  it("places every requested word", () => {
    const result = generatePuzzle({
      words: ANIMAL_WORDS,
      size: 12,
      directions: [
        "HORIZONTAL",
        "VERTICAL",
        "DIAGONAL_DESCENDANTE",
        "DIAGONAL_MONTANTE",
      ],
      seed: 7,
    })

    expect(result.placements).toHaveLength(ANIMAL_WORDS.length)
    expect(result.wordList).toHaveLength(ANIMAL_WORDS.length)
  })
})

describe("generateGrid compat", () => {
  it("returns legacy grid shape for the homepage", () => {
    const grid = generateGrid(ANIMAL_WORDS.slice(0, 6), 10, true, 7)
    expect(grid.letters).toHaveLength(10)
    expect(grid.placements.length).toBeGreaterThan(0)
    expect(grid.placements[0]?.cells.length).toBeGreaterThan(1)
  })

  it("uses only horizontal and vertical when diagonals are disabled", () => {
    const result = generatePuzzle({
      words: ANIMAL_WORDS.slice(0, 6),
      size: 10,
      directions: ["HORIZONTAL", "VERTICAL"],
      seed: 5,
    })

    for (const entry of result.wordList) {
      expect(["HORIZONTAL", "VERTICAL"]).toContain(entry.direction)
    }
  })
})
