import { describe, expect, it } from "vitest"
import {
  ALL_DIRECTIONS,
  cellFromPointer,
  cellsAlongDirection,
  cellsEqual,
  lineBetween,
  matchPlacement,
  resolveSelectionEnd,
  selectionPreview,
  type Cell,
  type Direction,
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

function placementsForHub(start: Cell, length = 4) {
  return ALL_DIRECTIONS.map((direction) => ({
    word: direction,
    cells: cellsAlongDirection(start, direction, length),
  }))
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

describe("full selection flow — click/tap then end in all 8 directions", () => {
  const start = { r: 3, c: 3 }
  const placements = placementsForHub(start, 4)

  it("first letter tap keeps an anchor highlight", () => {
    const result = resolveSelectionEnd(start, start, placements, new Set())
    expect(result).toEqual({ kind: "anchor", cell: start, path: [start] })
  })

  it.each(ALL_DIRECTIONS)(
    "click start→end marks %s found and exposes the full path",
    (direction: Direction) => {
      const cells = cellsAlongDirection(start, direction, 4)
      const end = cells[cells.length - 1]!
      const preview = selectionPreview(start, end)
      expect(preview).toEqual(cells)

      const result = resolveSelectionEnd(start, end, placements, new Set())
      expect(result.kind).toBe("found")
      if (result.kind === "found") {
        expect(result.word).toBe(direction)
        expect(result.cells).toEqual(cells)
        expect(result.path).toEqual(cells)
      }
    },
  )

  it.each(ALL_DIRECTIONS)(
    "reverse drag end→start still marks %s found",
    (direction: Direction) => {
      const cells = cellsAlongDirection(start, direction, 4)
      const end = cells[cells.length - 1]!
      const result = resolveSelectionEnd(end, start, placements, new Set())
      expect(result.kind).toBe("found")
      if (result.kind === "found") {
        expect(result.word).toBe(direction)
      }
    },
  )

  it("updates the found counter across all 8 directions without duplicates", () => {
    const found = new Set<string>()
    for (const direction of ALL_DIRECTIONS) {
      const cells = cellsAlongDirection(start, direction, 4)
      const end = cells[cells.length - 1]!
      const result = resolveSelectionEnd(start, end, placements, found)
      expect(result.kind).toBe("found")
      if (result.kind === "found") found.add(result.word)
    }
    expect(found.size).toBe(8)
    expect([...found].sort()).toEqual([...ALL_DIRECTIONS].sort())

    // Selecting an already-found word is a clear (counter unchanged).
    const again = cellsAlongDirection(start, "HORIZONTAL", 4)
    const duplicate = resolveSelectionEnd(start, again[again.length - 1]!, placements, found)
    expect(duplicate.kind).toBe("clear")
    expect(found.size).toBe(8)
  })

  it("clears on a non-word path while still previewing the line", () => {
    const from = { r: 0, c: 0 }
    const to = { r: 0, c: 3 }
    const result = resolveSelectionEnd(from, to, placements, new Set())
    expect(result.kind).toBe("clear")
    expect(result.path).toEqual([
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 0, c: 2 },
      { r: 0, c: 3 },
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
