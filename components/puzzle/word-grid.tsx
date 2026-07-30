"use client"

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { cn } from "@/lib/utils"
import {
  areSameCell,
  cellFromPointer,
  extendSelectionWithCell,
  lineBetween,
  matchPlacement,
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
  /**
   * When true: letters can be built up one click/tap at a time (in addition to
   * dragging), the selection stays yellow/"pending" until the player presses
   * "Valider", and the grid shows explicit correct/incorrect feedback instead
   * of auto-validating the instant a line is completed. Default false keeps
   * the original auto-validate-on-release behavior unchanged.
   */
  requireSubmit?: boolean
  className?: string
}

const FOUND_FLASH_MS = 560
const WRONG_FLASH_MS = 650

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
  requireSubmit = false,
  className,
}: WordGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const selectingRef = useRef(false)
  const startRef = useRef<Cell | null>(null)
  const endRef = useRef<Cell | null>(null)
  const foundWordsRef = useRef<Set<string>>(new Set())
  const flashTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const wrongTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pulsingCellKey, setPulsingCellKey] = useState<string | null>(null)

  // --- Original (auto-validate-on-release) selection state ---
  const [start, setStart] = useState<Cell | null>(null)
  const [end, setEnd] = useState<Cell | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)

  // --- requireSubmit-mode selection state ---
  const [pendingCells, setPendingCells] = useState<Cell[]>([])
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set())
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(
    null,
  )
  const isDraggingRef = useRef(false)
  const dragAnchorRef = useRef<Cell | null>(null)
  const [liveDragEnd, setLiveDragEnd] = useState<Cell | null>(null)

  const [foundCells, setFoundCells] = useState<Set<string>>(new Set())
  const [flashingCells, setFlashingCells] = useState<Set<string>>(new Set())

  const selection = useMemo<Cell[]>(() => {
    if (!start) return []
    return selectionPreview(start, end ?? start)
  }, [start, end])

  const liveDragPreview = useMemo<Cell[]>(() => {
    if (!requireSubmit || !isDraggingRef.current || !dragAnchorRef.current) return []
    return selectionPreview(dragAnchorRef.current, liveDragEnd ?? dragAnchorRef.current)
  }, [requireSubmit, liveDragEnd])

  const pendingSet = useMemo(
    () => new Set((liveDragPreview.length > 0 ? liveDragPreview : pendingCells).map(key)),
    [liveDragPreview, pendingCells],
  )

  const selectionSet = useMemo(() => new Set(selection.map(key)), [selection])

  useEffect(() => {
    const timers = flashTimersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current)
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

  // ---------- requireSubmit-mode helpers ----------

  function cellsMatch(a: Cell[], b: Cell[]): boolean {
    if (a.length !== b.length) return false
    const forward = a.every((c, i) => c.r === b[i]!.r && c.c === b[i]!.c)
    const backward = a.every((c, i) => c.r === b[b.length - 1 - i]!.r && c.c === b[b.length - 1 - i]!.c)
    return forward || backward
  }

  function showWrongFlash(cells: Cell[]) {
    const keys = cells.map(key)
    setWrongCells(new Set(keys))
    if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current)
    wrongTimerRef.current = setTimeout(() => {
      setWrongCells(new Set())
      setPendingCells([])
    }, WRONG_FLASH_MS)
  }

  function extendPendingWithClick(cell: Cell) {
    setPendingCells((prev) => extendSelectionWithCell(prev, cell))
    setStatusMessage(null)
  }

  function handleSubmit() {
    if (pendingCells.length < 2) return
    const match = matchPlacement(pendingCells, grid.placements, foundWordsRef.current)
    if (match) {
      markFound(match.word, match.cells)
      setPendingCells([])
      setStatusMessage({ type: "success", text: `Bravo, "${match.word}" trouvé !` })
      return
    }
    const isDuplicate = grid.placements.some(
      (p) => foundWordsRef.current.has(p.word) && cellsMatch(p.cells, pendingCells),
    )
    if (isDuplicate) {
      setStatusMessage({ type: "info", text: "Ce mot est déjà trouvé !" })
      setPendingCells([])
      return
    }
    setStatusMessage({ type: "error", text: "Ce n'est pas un mot mêlé. Réessaie !" })
    showWrongFlash(pendingCells)
  }

  // ---------- Pointer handlers ----------

  function handlePointerDown(cell: Cell, event: ReactPointerEvent) {
    if (readOnly || event.button !== 0) return
    event.preventDefault()
    onSelectionStart?.()

    if (requireSubmit) {
      gridRef.current?.setPointerCapture(event.pointerId)
      isDraggingRef.current = false
      dragAnchorRef.current = cell
      setLiveDragEnd(cell)
      return
    }

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
    if (requireSubmit) {
      if (!dragAnchorRef.current) return
      const cell = cellAt(event.clientX, event.clientY)
      if (!cell) return
      if (!areSameCell(cell, dragAnchorRef.current)) isDraggingRef.current = true
      setLiveDragEnd((prev) => (prev && areSameCell(prev, cell) ? prev : cell))
      return
    }
    if (!selectingRef.current) return
    const cell = cellAt(event.clientX, event.clientY)
    if (!cell || (endRef.current && areSameCell(endRef.current, cell))) return
    endRef.current = cell
    setEnd(cell)
  }

  function handlePointerUp(event: ReactPointerEvent) {
    if (requireSubmit) {
      if (!dragAnchorRef.current) return
      releasePointer(event)
      const anchor = dragAnchorRef.current
      const releaseCell = cellAt(event.clientX, event.clientY) ?? liveDragEnd ?? anchor
      const wasDragging = isDraggingRef.current
      dragAnchorRef.current = null
      isDraggingRef.current = false
      setLiveDragEnd(null)
      setStatusMessage(null)

      if (!wasDragging) {
        extendPendingWithClick(anchor)
        return
      }
      const line = lineBetween(anchor, releaseCell)
      setPendingCells(line ?? [anchor])
      return
    }

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
    if (requireSubmit) {
      releasePointer(event)
      dragAnchorRef.current = null
      isDraggingRef.current = false
      setLiveDragEnd(null)
      return
    }
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
            const isWrong = requireSubmit && wrongCells.has(k)
            const isPending = requireSubmit && pendingSet.has(k)
            const isSelected = !requireSubmit && selectionSet.has(k)
            const isFlashing = flashingCells.has(k)
            const isPulsing = pulsingCellKey === k
            const state = isFound ? "found" : isSelected || isPending ? "selected" : "idle"
            return (
              <button
                key={k}
                type="button"
                disabled={readOnly}
                data-state={state}
                aria-pressed={isSelected || isPending || isFound}
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
                  isWrong && "bg-destructive/80 text-white",
                  // Active drag path = strong sunny highlight along the full line
                  !isFound &&
                    !isWrong &&
                    isSelected &&
                    isSelecting &&
                    "z-10 scale-105 bg-sunny text-sunny-foreground shadow-md ring-2 ring-sunny/50",
                  // Resting start letter after a tap
                  !isFound &&
                    !isWrong &&
                    isSelected &&
                    !isSelecting &&
                    "bg-sunny/80 text-sunny-foreground ring-2 ring-sunny/40",
                  // requireSubmit mode: pending (yellow) selection built via click or drag
                  !isFound &&
                    !isWrong &&
                    isPending &&
                    "z-10 scale-105 bg-sunny text-sunny-foreground shadow-md ring-2 ring-sunny/50",
                  !isFound &&
                    !isWrong &&
                    !isSelected &&
                    !isPending &&
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

      {requireSubmit && !readOnly && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pendingCells.length < 2}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-extrabold transition-colors",
              pendingCells.length < 2
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            Valider le mot
          </button>
          <span className="text-xs font-semibold text-muted-foreground">
            {pendingCells.length === 0
              ? "Touche les lettres d'un mot, puis valide."
              : `${pendingCells.length} lettre(s) sélectionnée(s)`}
          </span>
          {statusMessage && (
            <span
              role="status"
              aria-live="polite"
              className={cn(
                "text-sm font-bold",
                statusMessage.type === "success" && "text-leaf",
                statusMessage.type === "error" && "text-destructive",
                statusMessage.type === "info" && "text-muted-foreground",
              )}
            >
              {statusMessage.text}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export type { WordGridProps }
