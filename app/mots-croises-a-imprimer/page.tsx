import type { Metadata } from "next"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { PrintableCrosswordList } from "@/components/games/mini-crossword/printable-crossword-list"
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"
import { ROUTES } from "@/lib/seo/routes"

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
  // No FAQ content on this page yet — schema reflects that honestly
  // (BreadcrumbList + WebPage, no fabricated FAQPage node).
  const schemaGraph = buildGamePageSchemaGraph({
    path: ROUTES.motsCroisesImprimer,
    name: PAGE_NAME,
    description: PAGE_DESCRIPTION,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: PAGE_NAME, href: ROUTES.motsCroisesImprimer },
    ],
    faqItems: [],
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
        <p className="mt-4 text-sm font-semibold text-muted-foreground">
          Clique sur « Imprimer cette page », puis choisis « Enregistrer en PDF » dans la fenêtre
          d&apos;impression de ton navigateur si tu préfères une version numérique.
        </p>
        <div className="mt-6">
          <PrintableCrosswordList />
        </div>

        <div className="no-print mt-8">
          <PuzzleFormatLinks current="mots-croises" />
        </div>
      </div>
    </div>
  )
}
