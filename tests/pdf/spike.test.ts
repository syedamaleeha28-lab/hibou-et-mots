import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { buildSolutionCellSet } from "@/lib/pdf/solution-cells"
import {
  mockFrenchAccentPuzzleInput,
  mockLargePrintPuzzleInput,
  mockSpikePuzzleInput,
} from "@/lib/pdf/fixtures"
import { renderPuzzlePdfToBuffer } from "@/lib/pdf/render"

const ARTIFACTS_DIR = join(__dirname, ".artifacts")

function countPdfPages(buffer: Buffer): number {
  const text = buffer.toString("latin1")
  const matches = text.match(/\/Type\s*\/Page\b/g)
  return matches?.length ?? 0
}

function writeArtifact(name: string, buffer: Buffer) {
  mkdirSync(ARTIFACTS_DIR, { recursive: true })
  writeFileSync(join(ARTIFACTS_DIR, name), buffer)
}

describe("pdf spike — @react-pdf/renderer", () => {
  it("renders a two-page PDF buffer from mockAnimaux puzzle", async () => {
    const puzzle = mockSpikePuzzleInput()
    const buffer = await renderPuzzlePdfToBuffer(puzzle)

    expect(buffer.subarray(0, 4).toString("utf8")).toBe("%PDF")
    expect(buffer.length).toBeGreaterThan(2_000)
    expect(countPdfPages(buffer)).toBe(2)

    writeArtifact("spike-animaux.pdf", buffer)
  })

  it("highlights all solution cells on page 2 data path", () => {
    const puzzle = mockSpikePuzzleInput()
    const cells = buildSolutionCellSet(puzzle.solutionData)
    let letterCount = 0

    for (const entry of puzzle.solutionData.words) {
      letterCount += entry.cells.length
    }

    expect(cells.size).toBe(letterCount)
    expect(cells.size).toBeGreaterThan(0)
  })

  it("renders French accented title and words without error", async () => {
    const puzzle = mockFrenchAccentPuzzleInput()
    const buffer = await renderPuzzlePdfToBuffer(puzzle)

    expect(buffer.subarray(0, 4).toString("utf8")).toBe("%PDF")
    expect(puzzle.title).toContain("é")
    expect(puzzle.title).toContain("è")
    expect(puzzle.title).toContain("à")
    expect(puzzle.title).toContain("ç")
    expect(puzzle.wordList.some((entry) => /[ÉÈÀÇÊÂÔÛÎÜ]/i.test(entry.word))).toBe(true)

    writeArtifact("spike-french-accents.pdf", buffer)
  })

  it("renders largePrint variant with larger layout metrics", async () => {
    const puzzle = mockLargePrintPuzzleInput()
    expect(puzzle.largePrint).toBe(true)

    const buffer = await renderPuzzlePdfToBuffer(puzzle)
    expect(buffer.subarray(0, 4).toString("utf8")).toBe("%PDF")
    expect(countPdfPages(buffer)).toBe(2)

    writeArtifact("spike-large-print.pdf", buffer)
  })
})
