import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("generator meta tag", () => {
  it("does not expose v0.app in root layout metadata", () => {
    for (const relativePath of ["app/(fr)/layout.tsx", "app/(pt-br)/layout.tsx"]) {
      const layoutSource = readFileSync(resolve(process.cwd(), relativePath), "utf8")

      expect(layoutSource).not.toMatch(/generator\s*:\s*['"]v0\.app['"]/)
      expect(layoutSource).not.toContain("v0.app")
    }
  })
})
