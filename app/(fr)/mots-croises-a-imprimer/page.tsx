import type { Metadata } from "next"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { PrintableCrosswordList } from "@/components/games/mini-crossword/printable-crossword-list"
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"
import { ROUTES } from "@/lib/seo/routes"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import {
  MOTS_CROISES_FAQ,
  MOTS_CROISES_HOW_TO_PLAY,
  MOTS_CROISES_INTRO_PARAGRAPHS,
} from "@/lib/content/mots-croises-seo"

// Retargeted metadata (was purely generic "à imprimer, Force 1 à 5").
// Now explicitly covers the specific searched phrases found in the
// content-gap research: "mots croisés faciles" (1,300/mo), "mot croisé
// enfant" (200/mo), "mots croisés à imprimer collège" (150/mo) — all
// genuinely true of this page's actual content (5 difficulty tiers
// spanning young-child-easy to collège-level), just not stated before.
export const metadata: Metadata = {
  title: "Mots Croisés à Imprimer Gratuit (Facile à Collège) | Hibou&Mots",
  description:
    "Mots croisés à imprimer gratuitement en PDF : du niveau facile, idéal pour un enfant qui débute, jusqu'au niveau collège. Cinq niveaux de difficulté, sans inscription.",
  other: {
    google: "notranslate",
  },
}

const PAGE_NAME = "Mots Croisés à Imprimer"
const PAGE_DESCRIPTION =
  "Mots croisés à imprimer gratuitement en PDF, du niveau facile au niveau collège, cinq niveaux de difficulté."

export default function MotsCroisesAImprimerPage() {
  // NEW: real FAQ content now exists, schema gets a genuine FAQPage node.
  const schemaGraph = buildGamePageSchemaGraph({
    path: ROUTES.motsCroisesImprimer,
    name: PAGE_NAME,
    description: PAGE_DESCRIPTION,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: PAGE_NAME, href: ROUTES.motsCroisesImprimer },
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
          eyebrow="À imprimer"
          title="Mots Croisés à Imprimer"
          description="Toutes nos grilles, prêtes à imprimer avec le bouton ci-dessous — aucune inscription requise."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-4 flex flex-col gap-4">
          {MOTS_CROISES_INTRO_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} className="no-print text-sm leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
          <p className="text-sm font-semibold text-muted-foreground">
            Clique sur « Imprimer cette page », puis choisis « Enregistrer en PDF » dans la fenêtre
            d&apos;impression de ton navigateur si tu préfères une version numérique.
          </p>
        </div>

        <div className="mt-6">
          <PrintableCrosswordList />
        </div>

        <div className="no-print mt-8 flex flex-col gap-8">
          <HowToPlayBlock {...MOTS_CROISES_HOW_TO_PLAY} />

          <FaqAccordion items={MOTS_CROISES_FAQ} />

          <PuzzleFormatLinks current="mots-croises" />
        </div>
      </div>
    </div>
  )
}
