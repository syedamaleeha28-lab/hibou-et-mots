import type { Cell, Direction } from "./types"

export type DirectionDelta = { dr: number; dc: number }

const DELTAS: Record<Direction, DirectionDelta> = {
  HORIZONTAL: { dr: 0, dc: 1 },
  HORIZONTAL_INVERSE: { dr: 0, dc: -1 },
  VERTICAL: { dr: 1, dc: 0 },
  VERTICAL_INVERSE: { dr: -1, dc: 0 },
  DIAGONAL_DESCENDANTE: { dr: 1, dc: 1 },
  DIAGONAL_DESCENDANTE_INVERSE: { dr: -1, dc: -1 },
  DIAGONAL_MONTANTE: { dr: -1, dc: 1 },
  DIAGONAL_MONTANTE_INVERSE: { dr: 1, dc: -1 },
}

export const ALL_DIRECTIONS: Direction[] = [
  "HORIZONTAL",
  "VERTICAL",
  "DIAGONAL_DESCENDANTE",
  "DIAGONAL_MONTANTE",
  "HORIZONTAL_INVERSE",
  "VERTICAL_INVERSE",
  "DIAGONAL_DESCENDANTE_INVERSE",
  "DIAGONAL_MONTANTE_INVERSE",
]

export function getDelta(direction: Direction): DirectionDelta {
  return DELTAS[direction]
}

export function directionFromCells(start: Cell, end: Cell): Direction | null {
  const dr = end.r - start.r
  const dc = end.c - start.c
  if (dr === 0 && dc > 0) return "HORIZONTAL"
  if (dr === 0 && dc < 0) return "HORIZONTAL_INVERSE"
  if (dr > 0 && dc === 0) return "VERTICAL"
  if (dr < 0 && dc === 0) return "VERTICAL_INVERSE"
  if (dr > 0 && dc > 0 && Math.abs(dr) === Math.abs(dc)) return "DIAGONAL_DESCENDANTE"
  if (dr < 0 && dc < 0 && Math.abs(dr) === Math.abs(dc)) return "DIAGONAL_DESCENDANTE_INVERSE"
  if (dr < 0 && dc > 0 && Math.abs(dr) === Math.abs(dc)) return "DIAGONAL_MONTANTE"
  if (dr > 0 && dc < 0 && Math.abs(dr) === Math.abs(dc)) return "DIAGONAL_MONTANTE_INVERSE"
  return null
}

export function cellsAlongDirection(
  start: Cell,
  direction: Direction,
  length: number,
): Cell[] {
  const { dr, dc } = getDelta(direction)
  const cells: Cell[] = []
  for (let i = 0; i < length; i++) {
    cells.push({ r: start.r + dr * i, c: start.c + dc * i })
  }
  return cells
}

export function filterDirections(allowed: Direction[]): DirectionDelta[] {
  return allowed.map(getDelta)
}
