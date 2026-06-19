import { describe, expect, it } from "vitest"
import { generatePuzzle, normalizeWord } from "@/lib/puzzle-engine"
import { ACCENTED_WORDS } from "./fixtures/words"

describe("normalize", () => {
  it("maps accented French words to ASCII when simplifyAccents is true", () => {
    expect(normalizeWord("ÉCOLE", true)).toBe("ECOLE")
    expect(normalizeWord("NOËL", true)).toBe("NOEL")
    expect(normalizeWord("FORÊT", true)).toBe("FORET")
  })

  it("strips accents in the grid when simplifyAccents is true", () => {
    const result = generatePuzzle({
      words: ACCENTED_WORDS,
      size: 10,
      directions: ["HORIZONTAL", "VERTICAL"],
      simplifyAccents: true,
      seed: 8,
    })

    for (const placement of result.placements) {
      expect(placement.word).toBe(normalizeWord(placement.displayWord, true))
    }

    for (const entry of result.wordList) {
      expect(entry.word).not.toMatch(/[À-ÿ]/)
    }
  })
})
