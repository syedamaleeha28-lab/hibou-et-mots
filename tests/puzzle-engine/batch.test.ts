import { describe, expect, it } from "vitest"
import {
  generatePuzzleBatch,
  PuzzleGenerationError,
  resolveGenerateOptions,
} from "@/lib/puzzle-engine"
import { themedWordSet } from "./fixtures/words"

describe("generatePuzzleBatch", () => {
  it("generates multiple puzzles with per-item failure reporting", () => {
    const requests = [
      {
        id: "ok-1",
        options: resolveGenerateOptions({
          difficulty: "facile",
          words: themedWordSet(1),
          seed: 1,
        }),
      },
      {
        id: "fail-1",
        options: {
          words: [],
          directions: ["HORIZONTAL"] as const,
        },
      },
      {
        id: "ok-2",
        options: resolveGenerateOptions({
          difficulty: "moyen",
          words: themedWordSet(2),
          seed: 2,
        }),
      },
    ]

    const batch = generatePuzzleBatch(requests, { seedBase: 100 })

    expect(batch.stats.succeeded).toBe(2)
    expect(batch.stats.failed).toBe(1)
    expect(batch.failures[0]?.code).toBe("EMPTY_WORD_LIST")
    expect(batch.failures[0]?.options).toBeDefined()
  })

  it("applies deterministic seedBase across batch runs", () => {
    const words = themedWordSet(1)
    const requests = [
      { id: "a", options: resolveGenerateOptions({ difficulty: "facile", words }) },
      { id: "b", options: resolveGenerateOptions({ difficulty: "facile", words }) },
    ]

    const runA = generatePuzzleBatch(requests, { seedBase: 50 })
    const runB = generatePuzzleBatch(requests, { seedBase: 50 })

    expect(runA.successes[0]?.result.grid).toEqual(runB.successes[0]?.result.grid)
    expect(runA.successes[1]?.result.grid).toEqual(runB.successes[1]?.result.grid)
  })

  it("rejects batches above maxBatchSize", () => {
    const requests = Array.from({ length: 5 }, (_, i) => ({
      id: `p-${i}`,
      options: resolveGenerateOptions({
        difficulty: "facile",
        words: themedWordSet(i),
      }),
    }))

    expect(() => generatePuzzleBatch(requests, { maxBatchSize: 3 })).toThrow(
      PuzzleGenerationError,
    )
  })
})
