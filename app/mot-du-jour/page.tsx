import type { Metadata } from "next"
import { SectionHeading } from "@/components/layout/section-heading"
import { DailyWordGame } from "@/components/games/daily-word/daily-word-game"

export const metadata: Metadata = {
  title: "Mot du Jour — Devine le mot en 6 essais | Hibou&Mots",
  description:
    "Un nouveau mot mystère de 5 lettres chaque jour. Devine-le en 6 essais et partage ton résultat — gratuit, sans inscription.",
  other: {
    google: "notranslate",
  },
}

export default function MotDuJourPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Jeu quotidien"
          title="Mot du Jour"
          description="Un nouveau mot mystère de 5 lettres chaque jour. Tu as 6 essais — reviens demain pour continuer ta série !"
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />
        <div className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <DailyWordGame />
        </div>
      </div>
    </div>
  )
}
