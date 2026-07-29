"use client"

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { cn } from "@/lib/utils"
import {
  cellFromPointer,
  lineBetween,
  matchPlacement,
  readGridPointerMetrics,
  type Cell,
  type Grid,
} from "@/lib/puzzle-engine"

type WordGridProps = {
  grid: Grid
  /** When true, the grid is just for display (no interaction). */
  readOnly?: boolean
  /** Grand format / haute lisibilité — cellules ~×1.4, contraste renforcé. */
  largePrint?: boolean
  onWordFound?: (word: string) => void
  className?: string
}

function key(cell: Cell) {
  return `${cell.r}-${cell.c}`
}

function sameCell(a: Cell | null, b: Cell | null) {
  return !!a && !!b && a.r === b.r && a.c === b.c
}

export function WordGrid({
  grid,
  readOnly = false,
  largePrint = false,
  onWordFound,
  className,
}: WordGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const selectingRef = useRef(false)
  const startRef = useRef<Cell | null>(null)
  const endRef = useRef<Cell | null>(null)
  const foundWordsRef = useRef<Set<string>>(new Set())

  const [start, setStart] = useState<Cell | null>(null)
  const [end, setEnd] = useState<Cell | null>(null)
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set())

  const selection = useMemo<Cell[]>(() => {
    if (!start) return []
    const tip = end ?? start
    return lineBetween(start, tip) ?? [start]
  }, [start, end])

  const selectionSet = useMemo(() => new Set(selection.map(key)), [selection])

  function cellAt(clientX: number, clientY: number): Cell | null {
    const el = gridRef.current
    if (!el) return null
    return cellFromPointer(clientX, clientY, readGridPointerMetrics(el, grid.size))
  }

  function clearSelection() {
    selectingRef.current = false
    startRef.current = null
    endRef.current = null
    setStart(null)
    setEnd(null)
  }

  function commitSelection(from: Cell, to: Cell) {
    const line = lineBetween(from, to)
    if (!line) return
    const match = matchPlacement(line, grid.placements, foundWordsRef.current)
    if (!match) return

    foundWordsRef.current = new Set(foundWordsRef.current).add(match.word)
    setFoundCells((prev) => {
      const next = new Set(prev)
      match.cells.forEach((c) => next.add(key(c)))
      return next
    })
    onWordFound?.(match.word)
  }

  function handlePointerDown(cell: Cell, event: ReactPointerEvent) {
    if (readOnly || event.button !== 0) return
    event.preventDefault()
    gridRef.current?.setPointerCapture(event.pointerId)
    selectingRef.current = true
    startRef.current = cell
    endRef.current = cell
    setStart(cell)
    setEnd(cell)
  }

  function handlePointerMove(event: ReactPointerEvent) {
    if (!selectingRef.current) return
    const cell = cellAt(event.clientX, event.clientY)
    if (!cell || sameCell(endRef.current, cell)) return
    endRef.current = cell
    setEnd(cell)
  }

  function handlePointerUp(event: ReactPointerEvent) {
    if (!selectingRef.current) return
    if (gridRef.current?.hasPointerCapture(event.pointerId)) {
      gridRef.current.releasePointerCapture(event.pointerId)
    }
    const from = startRef.current
    const to = cellAt(event.clientX, event.clientY) ?? endRef.current ?? from
    clearSelection()
    if (from && to) commitSelection(from, to)
  }

  function handlePointerCancel(event: ReactPointerEvent) {
    if (!selectingRef.current) return
    if (gridRef.current?.hasPointerCapture(event.pointerId)) {
      gridRef.current.releasePointerCapture(event.pointerId)
    }
    clearSelection()
  }

  return (
    <div
      ref={gridRef}
      translate="no"
      className={cn(
        "notranslate inline-grid touch-none select-none rounded-2xl bg-card p-2 shadow-sm",
        largePrint ? "gap-1 p-3 sm:gap-1.5 sm:p-4" : "gap-0.5 sm:gap-1 sm:p-3",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${grid.size}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Grille de mots mêlés"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
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
              onPointerDown={(event) => handlePointerDown(cell, event)}
              className={cn(
                "flex aspect-square items-center justify-center font-bold uppercase transition-colors",
                largePrint
                  ? "min-w-[26px] rounded-lg border border-border bg-background text-sm sm:text-base md:text-xl"
                  : "min-w-[18px] rounded-md text-[10px] sm:rounded-lg sm:text-sm md:text-base",
                isFound && "bg-leaf text-leaf-foreground",
                !isFound && isSelected && "bg-accent text-accent-foreground",
                !isFound &&
                  !isSelected &&
                  (largePrint
                    ? "bg-background text-foreground hover:bg-muted"
                    : "bg-muted/60 text-foreground hover:bg-secondary/20"),
                readOnly ? "cursor-default" : "cursor-pointer",
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
