import { describe, expect, it } from "vitest"
import { createRng, weightedRandomLetter } from "@/lib/puzzle-engine"

describe("French letter frequency", () => {
  it("favours common letters over rare ones", () => {
    const rng = createRng(123)
    const counts: Record<string, number> = {}

    for (let i = 0; i < 10_000; i++) {
      const letter = weightedRandomLetter(rng)
      counts[letter] = (counts[letter] ?? 0) + 1
    }

    expect(counts.E ?? 0).toBeGreaterThan(counts.K ?? 0)
    expect(counts.A ?? 0).toBeGreaterThan(counts.Y ?? 0)
  })
})
