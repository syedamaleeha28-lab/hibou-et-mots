"use client"

import { useMemo, useState } from "react"
import { Check, Printer, RefreshCw, Shuffle, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WordGrid } from "@/components/puzzle/word-grid"
import { SectionHeading } from "@/components/layout/section-heading"
import { generateGrid, normalizeWord } from "@/lib/puzzle-engine"
import { cn } from "@/lib/utils"

const PRESETS: { label: string; words: string }[] = [
  { label: "Animaux", words: "CHAT, CHIEN, LION, ZEBRE, TIGRE, OURS, RENARD, LAPIN" },
  { label: "Fruits", words: "POMME, FRAISE, BANANE, CERISE, RAISIN, MELON, POIRE, KIWI" },
  { label: "Couleurs", words: "ROUGE, BLEU, VERT, JAUNE, ROSE, ORANGE, MARRON, NOIR" },
  { label: "École", words: "CRAYON, CAHIER, REGLE, GOMME, LIVRE, STYLO, TABLE, COLLE" },
]

const SIZES = [
  { label: "Petit", value: 8 },
  { label: "Moyen", value: 11 },
  { label: "Grand", value: 14 },
]

export function PuzzleGenerator() {
  const [raw, setRaw] = useState(PRESETS[0].words)
  const [size, setSize] = useState(11)
  const [diagonals, setDiagonals] = useState(true)
  const [seed, setSeed] = useState(1)
  const [found, setFound] = useState<string[]>([])

  const words = useMemo(
    () =>
      Array.from(
        new Set(
          raw
            .split(/[\n,]+/)
            .map(normalizeWord)
            .filter((w) => w.length >= 2 && w.length <= size),
        ),
      ),
    [raw, size],
  )

  const grid = useMemo(
    () => generateGrid(words, size, diagonals, seed),
    [words, size, diagonals, seed],
  )

  const placedWords = useMemo(() => grid.placements.map((p) => p.word), [grid])

  function regenerate() {
    setFound([])
    setSeed((s) => s + 1)
  }

  return (
    <section id="generateur" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Générateur"
        title="Crée ta propre grille en un clic"
        description="Choisis un thème ou écris tes propres mots, règle la taille et joue tout de suite. Parfait pour réviser une leçon !"
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
              Thèmes rapides
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => {
                const active = raw === preset.words
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setRaw(preset.words)
                      setFound([])
                    }}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-extrabold transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-secondary/20",
                    )}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="words"
              className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground"
            >
              Tes mots (séparés par une virgule)
            </label>
            <textarea
              id="words"
              value={raw}
              onChange={(e) => {
                setRaw(e.target.value)
                setFound([])
              }}
              rows={4}
              className="w-full resize-none rounded-2xl border-2 border-border bg-background px-4 py-3 font-semibold text-foreground outline-none transition-colors focus:border-primary"
              placeholder="CHAT, CHIEN, LION..."
            />
            <p className="text-xs font-semibold text-muted-foreground">
              {words.length} mot{words.length > 1 ? "s" : ""} · max {size}{" "}
              lettres par mot
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
              Taille de la grille
            </span>
            <div className="flex gap-2">
              {SIZES.map((s) => {
                const active = size === s.value
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      setSize(s.value)
                      setFound([])
                    }}
                    className={cn(
                      "flex-1 rounded-2xl border-2 px-3 py-2.5 text-sm font-extrabold transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground hover:border-primary/40",
                    )}
                  >
                    {s.label}
                    <span className="block text-xs font-bold opacity-70">
                      {s.value}×{s.value}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-muted px-4 py-3">
            <span className="font-bold text-foreground">
              Inclure les diagonales
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={diagonals}
              onClick={() => {
                setDiagonals((v) => !v)
                setFound([])
              }}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors",
                diagonals ? "bg-primary" : "bg-border",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 h-5 w-5 rounded-full bg-card transition-all",
                  diagonals ? "left-6" : "left-1",
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
        </div>

        <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
          {placedWords.length === 0 ? (
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
                <h3 className="font-heading text-lg font-extrabold text-foreground">
                  Ta grille
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/15 px-3 py-1 text-sm font-extrabold text-leaf">
                  <Check className="size-4" />
                  {found.length} / {placedWords.length}
                </span>
              </div>

              <div className="flex justify-center overflow-x-auto">
                <WordGrid
                  key={`${size}-${seed}-${diagonals}-${words.join(",")}`}
                  grid={grid}
                  onWordFound={(w) => setFound((prev) => [...prev, w])}
                  className="w-full max-w-xl"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-heading text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
                  Mots à trouver
                </span>
                <ul className="flex flex-wrap gap-2">
                  {placedWords.map((w) => {
                    const isFound = found.includes(w)
                    return (
                      <li
                        key={w}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold transition-colors",
                          isFound
                            ? "bg-leaf text-leaf-foreground line-through"
                            : "bg-muted text-foreground",
                        )}
                      >
                        {isFound && <Check className="size-3.5" />}
                        {w}
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
                  Certains mots étaient trop longs pour la grille et ont été
                  ignorés.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
