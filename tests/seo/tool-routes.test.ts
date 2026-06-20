import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { ROUTES } from "@/lib/seo/routes"

describe("tool routes", () => {
  it("defines canonical tool paths with trailing slashes", () => {
    expect(ROUTES.generateur).toBe("/generateur-mots-meles/")
    expect(ROUTES.jouer).toBe("/jouer-mots-meles-en-ligne/")
  })

  it("has app router pages for both tools", () => {
    const root = process.cwd()
    expect(existsSync(resolve(root, "app/generateur-mots-meles/page.tsx"))).toBe(true)
    expect(existsSync(resolve(root, "app/jouer-mots-meles-en-ligne/page.tsx"))).toBe(true)
  })
})
