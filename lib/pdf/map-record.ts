import type { PuzzlePageData } from "@/lib/db/types/page-data"
import type { PdfPuzzleInput } from "./types"

export type PuzzlePdfRecord = {
  id: string
  slug: string
  title: string
  gridData: unknown
  wordList: unknown
  solutionData: unknown
  size: number
  largePrint: boolean
  pdfUrl: string | null
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  // PT-BR pack: added so PdfPuzzleInput (below) can carry it through to
  // the renderer.
  language: string
}

export function puzzleRecordToPdfInput(puzzle: PuzzlePdfRecord): PdfPuzzleInput {
  return {
    title: puzzle.title,
    grid: puzzle.gridData as string[][],
    wordList: puzzle.wordList as PuzzlePageData["wordList"],
    solutionData: puzzle.solutionData as PuzzlePageData["solutionData"],
    size: puzzle.size,
    largePrint: puzzle.largePrint,
    language: puzzle.language,
  }
}
