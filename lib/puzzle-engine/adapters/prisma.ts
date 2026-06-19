import type { PuzzleResult } from "./types"

export type PrismaPuzzlePayload = {
  slug: string
  title: string
  gridData: string[][]
  wordList: PuzzleResult["wordList"]
  solutionData: PuzzleResult["solutionData"]
  size: number
  difficultyId: string
  gradeId?: string
  themeId?: string
  largePrint?: boolean
  language?: string
}

export function toPrismaPuzzlePayload(
  result: PuzzleResult,
  meta: {
    slug: string
    title: string
    difficultyId: string
    gradeId?: string
    themeId?: string
    largePrint?: boolean
    language?: string
  },
): PrismaPuzzlePayload {
  return {
    slug: meta.slug,
    title: meta.title,
    gridData: result.grid,
    wordList: result.wordList,
    solutionData: result.solutionData,
    size: result.size,
    difficultyId: meta.difficultyId,
    gradeId: meta.gradeId,
    themeId: meta.themeId,
    largePrint: meta.largePrint ?? false,
    language: meta.language ?? "fr",
  }
}
