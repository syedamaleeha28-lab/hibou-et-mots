"use client"

import { useMemo } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type WordListPanelProps = {
  words: string[]
  /** Words the player has actually found in the grid (controlled from the parent). */
  foundWords?: string[]
  className?: string
}

export function WordListPanel({ words, foundWords = [], className }: WordListPanelProps) {
  const foundSet = useMemo(() => new Set(foundWords), [foundWords])

  const sortedWords = useMemo(
    () => [...words].sort((a, b) => a.localeCompare(b, "fr")),
    [words],
  )

  return (
    <section
      className={cn("rounded-2xl border border-border bg-card p-4 sm:p-5", className)}
      aria-label="Liste des mots à trouver"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-extrabold text-foreground">Mots à trouver</h2>
        <span className="text-sm font-bold text-muted-foreground">
          {foundSet.size} / {words.length}
        </span>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {sortedWords.map((word) => {
          const found = foundSet.has(word)
          return (
            <li key={word}>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide transition-colors",
                  found ? "bg-leaf/20 text-leaf line-through" : "bg-muted text-foreground",
                )}
              >
                {found && <Check className="size-3.5" />}
                {word}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
