import type { PdfPuzzleInput } from "./types"

export function buildSolutionCellSet(
  solutionData: PdfPuzzleInput["solutionData"],
): Set<string> {
  const cells = new Set<string>()
  for (const entry of solutionData.words) {
    for (const cell of entry.cells) {
      cells.add(`${cell.row},${cell.col}`)
    }
  }
  return cells
}
