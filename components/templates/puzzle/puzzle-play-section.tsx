"use client"

import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { PuzzleGridClient } from "@/components/puzzle/puzzle-grid-client"
import { WordListPanel } from "./word-list-panel"

type PuzzlePlaySectionProps = {
  puzzle: Pick<
    PuzzlePageData,
    "id" | "grid" | "solutionData" | "largePrint" | "wordList"
  >
}

export function PuzzlePlaySection({ puzzle }: PuzzlePlaySectionProps) {
  const words = puzzle.wordList.map((entry) => entry.word)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="flex flex-col gap-4">
        <PuzzleGridClient
          puzzleId={puzzle.id}
          grid={puzzle.grid}
          solutionData={puzzle.solutionData}
          largePrint={puzzle.largePrint}
        />
      </div>
      <WordListPanel words={words} className="lg:sticky lg:top-24" />
    </div>
  )
}
