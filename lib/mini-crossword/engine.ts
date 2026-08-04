import { MINI_CROSSWORD_GRIDS, type CrosswordEntry, type CrosswordGrid } from "./grids"

/** Separate epoch from the daily word game so the two rotations are independent. */
const EPOCH_UTC_MS = Date.UTC(2024, 0, 1)

export function getDayIndex(date: Date = new Date()): number {
  const localMidnightAsUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((localMidnightAsUtc - EPOCH_UTC_MS) / 86_400_000)
}

export function getGridForDay(
  dayIndex: number,
  grids: CrosswordGrid[] = MINI_CROSSWORD_GRIDS,
): CrosswordGrid {
  const size = grids.length
  const idx = ((dayIndex % size) + size) % size
  return grids[idx]!
}

export function allEntries(grid: CrosswordGrid): CrosswordEntry[] {
  return [...grid.across, ...grid.down]
}

/** Cell values keyed by "row-col", as typed by the player so far. */
export type CellValues = Record<string, string>

export function cellKey(row: number, col: number): string {
  return `${row}-${col}`
}

/** Every (row, col) an entry occupies, direction-aware. */
export function entryCells(entry: CrosswordEntry, dir: "across" | "down"): { row: number; col: number }[] {
  return Array.from({ length: entry.len }, (_, i) => ({
    row: dir === "across" ? entry.row : entry.row + i,
    col: dir === "across" ? entry.col + i : entry.col,
  }))
}

export function isEntryFilled(entry: CrosswordEntry, dir: "across" | "down", values: CellValues): boolean {
  return entryCells(entry, dir).every((c) => (values[cellKey(c.row, c.col)] ?? "").length === 1)
}

export function isEntryCorrect(entry: CrosswordEntry, dir: "across" | "down", values: CellValues): boolean {
  const word = entryCells(entry, dir)
    .map((c) => values[cellKey(c.row, c.col)] ?? "")
    .join("")
  return word.toUpperCase() === entry.answer
}

export function isGridComplete(grid: CrosswordGrid, values: CellValues): boolean {
  return (
    grid.across.every((e) => isEntryCorrect(e, "across", values)) &&
    grid.down.every((e) => isEntryCorrect(e, "down", values))
  )
}
