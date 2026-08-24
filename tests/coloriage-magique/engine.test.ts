import { describe, expect, it } from "vitest"
import { COLORIAGE_DESIGNS } from "@/lib/coloriage-magique/designs"
import {
  getDayIndex,
  getDesignForDay,
  isDesignComplete,
  isDesignWellFormed,
  legendColorForNumber,
} from "@/lib/coloriage-magique/engine"

describe("coloriage magique — engine", () => {
  it("isDesignWellFormed accepts every real design", () => {
    for (const design of COLORIAGE_DESIGNS) {
      expect(isDesignWellFormed(design), design.id).toBe(true)
    }
  })

  it("isDesignWellFormed rejects a region pointing at a missing legend number", () => {
    const broken = {
      id: "broken",
      title: "Broken",
      viewBox: "0 0 1 1",
      legend: [{ number: 1, colorName: "Rouge", colorHex: "#F00" }],
      regions: [{ id: "r1", shape: { kind: "circle" as const, cx: 0, cy: 0, r: 1 }, number: 2, labelX: 0, labelY: 0 }],
    }
    expect(isDesignWellFormed(broken)).toBe(false)
  })

  it("isDesignWellFormed rejects an unused legend entry", () => {
    const broken = {
      id: "broken2",
      title: "Broken2",
      viewBox: "0 0 1 1",
      legend: [
        { number: 1, colorName: "Rouge", colorHex: "#F00" },
        { number: 2, colorName: "Bleu", colorHex: "#00F" },
      ],
      regions: [{ id: "r1", shape: { kind: "circle" as const, cx: 0, cy: 0, r: 1 }, number: 1, labelX: 0, labelY: 0 }],
    }
    expect(isDesignWellFormed(broken)).toBe(false)
  })

  it("legendColorForNumber returns the matching hex, or undefined", () => {
    const design = COLORIAGE_DESIGNS[0]!
    const firstEntry = design.legend[0]!
    expect(legendColorForNumber(design, firstEntry.number)).toBe(firstEntry.colorHex)
    expect(legendColorForNumber(design, 999)).toBeUndefined()
  })

  it("isDesignComplete is true only when every region id is in the filled set", () => {
    const design = COLORIAGE_DESIGNS[0]!
    const allIds = new Set(design.regions.map((r) => r.id))
    expect(isDesignComplete(design, allIds)).toBe(true)
    expect(isDesignComplete(design, new Set())).toBe(false)
  })

  it("getDesignForDay wraps around via modulo for any day index", () => {
    const size = COLORIAGE_DESIGNS.length
    for (const dayIndex of [0, 1, size - 1, size, size * 3 + 2, -1, -size - 1]) {
      const design = getDesignForDay(dayIndex, COLORIAGE_DESIGNS)
      expect(COLORIAGE_DESIGNS).toContain(design)
    }
  })

  it("getDayIndex returns a stable integer for a fixed local date", () => {
    const d1 = getDayIndex(new Date(2026, 7, 20, 1, 0, 0))
    const d2 = getDayIndex(new Date(2026, 7, 20, 23, 0, 0))
    expect(d1).toBe(d2)
    expect(Number.isInteger(d1)).toBe(true)
  })
})
