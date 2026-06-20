import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("pdf api route", () => {
  it("exists at app/api/pdf/[puzzleId]/route.ts", () => {
    const routePath = resolve(process.cwd(), "app/api/pdf/[puzzleId]/route.ts")
    expect(existsSync(routePath)).toBe(true)
  })
})
