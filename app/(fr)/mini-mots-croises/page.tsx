import type { Metadata } from "next"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { MiniCrosswordGame } from "@/components/games/mini-crossword/mini-crossword-game"
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"
import { selfCanonical } from "@/lib/seo/self-canonical"
import { ROUTES } from "@/lib/seo/routes"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import {
  MOTS_CROISES_FAQ,
  MOTS_CROISES_HOW_TO_PLAY,
  MOTS_CROISES_INTRO_PARAGRAPHS,
} from "@/lib/content/mots-croises-seo"

// Retargeted description to naturally include "jeux de mots croisés"
// (150/mo) — the generic/broad phrasing genuinely fits a daily-game
// page better than the printable hub does.
export const metadata: Metadata = {
  title: "Mini Mots Croisés Gratuits en Ligne | Hibou&Mots",
  description:
    "Un des meilleurs jeux de mots croisés gratuits à jouer en ligne : une mini grille chaque jour, cinq niveaux de difficulté, sans inscription.",
  ...selfCanonical(ROUTES.miniMotsCroises),
  other: {
    google: "notranslate",
  },
}

const PAGE_NAME = "Mini Mots Croisés"
const PAGE_DESCRIPTION =
  "Une mini grille de mots croisés chaque jour, à jouer en ligne gratuitement, cinq niveaux de difficulté."

export default function MiniMotsCroisesPage() {
  // NEW: real FAQ content now exists, schema gets a genuine FAQPage node.
  const schemaGraph = buildGamePageSchemaGraph({
    path: ROUTES.miniMotsCroises,
    name: PAGE_NAME,
    description: PAGE_DESCRIPTION,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: PAGE_NAME, href: ROUTES.miniMotsCroises },
    ],
    faqItems: MOTS_CROISES_FAQ,
  })

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaGraph} />

        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Jeu quotidien"
          title="Mini Mots Croisés"
          description="Une petite grille chaque jour — trouve les mots grâce aux définitions, horizontales et verticales."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-4 flex flex-col gap-4">
          {MOTS_CROISES_INTRO_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <MiniCrosswordGame />
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <HowToPlayBlock {...MOTS_CROISES_HOW_TO_PLAY} />

          <FaqAccordion items={MOTS_CROISES_FAQ} />

          <PuzzleFormatLinks current="mots-croises" />
        </div>
      </div>
    </div>
  )
}
