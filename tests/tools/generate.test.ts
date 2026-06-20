import { describe, expect, it } from "vitest"
import {
  generateToolPuzzle,
  getThemeWordsForPlay,
  parseWordList,
} from "@/lib/tools/generate"

describe("tool puzzle generation", () => {
  it("parses comma and newline separated words", () => {
    expect(parseWordList("chat, chien\nLION")).toEqual(["CHAT", "CHIEN", "LION"])
  })

  it("generates a playable puzzle from custom words", () => {
    const result = generateToolPuzzle({
      words: ["CHAT", "CHIEN", "LION", "OURS", "LOUP", "RENARD"],
      difficulty: "facile",
      size: 8,
      allowDiagonals: false,
      seed: 42,
    })

    expect(result).not.toBeNull()
    expect(result?.grid.length).toBeGreaterThan(0)
    expect(result?.solutionData.words.length).toBeGreaterThan(0)
  })

  it("loads theme words for online play", () => {
    const words = getThemeWordsForPlay("animaux", "facile", 7)
    expect(words.length).toBeGreaterThanOrEqual(6)
  })
})
