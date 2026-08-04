"use client"

import { useMemo, useRef, useState } from "react"
import { Check, Eye, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CrosswordEntry, CrosswordGrid } from "@/lib/mini-crossword/grids"
import {
  cellKey,
  entryCells,
  isEntryCorrect,
  isEntryFilled,
  isGridComplete,
  type CellValues,
} from "@/lib/mini-crossword/engine"

type Direction = "across" | "down"

type CrosswordBoardProps = {
  grid: CrosswordGrid
  className?: string
}

/** Which numbered entry (if any) starts at each cell, per direction — for rendering clue numbers. */
function buildNumberMap(grid: CrosswordGrid): Map<string, number> {
  const map = new Map<string, number>()
  for (const entry of [...grid.across, ...grid.down]) {
    const k = cellKey(entry.row, entry.col)
    if (!map.has(k)) map.set(k, entry.number)
  }
  return map
}

export function CrosswordBoard({ grid, className }: CrosswordBoardProps) {
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())
  const [values, setValues] = useState<CellValues>({})
  const [activeEntry, setActiveEntry] = useState<{ entry: CrosswordEntry; dir: Direction } | null>(null)
  const [checkedWrong, setCheckedWrong] = useState<Set<string>>(new Set())
  const [hasChecked, setHasChecked] = useState(false)

  const numberMap = useMemo(() => buildNumberMap(grid), [grid])
  const complete = isGridComplete(grid, values)

  function entriesAt(row: number, col: number): { across?: CrosswordEntry; down?: CrosswordEntry } {
    const across = grid.across.find((e) => row === e.row && col >= e.col && col < e.col + e.len)
    const down = grid.down.find((e) => col === e.col && row >= e.row && row < e.row + e.len)
    return { across, down }
  }

  function selectCell(row: number, col: number, preferDir?: Direction) {
    const { across, down } = entriesAt(row, col)
    if (!across && !down) return
    const sameCellAgain =
      activeEntry &&
      entryCells(activeEntry.entry, activeEntry.dir).some((c) => c.row === row && c.col === col)
    let dir: Direction = preferDir ?? activeEntry?.dir ?? (across ? "across" : "down")
    if (sameCellAgain && !preferDir && across && down) {
      // Tapping the same cell again toggles direction when both are available.
      dir = activeEntry!.dir === "across" ? "down" : "across"
    }
    const entry = dir === "across" ? (across ?? down) : (down ?? across)
    if (!entry) return
    const actualDir: Direction = entry === across ? "across" : "down"
    setActiveEntry({ entry, dir: actualDir })
    focusCell(row, col)
  }

  function focusCell(row: number, col: number) {
    inputRefs.current.get(cellKey(row, col))?.focus()
  }

  function setLetter(row: number, col: number, letter: string) {
    const k = cellKey(row, col)
    setValues((prev) => ({ ...prev, [k]: letter }))
    setCheckedWrong((prev) => {
      if (!prev.has(k)) return prev
      const next = new Set(prev)
      next.delete(k)
      return next
    })
  }

  function moveWithinActiveEntry(row: number, col: number, delta: 1 | -1) {
    if (!activeEntry) return
    const cells = entryCells(activeEntry.entry, activeEntry.dir)
    const idx = cells.findIndex((c) => c.row === row && c.col === col)
    const nextIdx = idx + delta
    if (nextIdx >= 0 && nextIdx < cells.length) {
      const next = cells[nextIdx]!
      focusCell(next.row, next.col)
    }
  }

  function handleInput(row: number, col: number, raw: string) {
    const letter = raw.trim().slice(-1).toUpperCase()
    if (letter && !/^[A-Z]$/.test(letter)) return
    setLetter(row, col, letter)
    if (letter) moveWithinActiveEntry(row, col, 1)
  }

  function handleKeyDown(row: number, col: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      const k = cellKey(row, col)
      if (!values[k]) {
        event.preventDefault()
        moveWithinActiveEntry(row, col, -1)
      }
      return
    }
    if (event.key === "ArrowRight") { event.preventDefault(); focusCell(row, col + 1) }
    if (event.key === "ArrowLeft") { event.preventDefault(); focusCell(row, col - 1) }
    if (event.key === "ArrowDown") { event.preventDefault(); focusCell(row + 1, col) }
    if (event.key === "ArrowUp") { event.preventDefault(); focusCell(row - 1, col) }
  }

  function handleCheck() {
    const wrong = new Set<string>()
    for (const entry of [...grid.across, ...grid.down]) {
      const dir: Direction = grid.across.includes(entry) ? "across" : "down"
      if (isEntryFilled(entry, dir, values) && !isEntryCorrect(entry, dir, values)) {
        entryCells(entry, dir).forEach((c) => wrong.add(cellKey(c.row, c.col)))
      }
    }
    setCheckedWrong(wrong)
    setHasChecked(true)
  }

  function selectEntry(entry: CrosswordEntry, dir: Direction) {
    setActiveEntry({ entry, dir })
    focusCell(entry.row, entry.col)
  }

  const activeCellKeys = useMemo(
    () => new Set(activeEntry ? entryCells(activeEntry.entry, activeEntry.dir).map((c) => cellKey(c.row, c.col)) : []),
    [activeEntry],
  )

  return (
    <div className={cn("flex flex-col gap-6 lg:flex-row lg:items-start", className)}>
      <div className="print-crossword-grid inline-grid gap-0.5 rounded-2xl bg-card p-2 shadow-sm sm:p-3" style={{ gridTemplateColumns: `repeat(${grid.rows[0]?.length ?? 1}, minmax(2.5rem, 3.25rem))` }}>
        {grid.rows.map((row, r) =>
          row.map((cell, c) => {
            const k = cellKey(r, c)
            if (cell === null) {
              return <div key={k} className="aspect-square rounded-md bg-foreground/80" aria-hidden="true" />
            }
            const number = numberMap.get(k)
            const isActive = activeCellKeys.has(k)
            const isWrong = checkedWrong.has(k)
            return (
              <div key={k} className="relative">
                {number && (
                  <span className="pointer-events-none absolute left-0.5 top-0 text-[9px] font-bold text-muted-foreground sm:text-[10px]">
                    {number}
                  </span>
                )}
                <input
                  ref={(el) => {
                    if (el) inputRefs.current.set(k, el)
                    else inputRefs.current.delete(k)
                  }}
                  value={values[k] ?? ""}
                  onFocus={() => selectCell(r, c)}
                  onClick={() => selectCell(r, c)}
                  onChange={(e) => handleInput(r, c, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(r, c, e)}
                  maxLength={1}
                  aria-label={`Case ligne ${r + 1} colonne ${c + 1}`}
                  className={cn(
                    "aspect-square w-full min-h-11 min-w-11 rounded-md border-2 text-center font-bold uppercase text-foreground sm:min-h-12 sm:min-w-12 sm:text-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    isWrong && "border-destructive bg-destructive/15",
                    !isWrong && isActive && "border-sunny bg-sunny/25",
                    !isWrong && !isActive && "border-border bg-background",
                  )}
                />
              </div>
            )
          }),
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
            Horizontal
          </h3>
          <ul className="mt-1 space-y-1">
            {grid.across.map((entry) => (
              <ClueRow key={`a${entry.number}`} entry={entry} dir="across" values={values} active={activeEntry?.entry === entry} onSelect={selectEntry} />
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
            Vertical
          </h3>
          <ul className="mt-1 space-y-1">
            {grid.down.map((entry) => (
              <ClueRow key={`d${entry.number}`} entry={entry} dir="down" values={values} active={activeEntry?.entry === entry} onSelect={selectEntry} />
            ))}
          </ul>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleCheck}
            className="rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground hover:bg-primary/90"
          >
            <Eye className="mr-1.5 inline size-4" />
            Vérifier
          </button>
          {hasChecked && !complete && (
            <span className="text-sm font-semibold text-muted-foreground">
              Les cases en rouge ne sont pas encore correctes.
            </span>
          )}
        </div>

        {complete && (
          <div className="no-print flex items-center gap-3 rounded-2xl bg-leaf/12 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf text-leaf-foreground">
              <Trophy className="size-5" />
            </span>
            <p className="font-heading font-extrabold text-foreground">Bravo ! Grille complétée.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ClueRow({
  entry,
  dir,
  values,
  active,
  onSelect,
}: {
  entry: CrosswordEntry
  dir: Direction
  values: CellValues
  active: boolean
  onSelect: (entry: CrosswordEntry, dir: Direction) => void
}) {
  const solved = isEntryFilled(entry, dir, values) && isEntryCorrect(entry, dir, values)
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(entry, dir)}
        className={cn(
          "flex w-full items-start gap-2 rounded-lg px-2 py-1 text-left text-sm transition-colors",
          active ? "bg-sunny/20" : "hover:bg-muted",
          solved && "text-muted-foreground line-through",
        )}
      >
        {solved && <Check className="mt-0.5 size-3.5 shrink-0 text-leaf" />}
        <span>
          <strong>{entry.number}.</strong> {entry.clue}
        </span>
      </button>
    </li>
  )
}
