import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { PrintableColoriageList } from "@/components/games/coloriage-magique/printable-coloriage-list"
import { ROUTES } from "@/lib/seo/routes"

// Matches "coloriage magique à imprimer cp" (350/mo), "coloriage
// magique cm1/cm2 à imprimer" (200-450/mo), "coloriage magique ce1 à
// imprimer pdf" (350/mo) — all near-zero competition, all genuinely
// matched by this page's actual content.
export const metadata: Metadata = {
  title: "Coloriage Magique à Imprimer Gratuit (PDF) | Hibou&Mots",
  description:
    "Coloriages magiques à imprimer gratuitement en PDF pour la maternelle, le CP, le CE1 et plus. Numéros à colorer, sans inscription.",
  other: {
    google: "notranslate",
  },
}

export default function ColoriageMagiqueAImprimerPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          as="h1"
          eyebrow="À imprimer"
          title="Coloriage Magique à Imprimer"
          description="Toutes nos grilles, prêtes à imprimer avec le bouton ci-dessous — aucune inscription requise."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />
        <p className="mt-4 text-sm font-semibold text-muted-foreground">
          Clique sur « Imprimer cette page », puis choisis « Enregistrer en PDF » dans la fenêtre
          d&apos;impression de ton navigateur si tu préfères une version numérique.
        </p>
        <div className="mt-6">
          <PrintableColoriageList />
        </div>

        <div className="no-print mt-8">
          <OtherActivitiesLinks />
        </div>
      </div>
    </div>
  )
}

function OtherActivitiesLinks() {
  const links = [
    { label: "Mots mêlés", href: ROUTES.imprimer, description: "Trouve les mots cachés dans une grille" },
    { label: "Sudoku", href: ROUTES.sudokuImprimer, description: "Remplis la grille de chiffres" },
    { label: "Mots croisés", href: ROUTES.motsCroisesImprimer, description: "Complète la grille avec les définitions" },
  ]
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-lg font-extrabold text-foreground">
        Envie d&apos;une autre activité&nbsp;?
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted"
            >
              <span className="block text-sm font-extrabold text-foreground">{link.label}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{link.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
