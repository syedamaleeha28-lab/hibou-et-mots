"use client"

import { useMemo, useState } from "react"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MotsCoupesPuzzle } from "@/lib/mots-coupes/puzzles"
import { isMatch, isPuzzleComplete } from "@/lib/mots-coupes/engine"

type MotsCoupesBoardProps = {
  puzzle: MotsCoupesPuzzle
  className?: string
}

const LETTERS = "ABCDEFGHIJKL"

export function MotsCoupesBoard({ puzzle, className }: MotsCoupesBoardProps) {
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set())
  const [selectedPart1, setSelectedPart1] = useState<string | null>(null)
  const [selectedPart2, setSelectedPart2] = useState<string | null>(null)
  const [wrongPair, setWrongPair] = useState<{ p1: string; p2: string } | null>(null)

  const complete = isPuzzleComplete(matchedIds, puzzle)

  const rightColumn = useMemo(
    () =>
      puzzle.part2Order.map((pairId, i) => {
        const pair = puzzle.pairs.find((p) => p.id === pairId)!
        return { pair, letter: LETTERS[i] ?? String(i + 1) }
      }),
    [puzzle],
  )

  function attemptMatch(p1: string, p2: string) {
    if (isMatch(p1, p2)) {
      setMatchedIds((prev) => new Set(prev).add(p1))
      setSelectedPart1(null)
      setSelectedPart2(null)
      setWrongPair(null)
    } else {
      setWrongPair({ p1, p2 })
      window.setTimeout(() => {
        setWrongPair(null)
        setSelectedPart1(null)
        setSelectedPart2(null)
      }, 500)
    }
  }

  function selectPart1(id: string) {
    if (matchedIds.has(id) || wrongPair) return
    if (selectedPart1 === id) {
      setSelectedPart1(null)
      return
    }
    setSelectedPart1(id)
    if (selectedPart2) attemptMatch(id, selectedPart2)
  }

  function selectPart2(id: string) {
    if (matchedIds.has(id) || wrongPair) return
    if (selectedPart2 === id) {
      setSelectedPart2(null)
      return
    }
    setSelectedPart2(id)
    if (selectedPart1) attemptMatch(selectedPart1, id)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
            Début du mot
          </h3>
          {puzzle.pairs.map((pair, i) => (
            <button
              key={pair.id}
              type="button"
              disabled={matchedIds.has(pair.id)}
              onClick={() => selectPart1(pair.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left font-bold uppercase transition-colors",
                matchedIds.has(pair.id) && "border-leaf bg-leaf/15 text-leaf line-through",
                !matchedIds.has(pair.id) &&
                  wrongPair?.p1 === pair.id &&
                  "border-destructive bg-destructive/15",
                !matchedIds.has(pair.id) &&
                  !wrongPair &&
                  selectedPart1 === pair.id &&
                  "border-sunny bg-sunny/25",
                !matchedIds.has(pair.id) &&
                  !wrongPair &&
                  selectedPart1 !== pair.id &&
                  "border-border bg-background hover:bg-muted",
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-extrabold text-muted-foreground">
                {i + 1}
              </span>
              {pair.part1}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
            Fin du mot
          </h3>
          {rightColumn.map(({ pair, letter }) => (
            <button
              key={pair.id}
              type="button"
              disabled={matchedIds.has(pair.id)}
              onClick={() => selectPart2(pair.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left font-bold uppercase transition-colors",
                matchedIds.has(pair.id) && "border-leaf bg-leaf/15 text-leaf line-through",
                !matchedIds.has(pair.id) &&
                  wrongPair?.p2 === pair.id &&
                  "border-destructive bg-destructive/15",
                !matchedIds.has(pair.id) &&
                  !wrongPair &&
                  selectedPart2 === pair.id &&
                  "border-sunny bg-sunny/25",
                !matchedIds.has(pair.id) &&
                  !wrongPair &&
                  selectedPart2 !== pair.id &&
                  "border-border bg-background hover:bg-muted",
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-extrabold text-muted-foreground">
                {letter}
              </span>
              {pair.part2}
            </button>
          ))}
        </div>
      </div>

      {complete && (
        <div className="no-print flex items-center gap-3 rounded-2xl bg-leaf/12 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf text-leaf-foreground">
            <Trophy className="size-5" />
          </span>
          <p className="font-heading font-extrabold text-foreground">
            Bravo ! Tous les mots sont reconstitués.
          </p>
        </div>
      )}
    </div>
  )
}
