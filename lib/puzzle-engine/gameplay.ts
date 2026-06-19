import type { Cell } from "./types"

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
  const sameForward = a.every((cell, i) => cell.r === b[i]!.r && cell.c === b[i]!.c)
  const rev = [...b].reverse()
  const sameReverse = a.every((cell, i) => cell.r === rev[i]!.r && cell.c === rev[i]!.c)
  return sameForward || sameReverse
}
