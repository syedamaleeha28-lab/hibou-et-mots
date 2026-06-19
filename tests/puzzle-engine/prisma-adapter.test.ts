import { describe, expect, it } from "vitest"
import { generatePuzzle, toPrismaPuzzlePayload } from "@/lib/puzzle-engine"
import { ANIMAL_WORDS } from "./fixtures/words"

describe("toPrismaPuzzlePayload", () => {
  it("maps engine output to prisma field shapes", () => {
    const result = generatePuzzle({
      words: ANIMAL_WORDS.slice(0, 6),
      size: 10,
      directions: ["HORIZONTAL", "VERTICAL"],
      seed: 4,
    })

    const payload = toPrismaPuzzlePayload(result, {
      slug: "animaux-facile-01",
      title: "Animaux Facile 01",
      difficultyId: "diff-facile",
      largePrint: true,
    })

    expect(payload.gridData).toEqual(result.grid)
    expect(payload.wordList).toEqual(result.wordList)
    expect(payload.solutionData.version).toBe(1)
    expect(payload.largePrint).toBe(true)
  })
})
