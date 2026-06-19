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
  className?: string
}

export function PuzzleGridClient({
  grid,
  solutionData,
  largePrint = false,
  className,
}: PuzzleGridClientProps) {
  const legacyGrid = useMemo(
    () => solutionToLegacyGrid(grid, solutionData),
    [grid, solutionData],
  )

  return (
    <div className={cn("relative", className)}>
      <WordGrid grid={legacyGrid} largePrint={largePrint} />
    </div>
  )
}
