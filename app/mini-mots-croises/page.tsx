import type { Metadata } from "next"
import { SectionHeading } from "@/components/layout/section-heading"
import { MiniCrosswordGame } from "@/components/games/mini-crossword/mini-crossword-game"
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"

// Retargeted description to naturally include "jeux de mots croisés"
// (150/mo) — the generic/broad phrasing genuinely fits a daily-game
// page better than the printable hub does.
export const metadata: Metadata = {
  title: "Mini Mots Croisés Gratuits en Ligne | Hibou&Mots",
  description:
    "Un des meilleurs jeux de mots croisés gratuits à jouer en ligne : une mini grille chaque jour, cinq niveaux de difficulté, sans inscription.",
  other: {
    google: "notranslate",
  },
}

export default function MiniMotsCroisesPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Jeu quotidien"
          title="Mini Mots Croisés"
          description="Une petite grille chaque jour — trouve les mots grâce aux définitions, horizontales et verticales."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />
        <div className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <MiniCrosswordGame />
        </div>

        <div className="mt-8">
          <PuzzleFormatLinks current="mots-croises" />
        </div>
      </div>
    </div>
  )
}
