import type { Metadata } from "next"
import { SectionHeading } from "@/components/layout/section-heading"
import { MotsCoupesGame } from "@/components/games/mots-coupes/mots-coupes-game"
// New: cross-format link block (mots mêlés ↔ mots croisés ↔ mots coupés).
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"

export const metadata: Metadata = {
  title: "Mots Coupés Gratuit en Ligne | Hibou&Mots",
  description:
    "Joue aux mots coupés gratuitement en ligne : reconstitue chaque mot en associant le bon début à la bonne fin. Une nouvelle grille chaque jour, sans inscription.",
  other: {
    google: "notranslate",
  },
}

export default function MotsCoupesPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Jeu quotidien"
          title="Mots Coupés"
          description="Chaque mot a été coupé en deux morceaux. Retrouve le bon début et la bonne fin pour reconstituer tous les mots."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />
        <div className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <MotsCoupesGame />
        </div>

        <div className="mt-8">
          <PuzzleFormatLinks current="mots-coupes" />
        </div>
      </div>
    </div>
  )
}
