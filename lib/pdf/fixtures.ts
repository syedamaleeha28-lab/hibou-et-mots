import { mockAnimauxPuzzlePageData } from "@/lib/db/adapters/mock-pilot"
import { ALL_DIRECTIONS, generatePuzzle } from "@/lib/puzzle-engine"
import type { PuzzlePageData } from "@/lib/db/types/page-data"
import type { PdfPuzzleInput } from "./types"

const GIANT_WORD_BANK = [
  "CHAT",
  "CHIEN",
  "LION",
  "ZEBRE",
  "TIGRE",
  "OURS",
  "RENARD",
  "LAPIN",
  "OISEAU",
  "PANDA",
  "SINGE",
  "LOUP",
  "CERF",
  "AIGLE",
  "BALEINE",
  "CHAMEAU",
  "DINOSAURE",
  "ELEPHANT",
  "FLAMANT",
  "GIRAFE",
  "HIBOU",
  "IGUANE",
  "JAGUAR",
  "KOALA",
  "LEOPARD",
]

export function generateLargeGridPuzzleInput(
  size: 15 | 18 | 20,
  largePrint = false,
): PdfPuzzleInput {
  const wordCount = size >= 18 ? 18 : 14
  const words = GIANT_WORD_BANK.slice(0, wordCount)

  const generated = generatePuzzle({
    words,
    size,
    directions: [...ALL_DIRECTIONS],
    simplifyAccents: true,
    seed: size * 31,
    timeBudgetMs: 15_000,
  })

  return {
    title: `Mots mêlés géant — ${size}×${size}`,
    grid: generated.grid,
    wordList: generated.wordList,
    solutionData: generated.solutionData,
    size: generated.size,
    largePrint,
  }
}

export function mockSpikePuzzleInput(): PdfPuzzleInput {
  const puzzle = mockAnimauxPuzzlePageData()
  return {
    title: puzzle.title,
    grid: puzzle.grid,
    wordList: puzzle.wordList,
    solutionData: puzzle.solutionData,
    size: puzzle.size,
    largePrint: puzzle.largePrint,
  }
}

export function mockFrenchAccentPuzzleInput(): PdfPuzzleInput {
  const generated = generatePuzzle({
    words: ["ÉTÉ", "FORÊT", "PRÈS", "CAFÉ", "ÇÀ", "LAC"],
    size: 8,
    directions: ["HORIZONTAL", "VERTICAL"],
    simplifyAccents: false,
    seed: 77,
  })

  return {
    title: "Mots mêlés — Été à la forêt (é è à ç)",
    grid: generated.grid,
    wordList: generated.wordList,
    solutionData: generated.solutionData,
    size: generated.size,
    largePrint: false,
  }
}

export function mockLargePrintPuzzleInput(): PdfPuzzleInput {
  return {
    ...mockSpikePuzzleInput(),
    largePrint: true,
  }
}

export function toPdfInput(puzzle: PuzzlePageData): PdfPuzzleInput {
  return {
    title: puzzle.title,
    grid: puzzle.grid,
    wordList: puzzle.wordList,
    solutionData: puzzle.solutionData,
    size: puzzle.size,
    largePrint: puzzle.largePrint,
  }
}
