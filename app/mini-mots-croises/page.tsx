import type { Metadata } from "next"
import { SectionHeading } from "@/components/layout/section-heading"
import { MiniCrosswordGame } from "@/components/games/mini-crossword/mini-crossword-game"
// New: cross-format link block (mots mêlés ↔ mots croisés ↔ mots coupés).
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"

export const metadata: Metadata = {
  title: "Mini Mots Croisés Gratuits en Ligne | Hibou&Mots",
  description:
    "Une mini grille de mots croisés chaque jour, à jouer en ligne gratuitement. Choisis ta difficulté (Force 1 à 5) et amuse-toi sans inscription.",
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
