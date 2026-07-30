"use client"

import { useMemo, useState } from "react"
import { Trophy } from "lucide-react"
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
  const words = useMemo(() => puzzle.wordList.map((entry) => entry.word), [puzzle.wordList])
  const [found, setFound] = useState<string[]>([])
  const isComplete = words.length > 0 && found.length === words.length

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="flex flex-col gap-4">
        <PuzzleGridClient
          puzzleId={puzzle.id}
          grid={puzzle.grid}
          solutionData={puzzle.solutionData}
          largePrint={puzzle.largePrint}
          requireSubmit
          onWordFound={(word) => setFound((prev) => (prev.includes(word) ? prev : [...prev, word]))}
        />
        {isComplete && (
          <div className="flex items-center gap-3 rounded-2xl bg-leaf/12 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf text-leaf-foreground">
              <Trophy className="size-5" />
            </span>
            <p className="font-heading font-extrabold text-foreground">
              Bravo ! Tu as trouvé tous les mots.
            </p>
          </div>
        )}
      </div>
      <WordListPanel words={words} foundWords={found} className="lg:sticky lg:top-24" />
    </div>
  )
}
