"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Check, Play, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WordGrid } from "@/components/puzzle/word-grid"
import { generateGrid } from "@/lib/puzzle-engine"
import { ROUTES } from "@/lib/seo/routes"

const HERO_WORDS = ["HIBOU", "LIVRE", "MOTS", "JEU", "ECOLE", "LIRE"]

const stats = [
  { value: "120+", label: "grilles publiées" },
  { value: "15", label: "thèmes" },
  { value: "100%", label: "gratuit" },
]

export function Hero() {
  const grid = useMemo(() => generateGrid(HERO_WORDS, 8, true, 7), [])
  const [found, setFound] = useState<string[]>([])

  return (
    <section id="top" className="relative overflow-hidden bg-dots">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-20 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-accent-foreground">
            <Star className="size-4 fill-current" />
            Mots mêlés gratuits en français
          </span>

          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
            Apprends en t&apos;amusant avec les{" "}
            <span className="text-primary">mots mêlés</span> !
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            Des grilles de mots mêlés — jeux de mots cachés — pour la maternelle, le primaire, le
            collège, les adultes et les seniors. Joue en ligne, imprime un PDF ou crée ta propre
            grille.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              className="rounded-full bg-primary text-base font-extrabold text-primary-foreground hover:bg-primary/90"
              render={<Link href={ROUTES.jouer} />}
            >
              <Play className="size-5 fill-current" />
              Jouer en ligne
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              className="rounded-full border-2 border-foreground/15 bg-card text-base font-extrabold hover:bg-muted"
              render={<Link href={ROUTES.generateur} />}
            >
              <Sparkles className="size-5" />
              Créer ma grille
            </Button>
          </div>

          <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="font-heading text-2xl font-extrabold text-foreground">
                  {s.value}
                </dt>
                <dd className="text-sm font-semibold text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -top-6 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
            <Image
              src="/mascot-leo.png"
              alt="Hibou, la mascotte de Hibou&Mots, tenant un crayon"
              width={150}
              height={150}
              priority
              className="h-32 w-32 animate-float-soft rounded-[2rem] object-cover drop-shadow-xl lg:h-36 lg:w-36"
            />
          </div>

          <div className="rounded-[2rem] border-2 border-card bg-card p-4 shadow-xl sm:p-6 sm:pt-20">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-heading text-lg font-extrabold text-foreground">Essaie&nbsp;!</p>
              <span className="rounded-full bg-leaf/15 px-3 py-1 text-xs font-bold text-leaf">
                {found.length} / {HERO_WORDS.length} trouvés
              </span>
            </div>

            <div className="flex justify-center">
              <WordGrid
                grid={grid}
                onWordFound={(w) => setFound((prev) => [...prev, w])}
                className="w-full max-w-sm"
              />
            </div>

            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {HERO_WORDS.map((w) => {
                const isFound = found.includes(w)
                return (
                  <li
                    key={w}
                    className={
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold transition-colors " +
                      (isFound
                        ? "bg-leaf text-leaf-foreground line-through"
                        : "bg-muted text-foreground")
                    }
                  >
                    {isFound && <Check className="size-3.5" />}
                    {w}
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
              Clique sur la première puis la dernière lettre d&apos;un mot.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
