import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { PrintableSudokuList } from "@/components/games/sudoku/printable-sudoku-list"
import { ROUTES } from "@/lib/seo/routes"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { SUDOKU_FAQ, SUDOKU_HOW_TO_PLAY, SUDOKU_INTRO_PARAGRAPHS } from "@/lib/content/sudoku-seo"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"

const PAGE_NAME = "Sudoku à Imprimer"
const PAGE_DESCRIPTION = "Des grilles de sudoku gratuites à imprimer, niveau facile et difficile."

export const metadata: Metadata = {
  title: "Sudoku à Imprimer Gratuitement (PDF) | Hibou&Mots",
  description:
    "Des grilles de sudoku gratuites à imprimer, niveau facile et difficile. Utilise le bouton Imprimer de ton navigateur pour les garder sur papier.",
  other: {
    google: "notranslate",
  },
}

export default function SudokuAImprimerPage() {
  const schemaGraph = buildGamePageSchemaGraph({
    path: ROUTES.sudokuImprimer,
    name: PAGE_NAME,
    description: PAGE_DESCRIPTION,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: PAGE_NAME, href: ROUTES.sudokuImprimer },
    ],
    faqItems: SUDOKU_FAQ,
  })

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaGraph} />

        <SectionHeading
          align="left"
          as="h1"
          eyebrow="À imprimer"
          title="Sudoku à Imprimer"
          description="Toutes nos grilles, prêtes à imprimer avec le bouton ci-dessous — aucune inscription requise."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-4 flex flex-col gap-4">
          {SUDOKU_INTRO_PARAGRAPHS.map((paragraph, i) => (
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
          <PrintableSudokuList />
        </div>

        <div className="no-print mt-8 flex flex-col gap-8">
          <HowToPlayBlock {...SUDOKU_HOW_TO_PLAY} />

          <FaqAccordion items={SUDOKU_FAQ} />

          <SudokuFormatLinks />
        </div>
      </div>
    </div>
  )
}

function SudokuFormatLinks() {
  const links = [
    { label: "Mots mêlés", href: ROUTES.imprimer, description: "Trouve les mots cachés dans une grille" },
    { label: "Mots croisés", href: ROUTES.motsCroisesImprimer, description: "Complète la grille avec les définitions" },
    { label: "Mots coupés", href: ROUTES.motsCoupesImprimer, description: "Associe le début et la fin de chaque mot" },
  ]
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-lg font-extrabold text-foreground">
        Envie d&apos;un autre défi&nbsp;?
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
