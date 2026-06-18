export type Cell = { r: number; c: number }

export type Placement = {
  word: string
  cells: Cell[]
}

export type Grid = {
  letters: string[][]
  placements: Placement[]
  size: number
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

/** Deterministic PRNG (mulberry32) so a seed yields a stable grid. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DIRECTIONS = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: -1, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: -1, dc: -1 },
  { dr: 1, dc: -1 },
]

/** Normalise a French word: strip accents, uppercase, letters only. */
export function normalizeWord(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
}

function randomLetter(rng: () => number): string {
  return ALPHABET[Math.floor(rng() * ALPHABET.length)]
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Generate a word-search grid. Allows diagonals and reverse directions.
 * Returns the filled grid plus the coordinates of each placed word.
 * Pass a seed for a deterministic (SSR-stable) result.
 */
export function generateGrid(
  rawWords: string[],
  size: number,
  allowDiagonals = true,
  seed = 1,
): Grid {
  const rng = mulberry32(seed)
  const words = Array.from(
    new Set(
      rawWords
        .map(normalizeWord)
        .filter((w) => w.length >= 2 && w.length <= size),
    ),
  ).sort((a, b) => b.length - a.length)

  const letters: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  )
  const placements: Placement[] = []
  const dirs = allowDiagonals
    ? DIRECTIONS
    : DIRECTIONS.slice(0, 2).concat(DIRECTIONS.slice(4, 6))

  for (const word of words) {
    let placed = false
    const positions: Cell[] = []
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) positions.push({ r, c })

    for (const start of shuffle(positions, rng)) {
      if (placed) break
      for (const dir of shuffle(dirs, rng)) {
        const cells: Cell[] = []
        let ok = true
        for (let i = 0; i < word.length; i++) {
          const r = start.r + dir.dr * i
          const c = start.c + dir.dc * i
          if (r < 0 || r >= size || c < 0 || c >= size) {
            ok = false
            break
          }
          const existing = letters[r][c]
          if (existing !== null && existing !== word[i]) {
            ok = false
            break
          }
          cells.push({ r, c })
        }
        if (ok) {
          cells.forEach((cell, i) => {
            letters[cell.r][cell.c] = word[i]
          })
          placements.push({ word, cells })
          placed = true
          break
        }
      }
    }
  }

  const filled: string[][] = letters.map((row) =>
    row.map((cell) => cell ?? randomLetter(rng)),
  )

  return { letters: filled, placements, size }
}

/** Returns the straight line of cells between two points, or null if not aligned. */
export function lineBetween(a: Cell, b: Cell): Cell[] | null {
  const dr = b.r - a.r
  const dc = b.c - a.c
  const isLine = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)
  if (!isLine) return null
  const steps = Math.max(Math.abs(dr), Math.abs(dc))
  const sr = Math.sign(dr)
  const sc = Math.sign(dc)
  const cells: Cell[] = []
  for (let i = 0; i <= steps; i++) {
    cells.push({ r: a.r + sr * i, c: a.c + sc * i })
  }
  return cells
}

export function cellsEqual(a: Cell[], b: Cell[]): boolean {
  if (a.length !== b.length) return false
  const sameForward = a.every((cell, i) => cell.r === b[i].r && cell.c === b[i].c)
  const rev = [...b].reverse()
  const sameReverse = a.every((cell, i) => cell.r === rev[i].r && cell.c === rev[i].c)
  return sameForward || sameReverse
}
