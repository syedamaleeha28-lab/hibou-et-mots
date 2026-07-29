"use client"

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
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

const FOUND_FLASH_MS = 560

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
  const flashTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const [start, setStart] = useState<Cell | null>(null)
  const [end, setEnd] = useState<Cell | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set())
  const [flashingCells, setFlashingCells] = useState<Set<string>>(new Set())

  const selection = useMemo<Cell[]>(() => {
    if (!start) return []
    const tip = end ?? start
    return lineBetween(start, tip) ?? [start]
  }, [start, end])

  const selectionSet = useMemo(() => new Set(selection.map(key)), [selection])

  useEffect(() => {
    const timers = flashTimersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  function cellAt(clientX: number, clientY: number): Cell | null {
    const el = gridRef.current
    if (!el) return null
    return cellFromPointer(clientX, clientY, readGridPointerMetrics(el, grid.size))
  }

  function clearSelection() {
    selectingRef.current = false
    startRef.current = null
    endRef.current = null
    setIsSelecting(false)
    setStart(null)
    setEnd(null)
  }

  function flashFoundCells(cells: Cell[]) {
    const keys = cells.map(key)
    setFlashingCells((prev) => {
      const next = new Set(prev)
      keys.forEach((k) => next.add(k))
      return next
    })
    keys.forEach((k) => {
      const existing = flashTimersRef.current.get(k)
      if (existing) clearTimeout(existing)
      flashTimersRef.current.set(
        k,
        setTimeout(() => {
          flashTimersRef.current.delete(k)
          setFlashingCells((prev) => {
            const next = new Set(prev)
            next.delete(k)
            return next
          })
        }, FOUND_FLASH_MS),
      )
    })
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
    flashFoundCells(match.cells)
    onWordFound?.(match.word)
  }

  function handlePointerDown(cell: Cell, event: ReactPointerEvent) {
    if (readOnly || event.button !== 0) return
    event.preventDefault()
    gridRef.current?.setPointerCapture(event.pointerId)
    selectingRef.current = true
    startRef.current = cell
    endRef.current = cell
    setIsSelecting(true)
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
    <div className={cn("max-w-full overflow-x-auto", className)}>
      <div
        ref={gridRef}
        translate="no"
        className={cn(
          "notranslate inline-grid touch-none select-none rounded-2xl bg-card p-2 shadow-sm sm:p-3",
          largePrint ? "gap-1.5 p-3 sm:gap-2 sm:p-4" : "gap-1 sm:gap-1.5",
        )}
        style={{
          gridTemplateColumns: `repeat(${grid.size}, minmax(2.75rem, 1fr))`,
        }}
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
            const isFlashing = flashingCells.has(k)
            return (
              <button
                key={k}
                type="button"
                disabled={readOnly}
                onPointerDown={(event) => handlePointerDown(cell, event)}
                className={cn(
                  "flex aspect-square min-h-11 min-w-11 items-center justify-center font-bold uppercase",
                  "transition-[background-color,color,transform,box-shadow] duration-150",
                  largePrint
                    ? "rounded-xl border border-border text-base sm:min-h-12 sm:min-w-12 sm:text-lg md:text-xl"
                    : "rounded-lg text-sm sm:rounded-xl sm:text-base md:text-lg",
                  isFound && "bg-leaf text-leaf-foreground",
                  isFlashing && "animate-word-found bg-sunny text-sunny-foreground",
                  !isFound &&
                    isSelected &&
                    isSelecting &&
                    "z-10 scale-105 bg-sunny text-sunny-foreground shadow-md ring-2 ring-sunny/50",
                  !isFound &&
                    isSelected &&
                    !isSelecting &&
                    "bg-accent text-accent-foreground",
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
    </div>
  )
}

export type { WordGridProps }
