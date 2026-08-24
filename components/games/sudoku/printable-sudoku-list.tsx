"use client"

import { Printer } from "lucide-react"
import { SUDOKU_PUZZLES } from "@/lib/sudoku/puzzles"
import { SudokuBoard } from "./sudoku-board"

const TIER_LABEL: Record<1 | 2, string> = { 1: "Facile", 2: "Difficile" }

export function PrintableSudokuList() {
  return (
    <div className="flex flex-col gap-10">
      <div className="no-print flex justify-end">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground hover:bg-primary/90"
        >
          <Printer className="size-4" />
          Imprimer cette page
        </button>
      </div>

      {SUDOKU_PUZZLES.map((puzzle) => (
        <div
          key={puzzle.id}
          className="break-inside-avoid flex flex-col items-center rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sunny/20 px-3 py-1 text-sm font-extrabold text-foreground">
              {TIER_LABEL[puzzle.tier]}
            </span>
          </div>
          <SudokuBoard puzzle={puzzle} />
        </div>
      ))}
    </div>
  )
}
