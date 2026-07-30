"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Check,
  ChevronDown,
  Clock,
  Lightbulb,
  Play,
  RefreshCw,
  Settings2,
  Share2,
  Shuffle,
  Sparkles,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/layout/section-heading"
import { PuzzleGridClient } from "@/components/puzzle/puzzle-grid-client"
import { ThemeChipSelector } from "@/components/forms"
import type { Cell, DifficultySlug } from "@/lib/puzzle-engine"
import {
  generateToolPuzzle,
  getThemeWordsForPlay,
  ONLINE_PLAY_THEMES,
  type PlayableTheme,
} from "@/lib/tools"
import { ROUTES } from "@/lib/seo"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { cn } from "@/lib/utils"

const DIFFICULTIES: { label: string; slug: DifficultySlug }[] = [
  { label: "Facile", slug: "facile" },
  { label: "Moyen", slug: "moyen" },
  { label: "Difficile", slug: "difficile" },
]

const THEME_PRESETS = ONLINE_PLAY_THEMES.map((theme) => ({
  id: theme.slug,
  label: theme.label,
  words: "",
}))

const HINT_LETTER_PENALTY_SECONDS = 10
const HINT_WORD_PENALTY_SECONDS = 30
const BEST_TIME_STORAGE_PREFIX = "hibou-et-mots:best-time:"

// Wong/Okabe-Ito colorblind-safe palette. Fixed positions/delays so server
// and client render identically (no Math.random() during render).
const CONFETTI_COLORS = ["#0072B2", "#E69F00", "#009E73", "#CC79A7", "#56B4E9", "#F0E442"]
const CONFETTI_PIECES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
  delay: `${(i % 6) * 0.12}s`,
  duration: `${1.1 + (i % 4) * 0.2}s`,
}))

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
}

function bestTimeKey(themeSlug: string, difficulty: DifficultySlug): string {
  return `${BEST_TIME_STORAGE_PREFIX}${themeSlug}:${difficulty}`
}

function readBestTime(themeSlug: string, difficulty: DifficultySlug): number | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(bestTimeKey(themeSlug, difficulty))
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : null
}

function writeBestTime(themeSlug: string, difficulty: DifficultySlug, seconds: number): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(bestTimeKey(themeSlug, difficulty), String(seconds))
}

function useElapsedTimer(active: boolean, resetKey: number): number {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    setElapsed(0)
  }, [resetKey])

  useEffect(() => {
    if (!active) return
    const interval = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(interval)
  }, [active, resetKey])

  return elapsed
}

type PlaySettingsProps = {
  themeSlug: string
  difficulty: DifficultySlug
  largePrint: boolean
  elapsed: number
  onThemeSelect: (preset: { id: string; label: string }) => void
  onDifficultyChange: (slug: DifficultySlug) => void
  onLargePrintToggle: () => void
  onNewGame: () => void
}

