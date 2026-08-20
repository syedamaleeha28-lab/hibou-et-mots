import { MOTS_COUPES_PUZZLES, type MotsCoupesPuzzle } from "./puzzles"

/** Separate epoch from both the daily word game and the crossword's own
 *  epoch, so all three daily rotations are independent of each other. */
const EPOCH_UTC_MS = Date.UTC(2024, 6, 1)

export function getDayIndex(date: Date = new Date()): number {
  const localMidnightAsUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((localMidnightAsUtc - EPOCH_UTC_MS) / 86_400_000)
}

export function getPuzzleForDay(
  dayIndex: number,
  puzzles: MotsCoupesPuzzle[] = MOTS_COUPES_PUZZLES,
): MotsCoupesPuzzle {
  const size = puzzles.length
  const idx = ((dayIndex % size) + size) % size
  return puzzles[idx]!
}

/** True if two selections (by pair id) form a correct match — since
 *  both fragments of a pair always share the same pair id regardless
 *  of which column they're displayed in, a match is simply equality. */
export function isMatch(part1PairId: string, part2PairId: string): boolean {
  return part1PairId === part2PairId
}

export function isPuzzleComplete(matchedIds: ReadonlySet<string>, puzzle: MotsCoupesPuzzle): boolean {
  return puzzle.pairs.every((p) => matchedIds.has(p.id))
}

/**
 * True if `order` is a valid derangement of `canonicalIds` — same length,
 * same set of ids, and no id appears at the same index it holds in
 * canonicalIds (which would make that one pair trivially "pre-matched"
 * by position). Used to catch a bad part2Order before it ships; see
 * tests/mots-coupes/puzzles.test.ts.
 */
export function isDerangement(order: readonly string[], canonicalIds: readonly string[]): boolean {
  if (order.length !== canonicalIds.length) return false
  const canonicalSet = new Set(canonicalIds)
  const orderSet = new Set(order)
  if (orderSet.size !== order.length) return false // duplicates
  for (const id of order) {
    if (!canonicalSet.has(id)) return false // unknown id
  }
  for (let i = 0; i < order.length; i++) {
    if (order[i] === canonicalIds[i]) return false // fixed point
  }
  return true
}

/** Every fragment in the puzzle (both columns) — used by validation and
 *  by the printable answer key. */
export function allPairs(puzzle: MotsCoupesPuzzle) {
  return puzzle.pairs
}
