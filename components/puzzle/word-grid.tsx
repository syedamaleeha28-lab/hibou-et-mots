"use client"

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { cn } from "@/lib/utils"
import {
  areSameCell,
  cellFromPointer,
  readGridPointerMetrics,
  resolveSelectionEnd,
  selectionPreview,
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
  /** Fired once a letter selection gesture begins (pointer down on a cell). */
  onSelectionStart?: () => void
  /** Tier-1 hint: briefly pulses a single cell (e.g. a word's first letter) without marking anything found. */
  pulseCell?: Cell | null
  /** Tier-2 hint: programmatically reveals a whole word, same as if the player found it. Bump `token` to re-trigger for the same word. */
  revealWord?: { word: string; token: number } | null
  className?: string
}

const FOUND_FLASH_MS = 560

function key(cell: Cell) {
  return `${cell.r}-${cell.c}`
}

export function WordGrid({
  grid,
  readOnly = false,
  largePrint = false,
  onWordFound,
  onSelectionStart,
  pulseCell = null,
  revealWord = null,
  className,
}: WordGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const selectingRef = useRef(false)
  const startRef = useRef<Cell | null>(null)
  const endRef = useRef<Cell | null>(null)
  const foundWordsRef = useRef<Set<string>>(new Set())
  const flashTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const [pulsingCellKey, setPulsingCellKey] = useState<string | null>(null)

  const [start, setStart] = useState<Cell | null>(null)
  const [end, setEnd] = useState<Cell | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set())
  const [flashingCells, setFlashingCells] = useState<Set<string>>(new Set())

  const selection = useMemo<Cell[]>(() => {
    if (!start) return []
    return selectionPreview(start, end ?? start)
  }, [start, end])

  const selectionSet = useMemo(() => new Set(selection.map(key)), [selection])

  useEffect(() => {
    const timers = flashTimersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  // Tier-1 hint: pulse a single cell for a moment (no found-state change).
  useEffect(() => {
    if (!pulseCell) return
    const k = key(pulseCell)
    setPulsingCellKey(k)
    const timer = setTimeout(() => setPulsingCellKey(null), 1400)
    return () => clearTimeout(timer)
  }, [pulseCell])

  // Tier-2 hint: reveal an entire word programmatically, same as a real find.
  useEffect(() => {
    if (!revealWord) return
    if (foundWordsRef.current.has(revealWord.word)) return
    const placement = grid.placements.find((p) => p.word === revealWord.word)
    if (!placement) return
    foundWordsRef.current = new Set(foundWordsRef.current).add(revealWord.word)
    setFoundCells((prev) => {
      const next = new Set(prev)
      placement.cells.forEach((c) => next.add(key(c)))
      return next
    })
    const keys = placement.cells.map(key)
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
    onWordFound?.(revealWord.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealWord])

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

  function releasePointer(event: ReactPointerEvent) {
    if (gridRef.current?.hasPointerCapture(event.pointerId)) {
      gridRef.current.releasePointerCapture(event.pointerId)
    }
  }

  function keepAnchor(cell: Cell) {
    selectingRef.current = false
    startRef.current = cell
    endRef.current = cell
    setIsSelecting(false)
    setStart(cell)
    setEnd(cell)
  }

  function markFound(word: string, cells: Cell[]) {
    foundWordsRef.current = new Set(foundWordsRef.current).add(word)
    setFoundCells((prev) => {
      const next = new Set(prev)
      cells.forEach((c) => next.add(key(c)))
      return next
    })
    flashFoundCells(cells)
    onWordFound?.(word)
  }

  function finishGesture(from: Cell, to: Cell) {
    const result = resolveSelectionEnd(from, to, grid.placements, foundWordsRef.current)
    if (result.kind === "anchor") {
      keepAnchor(result.cell)
      return
    }
    if (result.kind === "found") {
      markFound(result.word, result.cells)
    }
    clearSelection()
  }

  function handlePointerDown(cell: Cell, event: ReactPointerEvent) {
    if (readOnly || event.button !== 0) return
    event.preventDefault()
    onSelectionStart?.()

    const anchored = startRef.current
    const hasRestingAnchor =
      !!anchored && !selectingRef.current && !areSameCell(anchored, cell)

    gridRef.current?.setPointerCapture(event.pointerId)
    selectingRef.current = true

    if (hasRestingAnchor && anchored) {
      // Second click / drag from a previously tapped start letter.
      startRef.current = anchored
      endRef.current = cell
      setIsSelecting(true)
      setStart(anchored)
      setEnd(cell)
      return
    }

    startRef.current = cell
    endRef.current = cell
    setIsSelecting(true)
    setStart(cell)
    setEnd(cell)
  }

  function handlePointerMove(event: ReactPointerEvent) {
    if (!selectingRef.current) return
    const cell = cellAt(event.clientX, event.clientY)
    if (!cell || (endRef.current && areSameCell(endRef.current, cell))) return
    endRef.current = cell
    setEnd(cell)
  }

  function handlePointerUp(event: ReactPointerEvent) {
    if (!selectingRef.current) return
    releasePointer(event)

    const from = startRef.current
    const to = cellAt(event.clientX, event.clientY) ?? endRef.current ?? from
    if (!from || !to) {
      clearSelection()
      return
    }
    finishGesture(from, to)
  }

  function handlePointerCancel(event: ReactPointerEvent) {
    if (!selectingRef.current && !startRef.current) return
    releasePointer(event)
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
            const isPulsing = pulsingCellKey === k
            const state = isFound ? "found" : isSelected ? "selected" : "idle"
            return (
              <button
                key={k}
                type="button"
                disabled={readOnly}
                data-state={state}
                aria-pressed={isSelected || isFound}
                onPointerDown={(event) => handlePointerDown(cell, event)}
                className={cn(
                  "flex aspect-square min-h-11 min-w-11 items-center justify-center font-bold uppercase",
                  "transition-[background-color,color,transform,box-shadow] duration-150",
                  largePrint
                    ? "rounded-xl border border-border text-base sm:min-h-12 sm:min-w-12 sm:text-lg md:text-xl"
                    : "rounded-lg text-sm sm:rounded-xl sm:text-base md:text-lg",
                  // Found = distinct green (final confirmed color)
                  isFound && "bg-leaf text-leaf-foreground",
                  isFlashing && "animate-word-found bg-sunny text-sunny-foreground",
                  // Active drag path = strong sunny highlight along the full line
                  !isFound &&
                    isSelected &&
                    isSelecting &&
                    "z-10 scale-105 bg-sunny text-sunny-foreground shadow-md ring-2 ring-sunny/50",
                  // Resting start letter after a tap
                  !isFound &&
                    isSelected &&
                    !isSelecting &&
                    "bg-sunny/80 text-sunny-foreground ring-2 ring-sunny/40",
                  !isFound &&
                    !isSelected &&
                    (largePrint
                      ? "bg-background text-foreground hover:bg-muted"
                      : "bg-muted/60 text-foreground hover:bg-secondary/20"),
                  isPulsing && !isFound && "animate-word-found ring-4 ring-secondary/70",
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