function PlaySettings({
  themeSlug,
  difficulty,
  largePrint,
  elapsed,
  onThemeSelect,
  onDifficultyChange,
  onLargePrintToggle,
  onNewGame,
}: PlaySettingsProps) {
  return (
    <div className="flex flex-col gap-5">
      <ThemeChipSelector
        presets={THEME_PRESETS}
        selectedId={themeSlug}
        onSelect={onThemeSelect}
        label="Thème"
      />

      <div className="flex flex-col gap-2">
        <span className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
          Difficulté
        </span>
        <div className="flex gap-2">
          {DIFFICULTIES.map((entry) => {
            const active = difficulty === entry.slug
            return (
              <button
                key={entry.slug}
                type="button"
                onClick={() => onDifficultyChange(entry.slug)}
                className={cn(
                  "flex-1 rounded-2xl border-2 px-3 py-2.5 text-sm font-extrabold transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/40",
                )}
              >
                {entry.label}
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-muted px-4 py-3">
        <span className="font-bold text-foreground">Grand format / haute lisibilité</span>
        <button
          type="button"
          role="switch"
          aria-checked={largePrint}
          onClick={onLargePrintToggle}
          className={cn(
            "relative h-7 w-12 rounded-full transition-colors",
            largePrint ? "bg-primary" : "bg-border",
          )}
        >
          <span
            className={cn(
              "absolute top-1 h-5 w-5 rounded-full bg-card transition-all",
              largePrint ? "left-6" : "left-1",
            )}
          />
        </button>
      </label>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
        <span className="flex items-center gap-2 font-bold text-foreground">
          <Clock className="size-4 text-primary" />
          Chronomètre
        </span>
        <span className="font-heading text-2xl font-extrabold tabular-nums text-primary">
          {formatElapsed(elapsed)}
        </span>
      </div>

      <Button
        onClick={onNewGame}
        className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
      >
        <Shuffle className="size-4" />
        Nouvelle partie
      </Button>

      <Button
        nativeButton={false}
        variant="outline"
        className="rounded-full border-2 font-extrabold"
        render={<Link href={ROUTES.generateur} />}
      >
        <Sparkles className="size-4" />
        Créer ma propre grille
      </Button>
    </div>
  )
}

export function ToolOnlinePlayTemplate() {
  const defaultTheme = ONLINE_PLAY_THEMES[0]!
  const [theme, setTheme] = useState<PlayableTheme>(defaultTheme)
  const [difficulty, setDifficulty] = useState<DifficultySlug>("moyen")
  const [seed, setSeed] = useState(1)
  const [found, setFound] = useState<string[]>([])
  const [largePrint, setLargePrint] = useState(true)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [hintLettersUsed, setHintLettersUsed] = useState(0)
  const [hintWordsUsed, setHintWordsUsed] = useState(0)
  const [pulseCell, setPulseCell] = useState<Cell | null>(null)
  const [revealWord, setRevealWord] = useState<{ word: string; token: number } | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [justBeatBest, setJustBeatBest] = useState(false)

  const words = useMemo(
    () => getThemeWordsForPlay(theme.slug, difficulty, seed),
    [theme.slug, difficulty, seed],
  )

  const puzzleResult = useMemo(() => {
    if (words.length === 0) return null
    return generateToolPuzzle({
      words,
      difficulty,
      size: difficulty === "facile" ? 8 : difficulty === "moyen" ? 10 : 12,
      allowDiagonals: difficulty !== "facile",
      seed,
    })
  }, [words, difficulty, seed])

  const placedWords = useMemo(
    () => puzzleResult?.wordList.map((entry) => entry.word) ?? [],
    [puzzleResult],
  )

  const isComplete = placedWords.length > 0 && found.length === placedWords.length
  const rawElapsed = useElapsedTimer(hasStarted && !isComplete, seed)
  const hintPenalty = hintLettersUsed * HINT_LETTER_PENALTY_SECONDS + hintWordsUsed * HINT_WORD_PENALTY_SECONDS
  const elapsed = rawElapsed + hintPenalty

  // Load the saved best time whenever theme/difficulty changes.
  useEffect(() => {
    setBestTime(readBestTime(theme.slug, difficulty))
  }, [theme.slug, difficulty])

  // On completion, compare against and persist the best time.
  useEffect(() => {
    if (!isComplete) return
    const previousBest = readBestTime(theme.slug, difficulty)
    if (previousBest === null || elapsed < previousBest) {
      writeBestTime(theme.slug, difficulty, elapsed)
      setBestTime(elapsed)
      setJustBeatBest(true)
    } else {
      setJustBeatBest(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete])

  function beginPlay() {
    setHasStarted(true)
  }

  function resetRound() {
    setFound([])
    setHasStarted(false)
    setHintLettersUsed(0)
    setHintWordsUsed(0)
    setPulseCell(null)
    setRevealWord(null)
    setJustBeatBest(false)
    setSeed((value) => value + 1)
  }

  function newGame() {
    resetRound()
  }

  function handleThemeSelect(preset: { id: string; label: string }) {
    const next = ONLINE_PLAY_THEMES.find((entry) => entry.slug === preset.id)
    if (!next) return
    setTheme(next)
    resetRound()
  }

  function handleDifficultyChange(slug: DifficultySlug) {
    setDifficulty(slug)
    resetRound()
  }

  function pickUnfoundWord(): string | null {
    const remaining = placedWords.filter((word) => !found.includes(word))
    if (remaining.length === 0) return null
    return remaining[Math.floor(Math.random() * remaining.length)]!
  }

  function hintRevealLetter() {
    if (isComplete) return
    const word = pickUnfoundWord()
    if (!word || !puzzleResult) return
    const placement = puzzleResult.solutionData.words.find((entry) => entry.word === word)
    if (!placement) return
    const firstCell = placement.cells[0]
    if (!firstCell) return
    if (!hasStarted) beginPlay()
    setHintLettersUsed((value) => value + 1)
    setPulseCell({ r: firstCell.row, c: firstCell.col })
  }

  function hintRevealWord() {
    if (isComplete) return
    const word = pickUnfoundWord()
    if (!word) return
    if (!hasStarted) beginPlay()
    setHintWordsUsed((value) => value + 1)
    setRevealWord({ word, token: Date.now() })
  }

  function shareResult() {
    const text = `J'ai trouvé les ${placedWords.length} mots (${theme.label}, ${difficulty}) en ${formatElapsed(elapsed)} sur Hibou&Mots ! 🦉🔎`
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "Mots Mêlés — Hibou&Mots", text, url }).catch(() => {})
      return
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${url}`).catch(() => {})
    }
  }

  const settingsProps: PlaySettingsProps = {
    themeSlug: theme.slug,
    difficulty,
    largePrint,
    elapsed,
    onThemeSelect: handleThemeSelect,
    onDifficultyChange: handleDifficultyChange,
    onLargePrintToggle: () => setLargePrint((value) => !value),
    onNewGame: newGame,
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Jeu en ligne"
          title="Mots Mêlés en Ligne"
          description="Choisissez un thème et une difficulté, puis trouvez tous les mots — aucun téléchargement ni inscription requis."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl [&_p]:hidden sm:[&_p]:block sm:[&_p]:text-base"
        />

        <div className="mt-4 flex flex-col gap-6 lg:mt-6 lg:gap-8">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:gap-6">
            {/* Puzzle first: primary interactive surface on mobile and desktop. */}
            <div className="order-1 flex min-h-0 flex-col gap-4 rounded-3xl border border-border bg-card p-3 shadow-sm sm:p-5 lg:order-none">
              {!puzzleResult || placedWords.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <RefreshCw className="size-10 text-muted-foreground" />
                  <p className="font-heading text-lg font-extrabold text-foreground">
                    Impossible de générer cette grille
                  </p>
                  <p className="max-w-xs text-sm font-semibold text-muted-foreground">
                    Essaie un autre thème ou une difficulté plus facile.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-heading text-lg font-extrabold text-foreground sm:text-xl">
                        {theme.label} — {difficulty}
                      </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-extrabold tabular-nums text-foreground">
                        <Clock className="size-3.5 text-primary" />
                        {formatElapsed(elapsed)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/15 px-3 py-1 text-sm font-extrabold text-leaf">
                        <Check className="size-4" />
                        {found.length} / {placedWords.length}
                      </span>
                      {bestTime !== null && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sunny/20 px-3 py-1 text-sm font-extrabold text-foreground">
                          <Trophy className="size-3.5 text-sunny-foreground" />
                          {formatElapsed(bestTime)}
                        </span>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        onClick={newGame}
                        className="rounded-full bg-primary px-3 font-extrabold text-primary-foreground hover:bg-primary/90 lg:hidden"
                      >
                        <Shuffle className="size-3.5" />
                        Nouvelle
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={hintRevealLetter}
                      disabled={isComplete || placedWords.length === found.length}
                      className="rounded-full border-2 font-bold"
                    >
                      <Lightbulb className="size-3.5" />
                      Indice : lettre (+{HINT_LETTER_PENALTY_SECONDS}s)
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={hintRevealWord}
                      disabled={isComplete || placedWords.length === found.length}
                      className="rounded-full border-2 font-bold"
                    >
                      <Lightbulb className="size-3.5" />
                      Indice : mot entier (+{HINT_WORD_PENALTY_SECONDS}s)
                    </Button>
                    {(hintLettersUsed > 0 || hintWordsUsed > 0) && (
                      <span className="text-xs font-semibold text-muted-foreground">
                        {hintLettersUsed + hintWordsUsed} indice(s) utilisé(s)
                      </span>
                    )}
                  </div>

                  <div className="relative flex items-center justify-center overflow-x-auto py-1">
                    <PuzzleGridClient
                      puzzleId={`play-${theme.slug}-${difficulty}-${seed}`}
                      grid={puzzleResult.grid}
                      solutionData={puzzleResult.solutionData}
                      largePrint={largePrint}
                      onWordFound={(word) => setFound((prev) => [...prev, word])}
                      onSelectionStart={beginPlay}
                      pulseCell={pulseCell}
                      revealWord={revealWord}
                      className="w-full max-w-2xl"
                    />
                    {!hasStarted && (
                      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-card/75 backdrop-blur-[2px]">
                        <Button
                          type="button"
                          onClick={beginPlay}
                          className="pointer-events-auto h-12 gap-2 rounded-full bg-primary px-8 text-base font-extrabold text-primary-foreground shadow-lg hover:bg-primary/90"
                        >
                          <Play className="size-5 fill-current" />
                          Démarrer
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="sr-only" role="status" aria-live="polite">
                    {found.length > 0
                      ? `Mot trouvé : ${found[found.length - 1]}. ${found.length} sur ${placedWords.length} mots trouvés.`
                      : ""}
                  </p>

                  <ul className="flex flex-wrap gap-2">
                    {placedWords.map((word) => {
                      const isFound = found.includes(word)
                      return (
                        <li
                          key={word}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold transition-colors",
                            isFound
                              ? "bg-leaf text-leaf-foreground line-through"
                              : "bg-muted text-foreground",
                          )}
                        >
                          {isFound && <Check className="size-3.5" />}
                          {word}
                        </li>
                      )
                    })}
                  </ul>

                  {isComplete && (
                    <div className="relative overflow-hidden rounded-2xl bg-leaf/12 p-4">
                      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                        {CONFETTI_PIECES.map((piece) => (
                          <span
                            key={piece.id}
                            className="absolute top-0 block h-2 w-2 animate-confetti-fall rounded-sm"
                            style={{
                              left: piece.left,
                              backgroundColor: piece.color,
                              animationDelay: piece.delay,
                              animationDuration: piece.duration,
                            }}
                          />
                        ))}
                      </div>
                      <div className="relative flex flex-wrap items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf text-leaf-foreground">
                          <Trophy className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-heading font-extrabold text-foreground">
                            {justBeatBest
                              ? `🎉 Nouveau record ! Tous les mots trouvés en ${formatElapsed(elapsed)}.`
                              : `Bravo ! Tous les mots trouvés en ${formatElapsed(elapsed)}.`}
                          </p>
                          <p className="text-sm font-semibold text-muted-foreground">
                            {bestTime !== null && !justBeatBest && (
                              <>Meilleur temps : {formatElapsed(bestTime)}. </>
                            )}
                            {hintLettersUsed + hintWordsUsed > 0
                              ? `${hintLettersUsed + hintWordsUsed} indice(s) utilisé(s). `
                              : ""}
                            Lance une nouvelle partie pour rejouer.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={shareResult}
                            className="rounded-full border-2 font-extrabold"
                          >
                            <Share2 className="size-3.5" />
                            Partager
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={newGame}
                            className="rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
                          >
                            <Shuffle className="size-3.5" />
                            Rejouer
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile: collapsed Options. Desktop: persistent settings column. */}
            <div className="order-2 lg:order-none">
              <div className="lg:hidden">
                <button
                  type="button"
                  aria-expanded={optionsOpen}
                  aria-controls="play-options-panel"
                  onClick={() => setOptionsOpen((open) => !open)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm"
                >
                  <span className="flex items-center gap-2 font-heading text-base font-extrabold text-foreground">
                    <Settings2 className="size-4 text-primary" />
                    Options
                    <span className="text-sm font-bold text-muted-foreground">
                      · {theme.label}, {difficulty}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 text-muted-foreground transition-transform",
                      optionsOpen && "rotate-180",
                    )}
                  />
                </button>
                {optionsOpen && (
                  <div
                    id="play-options-panel"
                    className="mt-3 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5"
                  >
                    <PlaySettings {...settingsProps} />
                  </div>
                )}
              </div>

              <aside className="hidden rounded-3xl border border-border bg-card p-5 shadow-sm lg:block lg:p-6">
                <h2 className="mb-5 font-heading text-lg font-extrabold text-foreground">
                  Options de la partie
                </h2>
                <PlaySettings {...settingsProps} />
              </aside>
            </div>
          </div>

          <HowToPlayBlock />
        </div>
      </div>
    </div>
  )
}
