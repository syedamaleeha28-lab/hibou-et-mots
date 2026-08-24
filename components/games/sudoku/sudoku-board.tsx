"use client"

import { useMemo, useRef, useState } from "react"
import { Eye, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SudokuPuzzle } from "@/lib/sudoku/puzzles"
import {
  cellKey,
  findIncorrectCells,
  isGivenCell,
  isPuzzleComplete,
  type SudokuCellValues,
} from "@/lib/sudoku/engine"

type SudokuBoardProps = {
  puzzle: SudokuPuzzle
  className?: string
}

export function SudokuBoard({ puzzle, className }: SudokuBoardProps) {
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())
  const [values, setValues] = useState<SudokuCellValues>({})
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null)
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set())
  const [hasChecked, setHasChecked] = useState(false)

  const complete = isPuzzleComplete(puzzle, values)

  const activeUnit = useMemo(() => {
    if (!activeCell) return null
    const boxRow = Math.floor(activeCell.row / 3) * 3
    const boxCol = Math.floor(activeCell.col / 3) * 3
    return { ...activeCell, boxRow, boxCol }
  }, [activeCell])

  function isInActiveUnit(row: number, col: number): boolean {
    if (!activeUnit) return false
    if (row === activeUnit.row || col === activeUnit.col) return true
    return (
      row >= activeUnit.boxRow &&
      row < activeUnit.boxRow + 3 &&
      col >= activeUnit.boxCol &&
      col < activeUnit.boxCol + 3
    )
  }

  function focusCell(row: number, col: number) {
    if (row < 0 || row > 8 || col < 0 || col > 8) return
    inputRefs.current.get(cellKey(row, col))?.focus()
  }

  function setValue(row: number, col: number, raw: string) {
    const digit = raw.trim().slice(-1)
    if (digit && !/^[1-9]$/.test(digit)) return
    const key = cellKey(row, col)
    setValues((prev) => {
      const next = { ...prev }
      if (digit) next[key] = Number(digit)
      else delete next[key]
      return next
    })
    setWrongCells((prev) => {
      if (!prev.has(key)) return prev
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  function handleKeyDown(row: number, col: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); focusCell(row, col + 1) }
    if (event.key === "ArrowLeft") { event.preventDefault(); focusCell(row, col - 1) }
    if (event.key === "ArrowDown") { event.preventDefault(); focusCell(row + 1, col) }
    if (event.key === "ArrowUp") { event.preventDefault(); focusCell(row - 1, col) }
    if (event.key === "Backspace" || event.key === "Delete") {
      setValue(row, col, "")
    }
  }

  function handleCheck() {
    setWrongCells(findIncorrectCells(puzzle, values))
    setHasChecked(true)
  }

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div
        className="print-sudoku-grid inline-grid gap-0 rounded-2xl bg-card p-2 shadow-sm sm:p-3"
        style={{ gridTemplateColumns: "repeat(9, minmax(2.25rem, 2.75rem))" }}
      >
        {puzzle.puzzle.map((row, r) =>
          row.map((cellValue, c) => {
            const key = cellKey(r, c)
            const given = isGivenCell(puzzle, r, c)
            const isActive = activeCell?.row === r && activeCell?.col === c
            const inActiveUnit = !isActive && isInActiveUnit(r, c)
            const isWrong = wrongCells.has(key)

            return (
              <div
                key={key}
                className={cn(
                  "border-border",
                  c % 3 === 0 && "border-l-2",
                  c === 8 && "border-r-2",
                  r % 3 === 0 && "border-t-2",
                  r === 8 && "border-b-2",
                  "border-r border-b",
                )}
              >
                {given ? (
                  <div
                    className={cn(
                      "flex aspect-square min-h-9 min-w-9 items-center justify-center text-center font-extrabold text-foreground sm:min-h-11 sm:min-w-11 sm:text-lg",
                      inActiveUnit ? "bg-sunny/10" : "bg-muted/40",
                    )}
                  >
                    {cellValue}
                  </div>
                ) : (
                  <input
                    ref={(el) => {
                      if (el) inputRefs.current.set(key, el)
                      else inputRefs.current.delete(key)
                    }}
                    value={values[key] ?? ""}
                    onFocus={() => setActiveCell({ row: r, col: c })}
                    onClick={() => setActiveCell({ row: r, col: c })}
                    onChange={(e) => setValue(r, c, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(r, c, e)}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Case ligne ${r + 1} colonne ${c + 1}`}
                    className={cn(
                      "aspect-square min-h-9 min-w-9 w-full text-center font-bold text-foreground sm:min-h-11 sm:min-w-11 sm:text-lg",
                      "focus:outline-none focus:ring-2 focus:ring-primary",
                      isWrong && "bg-destructive/15 text-destructive",
                      !isWrong && isActive && "bg-sunny/25",
                      !isWrong && inActiveUnit && "bg-sunny/10",
                      !isWrong && !isActive && !inActiveUnit && "bg-background",
                    )}
                  />
                )}
              </div>
            )
          }),
        )}
      </div>

      <div className="no-print flex flex-wrap items-center justify-center gap-2">
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
  )
}
