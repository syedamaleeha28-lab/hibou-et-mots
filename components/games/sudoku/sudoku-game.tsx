"use client"

import { useState } from "react"
import Link from "next/link"
import { getDayIndex, getPuzzleForDay } from "@/lib/sudoku/engine"
import { SUDOKU_PUZZLES } from "@/lib/sudoku/puzzles"
import { SudokuBoard } from "./sudoku-board"

const TIER_LABEL: Record<1 | 2, string> = { 1: "Facile", 2: "Difficile" }

export function SudokuGame() {
  const [dayIndex] = useState(() => getDayIndex())
  const puzzle = getPuzzleForDay(dayIndex, SUDOKU_PUZZLES)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-extrabold text-foreground">
          Grille #{dayIndex}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sunny/20 px-3 py-1 text-sm font-extrabold text-foreground">
          {TIER_LABEL[puzzle.tier]}
        </span>
      </div>
      <SudokuBoard puzzle={puzzle} />
      <p className="no-print text-sm font-semibold text-muted-foreground">
        Une nouvelle grille chaque jour. Tu préfères imprimer plusieurs grilles d&apos;un coup ?{" "}
        <Link href="/sudoku-a-imprimer/" className="text-primary underline">
          Voir les sudoku à imprimer
        </Link>
        .
      </p>
    </div>
  )
}
