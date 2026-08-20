"use client"

import { Printer } from "lucide-react"
import { MOTS_COUPES_PUZZLES } from "@/lib/mots-coupes/puzzles"
import { MotsCoupesBoard } from "./mots-coupes-board"

export function PrintableMotsCoupesList() {
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

      {MOTS_COUPES_PUZZLES.map((puzzle) => (
        <div
          key={puzzle.id}
          className="break-inside-avoid rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sunny/20 px-3 py-1 text-sm font-extrabold text-foreground">
              Niveau {puzzle.tier}
            </span>
          </div>
          <MotsCoupesBoard puzzle={puzzle} />
        </div>
      ))}
    </div>
  )
}
