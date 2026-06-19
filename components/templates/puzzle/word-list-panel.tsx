"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

type WordListPanelProps = {
  words: string[]
  className?: string
}

export function WordListPanel({ words, className }: WordListPanelProps) {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())

  const sortedWords = useMemo(
    () => [...words].sort((a, b) => a.localeCompare(b, "fr")),
    [words],
  )

  return (
    <section
      className={cn("rounded-2xl border border-border bg-card p-4 sm:p-5", className)}
      aria-label="Liste des mots à trouver"
    >
      <h2 className="font-heading text-lg font-extrabold text-foreground">Mots à trouver</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {sortedWords.map((word) => {
          const found = foundWords.has(word)
          return (
            <li key={word}>
              <button
                type="button"
                onClick={() =>
                  setFoundWords((prev) => {
                    const next = new Set(prev)
                    if (next.has(word)) next.delete(word)
                    else next.add(word)
                    return next
                  })
                }
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide transition-colors",
                  found
                    ? "bg-leaf/20 text-leaf line-through"
                    : "bg-muted text-foreground hover:bg-muted/80",
                )}
              >
                {word}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
