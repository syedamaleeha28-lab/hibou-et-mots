"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Check, Share2, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DAILY_WORD_LIST,
  MAX_GUESSES,
  WORD_LENGTH,
  buildKeyboardStates,
  buildShareGrid,
  evaluateGuess,
  getDayIndex,
  getWordForDay,
  isValidGuessShape,
  readState,
  readStats,
  recordResult,
  writeState,
  type DailyWordState,
  type DailyWordStats,
} from "@/lib/daily-word"
import { DailyWordKeyboard } from "./daily-word-keyboard"

export function DailyWordGame() {
  // Computed once per mount from the real clock; stable for the session.
  const [dayIndex] = useState(() => getDayIndex())
  const secret = useMemo(() => getWordForDay(dayIndex, DAILY_WORD_LIST), [dayIndex])

  const [state, setState] = useState<DailyWordState>(() => ({
    dayIndex,
    guesses: [],
    status: "playing",
  }))
  const [currentGuess, setCurrentGuess] = useState("")
  const [shake, setShake] = useState(false)
  const [stats, setStats] = useState<DailyWordStats | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount (client-only; avoids SSR/client mismatch).
  useEffect(() => {
    setState(readState(dayIndex))
    setStats(readStats())
    setHydrated(true)
  }, [dayIndex])

  // Persist on every change.
  useEffect(() => {
    if (!hydrated) return
    writeState(state)
  }, [state, hydrated])

  // Record the result exactly once when the round finishes.
  useEffect(() => {
    if (!hydrated || state.status === "playing") return
    const nextStats = recordResult(dayIndex, state.status === "won", state.guesses.length)
    setStats(nextStats)
  }, [hydrated, state.status, state.guesses.length, dayIndex])

  const keyboardStates = useMemo(
    () => buildKeyboardStates(state.guesses, secret),
    [state.guesses, secret],
  )

  const triggerShake = useCallback(() => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }, [])

  const submitGuess = useCallback(() => {
    if (state.status !== "playing") return
    if (!isValidGuessShape(currentGuess)) {
      triggerShake()
      return
    }
    const guesses = [...state.guesses, currentGuess.toUpperCase()]
    const won = currentGuess.toUpperCase() === secret
    const status = won ? "won" : guesses.length >= MAX_GUESSES ? "lost" : "playing"
    setState({ dayIndex, guesses, status })
    setCurrentGuess("")
  }, [currentGuess, dayIndex, secret, state.guesses, state.status, triggerShake])

  const handleKey = useCallback(
    (key: string) => {
      if (state.status !== "playing") return
      if (key === "ENTER") {
        submitGuess()
        return
      }
      if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1))
        return
      }
      if (/^[A-Z]$/.test(key)) {
        setCurrentGuess((prev) => (prev.length < WORD_LENGTH ? prev + key : prev))
      }
    },
    [state.status, submitGuess],
  )

  // Physical keyboard support.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === "Enter") {
        handleKey("ENTER")
      } else if (event.key === "Backspace") {
        handleKey("BACKSPACE")
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleKey(event.key.toUpperCase())
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleKey])

  function shareResult() {
    const grid = buildShareGrid(state.guesses, secret)
    const scoreLine = state.status === "won" ? `${state.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`
    const text = `Hibou&Mots — Mot du Jour #${dayIndex}\n${scoreLine}\n\n${grid}`
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "Mot du Jour", text, url }).catch(() => {})
      return
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${url}`).catch(() => {})
    }
  }

  const isFinished = state.status !== "playing"
  const rows = Array.from({ length: MAX_GUESSES }, (_, i) => {
    if (i < state.guesses.length) return { letters: state.guesses[i]!.split(""), submitted: true }
    if (i === state.guesses.length && !isFinished) {
      const letters = currentGuess.split("")
      return { letters, submitted: false, isCurrent: true }
    }
    return { letters: [], submitted: false }
  })

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-extrabold text-foreground">
          Grille #{dayIndex}
        </span>
        {stats && stats.currentStreak > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sunny/20 px-3 py-1 text-sm font-extrabold text-foreground">
            🔥 Série : {stats.currentStreak}
          </span>
        )}
      </div>

      <div
        className={cn(
          "grid gap-1.5 sm:gap-2",
          shake && "animate-wiggle",
        )}
        style={{ gridTemplateColumns: `repeat(${WORD_LENGTH}, minmax(2.75rem, 3.25rem))` }}
        role="grid"
        aria-label="Grille du mot du jour"
      >
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} role="row" className="contents">
            {Array.from({ length: WORD_LENGTH }, (_, colIndex) => {
            const letter = row.letters[colIndex] ?? ""
            const evaluation = row.submitted ? evaluateGuess(state.guesses[rowIndex]!, secret) : null
            const letterState = evaluation?.[colIndex] ?? null
            return (
              <div
                key={colIndex}
                role="gridcell"
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg border-2 font-heading text-xl font-extrabold uppercase sm:text-2xl",
                  letterState === "correct" && "border-leaf bg-leaf text-leaf-foreground",
                  letterState === "present" && "border-sunny bg-sunny text-sunny-foreground",
                  letterState === "absent" && "border-muted-foreground/30 bg-muted-foreground/30 text-muted-foreground",
                  !letterState && letter && "border-foreground/40 text-foreground",
                  !letterState && !letter && "border-border text-foreground",
                )}
              >
                {letter}
              </div>
            )
            })}
          </div>
        ))}
      </div>

      <DailyWordKeyboard letterStates={keyboardStates} onKey={handleKey} disabled={isFinished} />

      {isFinished && (
        <div className="w-full max-w-sm rounded-2xl bg-leaf/12 p-4 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-leaf text-leaf-foreground">
            <Trophy className="size-5" />
          </span>
          <p className="mt-2 font-heading font-extrabold text-foreground">
            {state.status === "won"
              ? `Bravo ! Trouvé en ${state.guesses.length}/${MAX_GUESSES}.`
              : `Le mot était : ${secret}`}
          </p>
          {stats && (
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {stats.played} partie(s) · {stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0}% de
              réussite · Série actuelle : {stats.currentStreak} · Meilleure série : {stats.maxStreak}
            </p>
          )}
          <Button
            type="button"
            size="sm"
            onClick={shareResult}
            className="mt-3 rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
          >
            <Share2 className="size-3.5" />
            Partager mon résultat
          </Button>
        </div>
      )}

      {!isFinished && (
        <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Check className="size-4" />
          Devine le mot de {WORD_LENGTH} lettres en {MAX_GUESSES} essais.
        </p>
      )}
    </div>
  )
}
