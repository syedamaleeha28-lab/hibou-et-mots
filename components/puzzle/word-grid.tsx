"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { cellsEqual, lineBetween, type Cell, type Grid } from "@/lib/puzzle-engine"

type WordGridProps = {
  grid: Grid
  /** When true, the grid is just for display (no interaction). */
  readOnly?: boolean
  onWordFound?: (word: string) => void
  className?: string
}

function key(cell: Cell) {
  return `${cell.r}-${cell.c}`
}

export function WordGrid({ grid, readOnly = false, onWordFound, className }: WordGridProps) {
  const [start, setStart] = useState<Cell | null>(null)
  const [hover, setHover] = useState<Cell | null>(null)
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set())
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())

  const selection = useMemo<Cell[]>(() => {
    if (!start) return []
    const end = hover ?? start
    return lineBetween(start, end) ?? [start]
  }, [start, hover])

  const selectionSet = useMemo(() => new Set(selection.map(key)), [selection])

  function handleCellClick(cell: Cell) {
    if (readOnly) return
    if (!start) {
      setStart(cell)
      setHover(cell)
      return
    }
    const line = lineBetween(start, cell)
    if (line) {
      const match = grid.placements.find((p) => cellsEqual(p.cells, line))
      if (match && !foundWords.has(match.word)) {
        setFoundWords((prev) => new Set(prev).add(match.word))
        setFoundCells((prev) => {
          const next = new Set(prev)
          match.cells.forEach((c) => next.add(key(c)))
          return next
        })
        onWordFound?.(match.word)
      }
    }
    setStart(null)
    setHover(null)
  }

  return (
    <div
      className={cn(
        "inline-grid select-none gap-0.5 rounded-2xl bg-card p-2 shadow-sm sm:gap-1 sm:p-3",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${grid.size}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Grille de mots mêlés"
    >
      {grid.letters.map((row, r) =>
        row.map((letter, c) => {
          const cell = { r, c }
          const k = key(cell)
          const isFound = foundCells.has(k)
          const isSelected = selectionSet.has(k)
          return (
            <button
              key={k}
              type="button"
              disabled={readOnly}
              onClick={() => handleCellClick(cell)}
              onMouseEnter={() => start && setHover(cell)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md text-[10px] font-bold uppercase transition-colors sm:rounded-lg sm:text-sm md:text-base",
                "min-w-[18px]",
                isFound && "bg-leaf text-leaf-foreground",
                !isFound && isSelected && "bg-accent text-accent-foreground",
                !isFound && !isSelected && "bg-muted/60 text-foreground hover:bg-secondary/20",
                readOnly && "cursor-default",
              )}
              aria-label={`Lettre ${letter}`}
            >
              {letter}
            </button>
          )
        }),
      )}
    </div>
  )
}

export type { WordGridProps }
