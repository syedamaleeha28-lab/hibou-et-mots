import { describe, expect, it } from "vitest"
import { COLORIAGE_DESIGNS, getDesignById } from "@/lib/coloriage-magique/designs"
import { isDesignWellFormed } from "@/lib/coloriage-magique/engine"

describe("coloriage magique — design data integrity", () => {
  it("design ids are unique", () => {
    const ids = COLORIAGE_DESIGNS.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("region ids are unique within each design", () => {
    for (const design of COLORIAGE_DESIGNS) {
      const ids = design.regions.map((r) => r.id)
      expect(new Set(ids).size, design.id).toBe(ids.length)
    }
  })

  it("legend numbers are unique within each design", () => {
    for (const design of COLORIAGE_DESIGNS) {
      const numbers = design.legend.map((entry) => entry.number)
      expect(new Set(numbers).size, design.id).toBe(numbers.length)
    }
  })

  it("every design is structurally well-formed (region numbers match legend)", () => {
    for (const design of COLORIAGE_DESIGNS) {
      expect(isDesignWellFormed(design), design.id).toBe(true)
    }
  })

  it("every legend color is a valid hex code", () => {
    for (const design of COLORIAGE_DESIGNS) {
      for (const entry of design.legend) {
        expect(entry.colorHex, `${design.id}/${entry.number}`).toMatch(/^#[0-9A-Fa-f]{3,6}$/)
      }
    }
  })

  it("every region's shape has finite, valid coordinates", () => {
    for (const design of COLORIAGE_DESIGNS) {
      for (const region of design.regions) {
        if (region.shape.kind === "circle") {
          expect(Number.isFinite(region.shape.cx), region.id).toBe(true)
          expect(Number.isFinite(region.shape.cy), region.id).toBe(true)
          expect(region.shape.r, region.id).toBeGreaterThan(0)
        } else if (region.shape.kind === "polygon") {
          const points = region.shape.points.trim().split(/\s+/)
          expect(points.length, region.id).toBeGreaterThanOrEqual(3)
          for (const point of points) {
            const [x, y] = point.split(",").map(Number)
            expect(Number.isFinite(x), `${region.id} point ${point}`).toBe(true)
            expect(Number.isFinite(y), `${region.id} point ${point}`).toBe(true)
          }
        } else {
          expect(region.shape.d.length, region.id).toBeGreaterThan(0)
          expect(region.shape.d.trim().startsWith("M"), region.id).toBe(true)
        }
        expect(Number.isFinite(region.labelX), region.id).toBe(true)
        expect(Number.isFinite(region.labelY), region.id).toBe(true)
      }
    }
  })

  it("getDesignById finds a real design and returns undefined for unknown ids", () => {
    const first = COLORIAGE_DESIGNS[0]!
    expect(getDesignById(first.id)?.id).toBe(first.id)
    expect(getDesignById("does-not-exist")).toBeUndefined()
  })

  // NOTE: whether a design actually LOOKS like what it claims to
  // (a sun, a flower) isn't something a unit test can verify — that was
  // checked by rendering each design to a real PNG at authoring time and
  // visually confirming it, same spirit as sudoku's offline uniqueness
  // solve. If a new design is added later, repeat that step before
  // adding it here; a passing test suite alone doesn't prove it's
  // recognizable.
})
