import { describe, expect, it } from "vitest"
import { resolveToolDirections } from "@/lib/tools/directions"

describe("resolveToolDirections", () => {
  it("removes diagonals when disabled on moyen", () => {
    const directions = resolveToolDirections("moyen", false)
    expect(directions.every((direction) => !direction.includes("DIAGONAL"))).toBe(true)
    expect(directions).toContain("HORIZONTAL")
    expect(directions).toContain("VERTICAL")
  })

  it("adds basic diagonals for facile when enabled", () => {
    const directions = resolveToolDirections("facile", true)
    expect(directions).toContain("DIAGONAL_DESCENDANTE")
    expect(directions).toContain("DIAGONAL_MONTANTE")
  })
})
