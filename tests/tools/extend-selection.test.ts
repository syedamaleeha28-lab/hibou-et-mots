import { describe, it, expect } from "vitest"
import { extendSelectionWithCell } from "../../lib/puzzle-engine/gameplay"
import type { Cell } from "../../lib/puzzle-engine/types"

describe("extendSelectionWithCell (click-by-click word building)", () => {
  it("starts a selection on the first tap", () => {
    expect(extendSelectionWithCell([], { r: 2, c: 2 })).toEqual([{ r: 2, c: 2 }])
  })

  it("deselects when tapping the same lone cell again", () => {
    const pending: Cell[] = [{ r: 2, c: 2 }]
    expect(extendSelectionWithCell(pending, { r: 2, c: 2 })).toEqual([])
  })

  it("sets the direction on the second tap if adjacent", () => {
    const pending: Cell[] = [{ r: 2, c: 2 }]
    expect(extendSelectionWithCell(pending, { r: 2, c: 3 })).toEqual([
      { r: 2, c: 2 },
      { r: 2, c: 3 },
    ])
  })

  it("restarts fresh if the second tap is not adjacent", () => {
    const pending: Cell[] = [{ r: 2, c: 2 }]
    expect(extendSelectionWithCell(pending, { r: 7, c: 7 })).toEqual([{ r: 7, c: 7 }])
  })

  it("extends along the established direction on further taps", () => {
    const pending: Cell[] = [{ r: 2, c: 2 }, { r: 2, c: 3 }]
    expect(extendSelectionWithCell(pending, { r: 2, c: 4 })).toEqual([
      { r: 2, c: 2 },
      { r: 2, c: 3 },
      { r: 2, c: 4 },
    ])
  })

  it("extends correctly along a diagonal direction", () => {
    const pending: Cell[] = [{ r: 0, c: 0 }, { r: 1, c: 1 }]
    expect(extendSelectionWithCell(pending, { r: 2, c: 2 })).toEqual([
      { r: 0, c: 0 },
      { r: 1, c: 1 },
      { r: 2, c: 2 },
    ])
  })

  it("undoes one step when tapping the last cell again", () => {
    const pending: Cell[] = [{ r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }]
    expect(extendSelectionWithCell(pending, { r: 2, c: 4 })).toEqual([
      { r: 2, c: 2 },
      { r: 2, c: 3 },
    ])
  })

  it("restarts fresh if a tap breaks the established line", () => {
    const pending: Cell[] = [{ r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }]
    expect(extendSelectionWithCell(pending, { r: 5, c: 5 })).toEqual([{ r: 5, c: 5 }])
  })

  it("supports building a whole word tap by tap (ELEPHANT-style, 5 taps)", () => {
    let pending: Cell[] = []
    const path: Cell[] = [
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 0, c: 2 },
      { r: 0, c: 3 },
      { r: 0, c: 4 },
    ]
    for (const cell of path) {
      pending = extendSelectionWithCell(pending, cell)
    }
    expect(pending).toEqual(path)
  })
})
