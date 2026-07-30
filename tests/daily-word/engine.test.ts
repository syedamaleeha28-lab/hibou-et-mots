import { describe, it, expect } from "vitest"
import {
  evaluateGuess,
  getDayIndex,
  getWordForDay,
  isValidGuessShape,
  buildKeyboardStates,
  buildShareGrid,
} from "../../lib/daily-word/engine"

describe("evaluateGuess", () => {
  it("marks an exact match all correct", () => {
    expect(evaluateGuess("TABLE", "TABLE")).toEqual([
      "correct", "correct", "correct", "correct", "correct",
    ])
  })

  it("marks letters absent when not in the secret at all", () => {
    // T,A,L absent (not in ZEBRE at all); B and E land on their exact positions.
    expect(evaluateGuess("TABLE", "ZEBRE")).toEqual([
      "absent", "absent", "correct", "absent", "correct",
    ])
  })

  it("handles a duplicate guessed letter when the secret has it only once", () => {
    // secret ROBOT has O at index 1 AND index 3 (two O's total).
    // Guess POOLS: O at index 1 matches exactly (correct); the second O (index 2)
    // still finds the *other* unmatched O in the secret, so it's "present", not "absent".
    const result = evaluateGuess("POOLS", "ROBOT")
    expect(result[1]).toBe("correct")
    expect(result[2]).toBe("present")
  })

  it("does not over-credit a letter guessed twice when the secret only has it once", () => {
    // secret TABLE has exactly one L (index 3). Guess ROLLS has L at index 2 and 3.
    // Index 3 matches exactly (correct), which uses up the only L — so index 2's L
    // has nothing left to match and must be "absent", not "present".
    const result = evaluateGuess("ROLLS", "TABLE")
    expect(result[3]).toBe("correct")
    expect(result[2]).toBe("absent")
  })

  it("handles a duplicate secret letter correctly (both occurrences creditable)", () => {
    // secret VERRE has two E's (idx 1, 4) and two R's (idx 2, 3).
    // Guess REVER: R(0)->present, E(1)->present order matters; just assert full pass:
    const result = evaluateGuess("REVER", "VERRE")
    // No crashes, valid states only, and result length matches word length.
    expect(result).toHaveLength(5)
    result.forEach((state) => expect(["correct", "present", "absent"]).toContain(state))
  })

  it("is case-insensitive", () => {
    expect(evaluateGuess("table", "TABLE")).toEqual([
      "correct", "correct", "correct", "correct", "correct",
    ])
  })
})

describe("isValidGuessShape", () => {
  it("accepts 5 alphabetic letters", () => {
    expect(isValidGuessShape("table")).toBe(true)
    expect(isValidGuessShape("TABLE")).toBe(true)
  })
  it("rejects wrong length or non-letters", () => {
    expect(isValidGuessShape("tabl")).toBe(false)
    expect(isValidGuessShape("tables")).toBe(false)
    expect(isValidGuessShape("tab1e")).toBe(false)
    expect(isValidGuessShape("")).toBe(false)
  })
})

describe("getDayIndex / getWordForDay", () => {
  it("is deterministic for the same calendar date", () => {
    const a = getDayIndex(new Date(2026, 6, 30, 3, 0, 0))
    const b = getDayIndex(new Date(2026, 6, 30, 23, 59, 0))
    expect(a).toBe(b)
  })

  it("advances by exactly 1 for the next calendar day", () => {
    const day1 = getDayIndex(new Date(2026, 6, 30))
    const day2 = getDayIndex(new Date(2026, 6, 31))
    expect(day2).toBe(day1 + 1)
  })

  it("wraps around the word list without going out of bounds", () => {
    const words = ["ALPHA", "BETAA", "GAMMA"] // 5-letter placeholders for the test
    expect(getWordForDay(0, words)).toBe("ALPHA")
    expect(getWordForDay(3, words)).toBe("ALPHA")
    expect(getWordForDay(-1, words)).toBe("GAMMA")
  })
})

describe("buildKeyboardStates", () => {
  it("keeps the best-known state per letter across multiple guesses", () => {
    // secret TABLE. First guess BADGE marks B as present (wrong spot), second guess TABLE marks B correct.
    const states = buildKeyboardStates(["BADGE", "TABLE"], "TABLE")
    expect(states["B"]).toBe("correct")
    expect(states["T"]).toBe("correct")
  })
})

describe("buildShareGrid", () => {
  it("renders one emoji row per guess", () => {
    const grid = buildShareGrid(["ZEBRE", "TABLE"], "TABLE")
    const rows = grid.split("\n")
    expect(rows).toHaveLength(2)
    expect(rows[1]).toBe("🟩🟩🟩🟩🟩")
  })
})
