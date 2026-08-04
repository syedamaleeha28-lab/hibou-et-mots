import type { Metadata } from "next"
import { SectionHeading } from "@/components/layout/section-heading"
import { PrintableCrosswordList } from "@/components/games/mini-crossword/printable-crossword-list"

export const metadata: Metadata = {
  title: "Mots Croisés à Imprimer Gratuitement (PDF) | Hibou&Mots",
  description:
    "Des grilles de mots croisés gratuites à imprimer, du niveau Force 1 au Force 5. Utilise le bouton Imprimer de ton navigateur pour les garder sur papier.",
  other: {
    google: "notranslate",
  },
}

export default function MotsCroisesAImprimerPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
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
      </div>
    </div>
  )
}
