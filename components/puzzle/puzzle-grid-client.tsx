"use client"

import { useMemo } from "react"
import type { SolutionData } from "@/lib/puzzle-engine"
import { solutionToLegacyGrid } from "@/lib/puzzle/grid-utils"
import { WordGrid } from "@/components/puzzle/word-grid"
import { cn } from "@/lib/utils"

type PuzzleGridClientProps = {
  puzzleId: string
  grid: string[][]
  solutionData: SolutionData
  largePrint?: boolean
  readOnly?: boolean
  onWordFound?: (word: string) => void
  className?: string
}

export function PuzzleGridClient({
  puzzleId,
  grid,
  solutionData,
  largePrint = false,
  readOnly = false,
  onWordFound,
  className,
}: PuzzleGridClientProps) {
  const legacyGrid = useMemo(
    () => solutionToLegacyGrid(grid, solutionData),
    [grid, solutionData],
  )

  return (
    <div className={cn("relative touch-none", className)}>
      <WordGrid
        key={puzzleId}
        grid={legacyGrid}
        largePrint={largePrint}
        readOnly={readOnly}
        onWordFound={onWordFound}
      />
    </div>
  )
}
