import { directionFromCells, getDelta } from "./directions"
import type { Cell, Direction, Placement, PreparedWord } from "./types"
import { randomInt } from "./rng"

export function createEmptyGrid(size: number): (string | null)[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null))
}

function isDiagonalDirection(direction: Direction): boolean {
  return direction.includes("DIAGONAL")
}

/**
 * Weighted direction pick: horizontal/vertical directions are 3x more likely
 * than diagonal ones. This keeps diagonals in the mix (so grids stay
 * interesting at medium/hard difficulty) without letting them dominate the
 * puzzle, which is what made grids feel like "everything is diagonal."
 */
function pickWeightedDirection(rng: () => number, directions: Direction[]): Direction {
  const STRAIGHT_WEIGHT = 2
  const DIAGONAL_WEIGHT = 1
  const weights = directions.map((d) => (isDiagonalDirection(d) ? DIAGONAL_WEIGHT : STRAIGHT_WEIGHT))
  const total = weights.reduce((sum, w) => sum + w, 0)
  let roll = rng() * total
  for (let i = 0; i < directions.length; i++) {
    roll -= weights[i]!
    if (roll <= 0) return directions[i]!
  }
  return directions[directions.length - 1]!
}

export function canPlaceWord(
  grid: (string | null)[][],
  word: string,
  start: Cell,
  direction: Direction,
  size: number,
): Cell[] | null {
  const { dr, dc } = getDelta(direction)
  const cells: Cell[] = []

  for (let i = 0; i < word.length; i++) {
    const r = start.r + dr * i
    const c = start.c + dc * i
    if (r < 0 || r >= size || c < 0 || c >= size) return null
    const existing = grid[r]![c]!
    if (existing !== null && existing !== word[i]) return null
    cells.push({ r, c })
  }

  return cells
}

export function applyPlacement(
  grid: (string | null)[][],
  word: string,
  cells: Cell[],
): void {
  cells.forEach((cell, i) => {
    grid[cell.r]![cell.c] = word[i]!
  })
}

export function tryPlaceWordRandom(
  grid: (string | null)[][],
  prepared: PreparedWord,
  directions: Direction[],
  size: number,
  maxAttempts: number,
  rng: () => number,
): Placement | null {
  const { gridWord, displayWord } = prepared

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const direction =
      directions.length > 1 ? pickWeightedDirection(rng, directions) : directions[0]!
    const { dr, dc } = getDelta(direction)
    const maxRow =
      dr === 0
        ? size - 1
        : dr > 0
          ? size - gridWord.length
          : gridWord.length - 1
    const maxCol =
      dc === 0
        ? size - 1
        : dc > 0
          ? size - gridWord.length
          : gridWord.length - 1
    const minRow = dr < 0 ? gridWord.length - 1 : 0
    const minCol = dc < 0 ? gridWord.length - 1 : 0

    if (maxRow < minRow || maxCol < minCol) continue

    const start: Cell = {
      r: randomInt(rng, minRow, maxRow),
      c: randomInt(rng, minCol, maxCol),
    }

    const cells = canPlaceWord(grid, gridWord, start, direction, size)
    if (!cells) continue

    applyPlacement(grid, gridWord, cells)
    const resolvedDirection =
      directionFromCells(cells[0]!, cells[cells.length - 1]!) ?? direction

    return {
      word: gridWord,
      displayWord,
      row: start.r,
      col: start.c,
      direction: resolvedDirection,
      cells,
    }
  }

  return null
}
