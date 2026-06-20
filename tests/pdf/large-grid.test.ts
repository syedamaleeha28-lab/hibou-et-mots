import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { buildSolutionCellSet } from "@/lib/pdf/solution-cells"
import { generateLargeGridPuzzleInput } from "@/lib/pdf/fixtures"
import { renderPuzzlePdfToBuffer } from "@/lib/pdf/render"
import { getPdfCellMetrics, gridFitsA4 } from "@/lib/pdf/styles"

const ARTIFACTS_DIR = join(__dirname, ".artifacts", "large-grids")

function countPdfPages(buffer: Buffer): number {
  const text = buffer.toString("latin1")
  return text.match(/\/Type\s*\/Page\b/g)?.length ?? 0
}

function writeArtifact(name: string, buffer: Buffer) {
  mkdirSync(ARTIFACTS_DIR, { recursive: true })
  writeFileSync(join(ARTIFACTS_DIR, name), buffer)
}

const LARGE_SIZES = [15, 18, 20] as const

describe("pdf large grids — A4 layout", () => {
  for (const size of LARGE_SIZES) {
    it(`fits ${size}x${size} on A4 (standard)`, async () => {
      const puzzle = generateLargeGridPuzzleInput(size, false)
      const fit = gridFitsA4(puzzle.size, puzzle.largePrint, puzzle.wordList.length)

      expect(fit.fitsWidth).toBe(true)
      expect(fit.fitsPage1Height).toBe(true)
      expect(fit.fitsPage2Height).toBe(true)

      const buffer = await renderPuzzlePdfToBuffer(puzzle)
      expect(buffer.subarray(0, 4).toString("utf8")).toBe("%PDF")
      expect(countPdfPages(buffer)).toBe(2)

      const cells = buildSolutionCellSet(puzzle.solutionData)
      expect(cells.size).toBeGreaterThan(0)

      writeArtifact(`grid-${size}x${size}.pdf`, buffer)
    })

    it(`fits ${size}x${size} on A4 (largePrint)`, async () => {
      const puzzle = generateLargeGridPuzzleInput(size, true)
      const metrics = getPdfCellMetrics(puzzle.size, true, puzzle.wordList.length)
      const fit = gridFitsA4(puzzle.size, true, puzzle.wordList.length)

      expect(fit.fitsWidth).toBe(true)
      expect(fit.fitsPage1Height).toBe(true)
      expect(fit.fitsPage2Height).toBe(true)
      expect(metrics.cellSize).toBeGreaterThanOrEqual(8)

      const buffer = await renderPuzzlePdfToBuffer(puzzle)
      expect(buffer.length).toBeGreaterThan(2_000)

      writeArtifact(`grid-${size}x${size}-large-print.pdf`, buffer)
    })
  }
})
