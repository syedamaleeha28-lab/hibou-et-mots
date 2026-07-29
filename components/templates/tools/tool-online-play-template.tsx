"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Check, ChevronDown, Clock, RefreshCw, Settings2, Shuffle, Sparkles, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/layout/section-heading"
import { PuzzleGridClient } from "@/components/puzzle/puzzle-grid-client"
import { ThemeChipSelector } from "@/components/forms"
import type { DifficultySlug } from "@/lib/puzzle-engine"
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

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
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
  const elapsed = useElapsedTimer(placedWords.length > 0 && !isComplete, seed)

  function newGame() {
    setFound([])
    setSeed((value) => value + 1)
  }

  function handleThemeSelect(preset: { id: string; label: string }) {
    const next = ONLINE_PLAY_THEMES.find((entry) => entry.slug === preset.id)
    if (!next) return
    setTheme(next)
    setFound([])
    setSeed((value) => value + 1)
  }

  function handleDifficultyChange(slug: DifficultySlug) {
    setDifficulty(slug)
    setFound([])
    setSeed((value) => value + 1)
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

                  <div className="flex items-center justify-center overflow-x-auto py-1">
                    <PuzzleGridClient
                      puzzleId={`play-${theme.slug}-${difficulty}-${seed}`}
                      grid={puzzleResult.grid}
                      solutionData={puzzleResult.solutionData}
                      largePrint={largePrint}
                      onWordFound={(word) => setFound((prev) => [...prev, word])}
                      className="w-full max-w-2xl"
                    />
                  </div>

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
                    <div className="flex items-center gap-3 rounded-2xl bg-leaf/12 p-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf text-leaf-foreground">
                        <Trophy className="size-5" />
                      </span>
                      <div>
                        <p className="font-heading font-extrabold text-foreground">
                          Bravo ! Tous les mots trouvés en {formatElapsed(elapsed)}.
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground">
                          Lance une nouvelle partie pour battre ton record.
                        </p>
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
