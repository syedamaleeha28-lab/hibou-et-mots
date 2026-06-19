import type { Grid, SolutionData } from "@/lib/puzzle-engine"

export function solutionToLegacyGrid(
  grid: string[][],
  solutionData: SolutionData,
): Grid {
  return {
    letters: grid,
    size: solutionData.size,
    placements: solutionData.words.map((entry) => ({
      word: entry.word,
      cells: entry.cells.map((cell) => ({ r: cell.row, c: cell.col })),
    })),
  }
}
