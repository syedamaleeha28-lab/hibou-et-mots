import type { Placement, SolutionData, WordListEntry } from "./types"

export function buildWordList(
  placements: Placement[],
  simplifyAccents = false,
): WordListEntry[] {
  return placements.map((p) => ({
    word: simplifyAccents ? p.word : p.displayWord,
    row: p.row,
    col: p.col,
    direction: p.direction,
  }))
}

export function buildSolutionData(
  placements: Placement[],
  size: number,
  simplifyAccents = false,
): SolutionData {
  return {
    version: 1,
    size,
    words: placements.map((p) => ({
      word: simplifyAccents ? p.word : p.displayWord,
      cells: p.cells.map((c) => ({ row: c.r, col: c.c })),
    })),
  }
}

export function puzzleResultToLegacyGrid(result: {
  grid: string[][]
  size: number
  placements: Placement[]
}) {
  return {
    letters: result.grid,
    size: result.size,
    placements: result.placements.map((p) => ({
      word: p.word,
      cells: p.cells,
    })),
  }
}
