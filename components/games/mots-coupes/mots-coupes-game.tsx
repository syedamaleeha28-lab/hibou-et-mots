"use client"

import { useState } from "react"
import Link from "next/link"
import { getDayIndex, getPuzzleForDay } from "@/lib/mots-coupes/engine"
import { MOTS_COUPES_PUZZLES } from "@/lib/mots-coupes/puzzles"
import { MotsCoupesBoard } from "./mots-coupes-board"

export function MotsCoupesGame() {
  const [dayIndex] = useState(() => getDayIndex())
  const puzzle = getPuzzleForDay(dayIndex, MOTS_COUPES_PUZZLES)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-extrabold text-foreground">
          Grille #{dayIndex}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sunny/20 px-3 py-1 text-sm font-extrabold text-foreground">
          Niveau {puzzle.tier}
        </span>
      </div>
      <MotsCoupesBoard puzzle={puzzle} />
      <p className="no-print text-sm font-semibold text-muted-foreground">
        Une nouvelle grille chaque jour. Tu préfères imprimer plusieurs grilles d&apos;un coup ?{" "}
        <Link href="/mots-coupes-a-imprimer/" className="text-primary underline">
          Voir les mots coupés à imprimer
        </Link>
        .
      </p>
    </div>
  )
}
