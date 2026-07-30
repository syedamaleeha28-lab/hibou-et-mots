import { describe, it, expect } from "vitest"
import { generateToolPuzzle } from "../../lib/tools/generate"

describe("direction mix after weighting fix", () => {
  it("medium difficulty favors horizontal/vertical over diagonal across many puzzles", () => {
    const words = ["CROCODILE","PAPILLON","ELEPHANT","DAUPHIN","RENARD","GIRAFE","LAPIN","TIGRE","ZEBRE","CHIEN"]
    let straight = 0
    let diagonal = 0
    for (let seed = 1; seed <= 40; seed++) {
      const result = generateToolPuzzle({ words, difficulty: "moyen", size: 10, allowDiagonals: true, seed })
      if (!result) continue
      for (const p of result.wordList) {
        if (p.direction.includes("DIAGONAL")) diagonal++
        else straight++
      }
    }
    const total = straight + diagonal
    const diagonalRatio = diagonal / total
    console.log({ straight, diagonal, diagonalRatio })
    // Healthy "mix": diagonals present but clearly the minority (was ~50%+ before the fix).
    expect(diagonalRatio).toBeGreaterThan(0.08)
    expect(diagonalRatio).toBeLessThan(0.35)
  })
})
