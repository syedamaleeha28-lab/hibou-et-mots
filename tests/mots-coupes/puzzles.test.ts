import { describe, expect, it } from "vitest"
import { MOTS_COUPES_PUZZLES } from "@/lib/mots-coupes/puzzles"
import { isDerangement } from "@/lib/mots-coupes/engine"

describe("mots coupés — puzzle data integrity", () => {
  it("every pair's part1 + part2 reconstructs its own word", () => {
    for (const puzzle of MOTS_COUPES_PUZZLES) {
      for (const pair of puzzle.pairs) {
        expect(pair.part1 + pair.part2, `${puzzle.id}/${pair.id}`).toBe(pair.word)
      }
    }
  })

  it("every puzzle's part2Order is a valid derangement of its pair ids", () => {
    for (const puzzle of MOTS_COUPES_PUZZLES) {
      const canonicalIds = puzzle.pairs.map((p) => p.id)
      expect(isDerangement(puzzle.part2Order, canonicalIds), puzzle.id).toBe(true)
    }
  })

  it("words are uppercase with no accented characters (house convention)", () => {
    for (const puzzle of MOTS_COUPES_PUZZLES) {
      for (const pair of puzzle.pairs) {
        expect(pair.word).toBe(pair.word.toUpperCase())
        expect(pair.word).toMatch(/^[A-Z]+$/)
      }
    }
  })

  it("no unintended fragment combination within a puzzle spells a DIFFERENT pair's word", () => {
    // This is the real safety net for the by-hand collision analysis done
    // when authoring puzzles.ts — if two fragments from different pairs
    // happen to combine into a string equal to some OTHER pair's target
    // word, that's a genuine ambiguous-puzzle bug, not just a stray
    // non-word coincidence (which is fine and expected).
    for (const puzzle of MOTS_COUPES_PUZZLES) {
      const words = new Set(puzzle.pairs.map((p) => p.word))
      for (const a of puzzle.pairs) {
        for (const b of puzzle.pairs) {
          const combo = a.part1 + b.part2
          const isIntended = a.id === b.id
          if (!isIntended && words.has(combo)) {
            throw new Error(
              `Ambiguous puzzle "${puzzle.id}": ${a.id}'s part1 ("${a.part1}") + ${b.id}'s part2 ("${b.part2}") = "${combo}", which equals another pair's target word.`,
            )
          }
        }
      }
      expect(true).toBe(true) // reached without throwing
    }
  })

  it("puzzle ids and pair ids are unique", () => {
    const puzzleIds = MOTS_COUPES_PUZZLES.map((p) => p.id)
    expect(new Set(puzzleIds).size).toBe(puzzleIds.length)

    for (const puzzle of MOTS_COUPES_PUZZLES) {
      const pairIds = puzzle.pairs.map((p) => p.id)
      expect(new Set(pairIds).size, puzzle.id).toBe(pairIds.length)
    }
  })

  it("has at least one puzzle per documented tier", () => {
    const tiers = new Set(MOTS_COUPES_PUZZLES.map((p) => p.tier))
    expect(tiers.has(1)).toBe(true)
    expect(tiers.has(2)).toBe(true)
    expect(tiers.has(3)).toBe(true)
  })
})
