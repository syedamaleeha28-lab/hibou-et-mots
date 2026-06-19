import { describe, expect, it } from "vitest"
import { generatePuzzleBatch, resolveGenerateOptions } from "@/lib/puzzle-engine"
import { themedWordSet } from "./fixtures/words"

describe("benchmark @benchmark", () => {
  it("generates 1,000 puzzles without excessive heap growth", () => {
    const heapBefore = process.memoryUsage().heapUsed

    const requests = Array.from({ length: 1000 }, (_, i) => ({
      id: `bench-${i}`,
      options: resolveGenerateOptions({
        difficulty: i % 3 === 0 ? "facile" : "moyen",
        words: themedWordSet(i % 10),
      }),
    }))

    const batch = generatePuzzleBatch(requests, {
      seedBase: 10_000,
      globalTimeBudgetMs: 300_000,
    })

    const heapAfter = process.memoryUsage().heapUsed
    const heapGrowthMb = (heapAfter - heapBefore) / (1024 * 1024)

    expect(batch.stats.succeeded).toBe(1000)
    expect(batch.stats.failed).toBe(0)
    expect(batch.totalElapsedMs).toBeLessThan(300_000)
    expect(heapGrowthMb).toBeLessThan(50)
  })
})
