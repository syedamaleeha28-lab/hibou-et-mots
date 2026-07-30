import { DAILY_WORD_LIST } from "./word-list"

export const WORD_LENGTH = 5
export const MAX_GUESSES = 6

export type LetterState = "correct" | "present" | "absent"

/** Epoch: day 0 of the rotation. Kept fixed so day indices never shift. */
const EPOCH_UTC_MS = Date.UTC(2024, 0, 1)

/**
 * Day index from a Date's local calendar day (Y/M/D), not the exact time —
 * so everyone gets a new word at their own local midnight, and everyone on
 * the same calendar date gets the same word regardless of timezone.
 */
export function getDayIndex(date: Date = new Date()): number {
  const localMidnightAsUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((localMidnightAsUtc - EPOCH_UTC_MS) / 86_400_000)
}

export function getWordForDay(dayIndex: number, words: string[] = DAILY_WORD_LIST): string {
  const size = words.length
  const idx = ((dayIndex % size) + size) % size
  return words[idx]!
}

function normalize(word: string): string {
  return word.trim().toUpperCase()
}

export function isValidGuessShape(guess: string): boolean {
  const normalized = normalize(guess)
  return normalized.length === WORD_LENGTH && /^[A-Z]+$/.test(normalized)
}

/**
 * Wordle-style two-pass evaluation: greens first, then yellows against the
 * *remaining* letter counts (so duplicate letters are scored correctly —
 * e.g. guessing a letter twice when the secret only has it once yields one
 * "present" and one "absent", not two "present").
 */
export function evaluateGuess(guess: string, secret: string): LetterState[] {
  const g = normalize(guess).split("")
  const s = normalize(secret).split("")
  const result: LetterState[] = new Array(g.length).fill("absent")
  const remaining: Record<string, number> = {}

  g.forEach((letter, i) => {
    if (letter === s[i]) {
      result[i] = "correct"
    } else {
      remaining[s[i]!] = (remaining[s[i]!] ?? 0) + 1
    }
  })

  g.forEach((letter, i) => {
    if (result[i] === "correct") return
    if ((remaining[letter] ?? 0) > 0) {
      result[i] = "present"
      remaining[letter]! -= 1
    }
  })

  return result
}

const STATE_RANK: Record<LetterState, number> = { absent: 0, present: 1, correct: 2 }

/** Best-known state per letter across all guesses so far, for keyboard coloring. */
export function buildKeyboardStates(
  guesses: string[],
  secret: string,
): Record<string, LetterState> {
  const states: Record<string, LetterState> = {}
  guesses.forEach((guess) => {
    const evaluation = evaluateGuess(guess, secret)
    normalize(guess)
      .split("")
      .forEach((letter, i) => {
        const state = evaluation[i]!
        if (!states[letter] || STATE_RANK[state] > STATE_RANK[states[letter]!]) {
          states[letter] = state
        }
      })
  })
  return states
}

export function buildShareGrid(guesses: string[], secret: string): string {
  const emoji: Record<LetterState, string> = { correct: "🟩", present: "🟨", absent: "⬛" }
  return guesses
    .map((guess) => evaluateGuess(guess, secret).map((state) => emoji[state]).join(""))
    .join("\n")
}
