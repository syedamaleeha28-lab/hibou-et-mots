import { describe, expect, it } from "vitest"
import { cellsAlongDirection, directionFromCells, getDelta } from "@/lib/puzzle-engine"

describe("directions", () => {
  it("maps horizontal forward and inverse", () => {
    expect(getDelta("HORIZONTAL")).toEqual({ dr: 0, dc: 1 })
    expect(getDelta("HORIZONTAL_INVERSE")).toEqual({ dr: 0, dc: -1 })
  })

  it("derives direction from cell endpoints", () => {
    expect(directionFromCells({ r: 0, c: 0 }, { r: 0, c: 4 })).toBe("HORIZONTAL")
    expect(directionFromCells({ r: 2, c: 2 }, { r: 0, c: 0 })).toBe(
      "DIAGONAL_DESCENDANTE_INVERSE",
    )
  })

  it("builds cells along a direction", () => {
    const cells = cellsAlongDirection({ r: 1, c: 1 }, "VERTICAL", 3)
    expect(cells).toEqual([
      { r: 1, c: 1 },
      { r: 2, c: 1 },
      { r: 3, c: 1 },
    ])
  })
})
