import { randomInt } from "./rng"

/** French letter frequency weights (26-letter Latin alphabet, accent-stripped grids). */
export const FRENCH_LETTER_WEIGHTS: Readonly<Record<string, number>> = {
  E: 174,
  A: 82,
  S: 79,
  I: 75,
  N: 71,
  R: 66,
  T: 63,
  O: 50,
  L: 49,
  U: 44,
  D: 42,
  C: 36,
  M: 33,
  P: 31,
  G: 12,
  B: 11,
  V: 11,
  H: 10,
  F: 10,
  Q: 9,
  J: 5,
  X: 3,
  Z: 3,
  K: 2,
  W: 2,
  Y: 1,
}

const LETTERS = Object.keys(FRENCH_LETTER_WEIGHTS)
const TOTAL_WEIGHT = LETTERS.reduce((sum, l) => sum + FRENCH_LETTER_WEIGHTS[l]!, 0)

export function weightedRandomLetter(rng: () => number): string {
  let roll = rng() * TOTAL_WEIGHT
  for (const letter of LETTERS) {
    roll -= FRENCH_LETTER_WEIGHTS[letter]!
    if (roll <= 0) return letter
  }
  return "E"
}

export function fillEmptyCells(
  grid: (string | null)[][],
  rng: () => number,
): string[][] {
  return grid.map((row) =>
    row.map((cell) => cell ?? weightedRandomLetter(rng)),
  )
}

/** Uniform A–Z — used only by legacy compat if needed. */
export function uniformRandomLetter(rng: () => number): string {
  return String.fromCharCode(65 + randomInt(rng, 0, 25))
}
