"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Check, Printer, RefreshCw, Shuffle, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/layout/section-heading"
import { PuzzleGridClient } from "@/components/puzzle/puzzle-grid-client"
import {
  DiagonalToggle,
  SizeSegmentedControl,
  ThemeChipSelector,
  WordListTextarea,
} from "@/components/forms"
import type { DifficultySlug } from "@/lib/puzzle-engine"
import {
  GENERATOR_THEME_PRESETS,
  generateToolPuzzle,
  parseWordList,
  type GridSizeOption,
} from "@/lib/tools"
import { ROUTES } from "@/lib/seo"
import { cn } from "@/lib/utils"

const DIFFICULTIES: { label: string; slug: DifficultySlug; hint: string }[] = [
  { label: "Facile", slug: "facile", hint: "Horizontal / vertical" },
  { label: "Moyen", slug: "moyen", hint: "+ diagonales" },
  { label: "Difficile", slug: "difficile", hint: "Toutes directions" },
]

type ToolGeneratorTemplateProps = {
  variant?: "page" | "embedded"
  id?: string
}

export function ToolGeneratorTemplate({
  variant = "page",
  id,
}: ToolGeneratorTemplateProps) {
  const defaultPreset = GENERATOR_THEME_PRESETS[0]!
  const [raw, setRaw] = useState(defaultPreset.words)
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(defaultPreset.id)
  const [difficulty, setDifficulty] = useState<DifficultySlug>("moyen")
  const [gridSize, setGridSize] = useState<GridSizeOption>(10)
  const [allowDiagonals, setAllowDiagonals] = useState(true)
  const [largePrint, setLargePrint] = useState(false)
  const [seed, setSeed] = useState(1)
  const [found, setFound] = useState<string[]>([])

  const words = useMemo(() => parseWordList(raw), [raw])

  const puzzleResult = useMemo(
    () =>
      generateToolPuzzle({
        words,
        difficulty,
        size: gridSize,
        allowDiagonals,
        seed,
      }),
    [words, difficulty, gridSize, allowDiagonals, seed],
  )

  const placedWords = useMemo(
    () => puzzleResult?.wordList.map((entry) => entry.word) ?? [],
    [puzzleResult],
  )

  function regenerate() {
    setFound([])
    setSeed((value) => value + 1)
  }

  function handleThemeSelect(preset: (typeof GENERATOR_THEME_PRESETS)[number]) {
    setRaw(preset.words)
    setSelectedThemeId(preset.id)
    setFound([])
  }

  const heading = (
    <SectionHeading
      align={variant === "page" ? "left" : "center"}
      as={variant === "page" ? "h1" : "h2"}
      eyebrow="Générateur"
      title="Générateur de Mots Mêlés Gratuit et Personnalisable"
      description="Choisissez vos mots, la taille et la difficulté — créez une grille en français en quelques secondes, sans inscription."
    />
  )

  const content = (
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <ThemeChipSelector
          presets={GENERATOR_THEME_PRESETS}
          selectedId={selectedThemeId}
          onSelect={handleThemeSelect}
        />

        <WordListTextarea
          value={raw}
          onChange={(value) => {
            setRaw(value)
            setSelectedThemeId(null)
            setFound([])
          }}
          wordCount={words.length}
          gridSizeHint={
            puzzleResult ? `${puzzleResult.size}×${puzzleResult.size}` : undefined
          }
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
                  onClick={() => {
                    setDifficulty(entry.slug)
                    setFound([])
                  }}
                  className={cn(
                    "flex-1 rounded-2xl border-2 px-3 py-2.5 text-sm font-extrabold transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/40",
                  )}
                >
                  {entry.label}
                  <span className="block text-xs font-bold opacity-70">{entry.hint}</span>
                </button>
              )
            })}
          </div>
        </div>

        <SizeSegmentedControl value={gridSize} onChange={setGridSize} />

        <DiagonalToggle checked={allowDiagonals} onCheckedChange={setAllowDiagonals} />

        <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-muted px-4 py-3">
          <span className="font-bold text-foreground">Grand format / haute lisibilité</span>
          <button
            type="button"
            role="switch"
            aria-checked={largePrint}
            onClick={() => setLargePrint((value) => !value)}
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

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={regenerate}
            className="flex-1 rounded-full bg-primary font-extrabold text-primary-foreground hover:bg-primary/90"
          >
            <Shuffle className="size-4" />
            Nouvelle grille
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex-1 rounded-full border-2 font-extrabold hover:bg-muted"
          >
            <Printer className="size-4" />
            Imprimer
          </Button>
        </div>

        {variant === "embedded" && (
          <Button
            nativeButton={false}
            variant="outline"
            className="rounded-full border-2 font-extrabold"
            render={<Link href={ROUTES.generateur} />}
          >
            Ouvrir le générateur complet
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
        {placedWords.length === 0 || !puzzleResult ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
            <Wand2 className="size-10 text-muted-foreground" />
            <p className="font-heading text-lg font-extrabold text-foreground">
              Ajoute quelques mots pour commencer
            </p>
            <p className="max-w-xs text-sm font-semibold text-muted-foreground">
              Écris au moins un mot de 2 lettres dans la zone de gauche.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading text-lg font-extrabold text-foreground">Ta grille</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/15 px-3 py-1 text-sm font-extrabold text-leaf">
                <Check className="size-4" />
                {found.length} / {placedWords.length}
              </span>
            </div>

            <div className="flex justify-center overflow-x-auto">
              <PuzzleGridClient
                puzzleId={`generator-${seed}-${difficulty}-${gridSize}`}
                grid={puzzleResult.grid}
                solutionData={puzzleResult.solutionData}
                largePrint={largePrint}
                onWordFound={(word) => setFound((prev) => [...prev, word])}
                className="w-full max-w-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
                Mots à trouver
              </span>
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
            </div>

            {found.length === placedWords.length && (
              <div className="flex items-center gap-3 rounded-2xl bg-leaf/12 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf text-leaf-foreground">
                  <Check className="size-5" />
                </span>
                <p className="font-heading font-extrabold text-foreground">
                  Bravo ! Tu as trouvé tous les mots&nbsp;!
                </p>
              </div>
            )}

            {words.length > placedWords.length && (
              <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <RefreshCw className="size-3.5" />
                Certains mots étaient trop longs pour la grille et ont été ignorés.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )

  if (variant === "embedded") {
    return (
      <section
        id={id}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        {heading}
        {content}
      </section>
    )
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {heading}
        {content}
      </div>
    </div>
  )
}
