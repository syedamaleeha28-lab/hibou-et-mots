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

/** Layout metrics for hit-testing a uniform CSS grid of letter cells. */
export type GridPointerMetrics = {
  left: number
  top: number
  width: number
  height: number
  paddingLeft: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  gapX: number
  gapY: number
  size: number
}

/**
 * Maps a client (viewport) pointer position to a grid cell using the
 * container's bounding box — not per-cell hover events.
 */
export function cellFromPointer(
  clientX: number,
  clientY: number,
  metrics: GridPointerMetrics,
): Cell | null {
  const {
    left,
    top,
    width,
    height,
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    gapX,
    gapY,
    size,
  } = metrics

  if (size <= 0) return null

  const innerWidth = width - paddingLeft - paddingRight
  const innerHeight = height - paddingTop - paddingBottom
  if (innerWidth <= 0 || innerHeight <= 0) return null

  const x = clientX - left - paddingLeft
  const y = clientY - top - paddingTop
  if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return null

  const cellWidth = (innerWidth - gapX * (size - 1)) / size
  const cellHeight = (innerHeight - gapY * (size - 1)) / size
  if (cellWidth <= 0 || cellHeight <= 0) return null

  const strideX = cellWidth + gapX
  const strideY = cellHeight + gapY
  const c = Math.min(size - 1, Math.max(0, Math.floor(x / strideX)))
  const r = Math.min(size - 1, Math.max(0, Math.floor(y / strideY)))

  const localX = x - c * strideX
  const localY = y - r * strideY
  // Pointer is in the gap between cells — keep the nearest prior cell.
  if (localX > cellWidth + 1e-6 || localY > cellHeight + 1e-6) {
    return { r, c }
  }

  return { r, c }
}

/** Read layout metrics from a grid container element for pointer hit-testing. */
export function readGridPointerMetrics(
  el: HTMLElement,
  size: number,
): GridPointerMetrics {
  const rect = el.getBoundingClientRect()
  const style = getComputedStyle(el)
  const gapX = parseFloat(style.columnGap || style.gap) || 0
  const gapY = parseFloat(style.rowGap || style.gap) || 0
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    paddingLeft: parseFloat(style.paddingLeft) || 0,
    paddingTop: parseFloat(style.paddingTop) || 0,
    paddingRight: parseFloat(style.paddingRight) || 0,
    paddingBottom: parseFloat(style.paddingBottom) || 0,
    gapX,
    gapY,
    size,
  }
}

/**
 * Commit a selection line against known placements.
 * Returns the matched word, or null if nothing new was found.
 */
export function matchPlacement(
  line: Cell[],
  placements: Array<{ word: string; cells: Cell[] }>,
  alreadyFound: ReadonlySet<string>,
): { word: string; cells: Cell[] } | null {
  const match = placements.find((p) => cellsEqual(p.cells, line))
  if (!match || alreadyFound.has(match.word)) return null
  return match
}
