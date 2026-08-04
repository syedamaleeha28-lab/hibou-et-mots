"use client"

import { useState } from "react"
import Link from "next/link"
import { getDayIndex, getGridForDay } from "@/lib/mini-crossword/engine"
import { MINI_CROSSWORD_GRIDS } from "@/lib/mini-crossword/grids"
import { CrosswordBoard } from "./crossword-board"

export function MiniCrosswordGame() {
  const [dayIndex] = useState(() => getDayIndex())
  const grid = getGridForDay(dayIndex, MINI_CROSSWORD_GRIDS)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-extrabold text-foreground">
          Grille #{dayIndex}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sunny/20 px-3 py-1 text-sm font-extrabold text-foreground">
          Force {grid.tier}
        </span>
      </div>
      <CrosswordBoard grid={grid} />
      <p className="no-print text-sm font-semibold text-muted-foreground">
        Une nouvelle grille chaque jour. Tu préfères choisir ton niveau ?{" "}
        <Link href="/mots-croises-force-1/" className="text-primary underline">
          Voir toutes les difficultés (Force 1 à 5)
        </Link>
        .
      </p>
    </div>
  )
}
