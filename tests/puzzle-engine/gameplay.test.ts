import { describe, expect, it } from "vitest"
import {
  ALL_DIRECTIONS,
  cellFromPointer,
  cellsAlongDirection,
  cellsEqual,
  lineBetween,
  matchPlacement,
  type Cell,
  type GridPointerMetrics,
} from "@/lib/puzzle-engine"

function metricsFor(size: number, cell = 20, gap = 4, pad = 8): GridPointerMetrics {
  const inner = size * cell + (size - 1) * gap
  return {
    left: 100,
    top: 50,
    width: inner + pad * 2,
    height: inner + pad * 2,
    paddingLeft: pad,
    paddingTop: pad,
    paddingRight: pad,
    paddingBottom: pad,
    gapX: gap,
    gapY: gap,
    size,
  }
}

function clientPointFor(
  cell: Cell,
  m: GridPointerMetrics,
  cellSize = 20,
): { x: number; y: number } {
  const strideX = cellSize + m.gapX
  const strideY = cellSize + m.gapY
  return {
    x: m.left + m.paddingLeft + cell.c * strideX + cellSize / 2,
    y: m.top + m.paddingTop + cell.r * strideY + cellSize / 2,
  }
}

describe("lineBetween / cellsEqual", () => {
  it("builds lines in all 8 directions", () => {
    const start = { r: 4, c: 4 }
    for (const direction of ALL_DIRECTIONS) {
      const cells = cellsAlongDirection(start, direction, 4)
      const end = cells[cells.length - 1]!
      expect(lineBetween(start, end)).toEqual(cells)
      expect(cellsEqual(cells, lineBetween(start, end)!)).toBe(true)
      expect(cellsEqual(cells, [...cells].reverse())).toBe(true)
    }
  })

  it("returns null for non-aligned cells", () => {
    expect(lineBetween({ r: 0, c: 0 }, { r: 1, c: 2 })).toBeNull()
  })
})

describe("cellFromPointer", () => {
  const m = metricsFor(5)

  it("maps pointer coordinates to the correct cell", () => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const { x, y } = clientPointFor({ r, c }, m)
        expect(cellFromPointer(x, y, m)).toEqual({ r, c })
      }
    }
  })

  it("returns null outside the grid", () => {
    expect(cellFromPointer(0, 0, m)).toBeNull()
    expect(cellFromPointer(m.left + m.width + 10, m.top + 20, m)).toBeNull()
  })

  it("keeps a cell when the pointer skips intermediates (fast drag)", () => {
    const start = { r: 0, c: 0 }
    const end = { r: 4, c: 4 }
    const a = clientPointFor(start, m)
    const b = clientPointFor(end, m)
    expect(cellFromPointer(a.x, a.y, m)).toEqual(start)
    expect(cellFromPointer(b.x, b.y, m)).toEqual(end)
    expect(lineBetween(start, end)?.map((cell) => `${cell.r}-${cell.c}`)).toEqual([
      "0-0",
      "1-1",
      "2-2",
      "3-3",
      "4-4",
    ])
  })
})

describe("matchPlacement — drag start→end in 8 directions", () => {
  const start = { r: 2, c: 2 }
  const placements = ALL_DIRECTIONS.map((direction) => {
    const cells = cellsAlongDirection(start, direction, 3)
    return { word: direction, cells }
  })

  it.each(ALL_DIRECTIONS)("marks %s as found from start to end", (direction) => {
    const cells = cellsAlongDirection(start, direction, 3)
    const end = cells[cells.length - 1]!
    const line = lineBetween(start, end)
    expect(line).not.toBeNull()
    const match = matchPlacement(line!, placements, new Set())
    expect(match?.word).toBe(direction)
  })

  it.each(ALL_DIRECTIONS)("marks %s as found when dragged in reverse", (direction) => {
    const cells = cellsAlongDirection(start, direction, 3)
    const end = cells[cells.length - 1]!
    const line = lineBetween(end, start)
    expect(line).not.toBeNull()
    const match = matchPlacement(line!, placements, new Set())
    expect(match?.word).toBe(direction)
  })

  it("ignores already-found words", () => {
    const cells = cellsAlongDirection(start, "HORIZONTAL", 3)
    const line = lineBetween(cells[0]!, cells[cells.length - 1]!)!
    expect(matchPlacement(line, placements, new Set(["HORIZONTAL"]))).toBeNull()
  })
})
