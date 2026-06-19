import { describe, expect, it } from "vitest"
import {
  DIFFICULTY_PRESETS,
  resolveGenerateOptions,
  selectWordsFromBank,
  shouldSimplifyAccents,
} from "@/lib/puzzle-engine"
import { difficultySeed } from "@/prisma/seed/difficulties"

describe("difficulty presets", () => {
  it("matches prisma seed data", () => {
    for (const seed of difficultySeed) {
      const preset = DIFFICULTY_PRESETS[seed.slug as keyof typeof DIFFICULTY_PRESETS]
      expect(preset.gridSizeMin).toBe(seed.gridSizeMin)
      expect(preset.gridSizeMax).toBe(seed.gridSizeMax)
      expect(preset.wordCountMin).toBe(seed.wordCountMin)
      expect(preset.directions).toEqual(seed.directions)
    }
  })

  it("simplifies accents for young grades", () => {
    expect(shouldSimplifyAccents("cp")).toBe(true)
    expect(shouldSimplifyAccents("cm2")).toBe(false)
  })

  it("resolves facile options with horizontal and vertical only", () => {
    const opts = resolveGenerateOptions({
      difficulty: "facile",
      words: ["CHAT", "CHIEN", "LION", "ZEBRE", "TIGRE", "OURS"],
      seed: 1,
    })

    expect(opts.size).toBe(8)
    expect(opts.directions).toEqual(["HORIZONTAL", "VERTICAL"])
  })

  it("throws when the word bank is too small", () => {
    expect(() =>
      selectWordsFromBank(
        [{ word: "CHAT", length: 4, minGradeOrder: 0 }],
        0,
        "facile",
        1,
      ),
    ).toThrow()
  })
})
