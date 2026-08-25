import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { SudokuGame } from "@/components/games/sudoku/sudoku-game"
import { ROUTES } from "@/lib/seo/routes"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { SUDOKU_FAQ, SUDOKU_HOW_TO_PLAY, SUDOKU_INTRO_PARAGRAPHS } from "@/lib/content/sudoku-seo"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"

const PAGE_NAME = "Sudoku"
const PAGE_DESCRIPTION = "Joue au sudoku gratuitement en ligne : grilles simples, idéales pour un enfant du CP au CM2."

export const metadata: Metadata = {
  title: "Sudoku Gratuit en Ligne pour Enfants | Hibou&Mots",
  description:
    "Joue au sudoku gratuitement en ligne : grilles simples, idéales pour un enfant du CP au CM2. Une nouvelle grille chaque jour, sans inscription.",
  other: {
    google: "notranslate",
  },
}

export default function SudokuPage() {
  const schemaGraph = buildGamePageSchemaGraph({
    path: ROUTES.sudoku,
    name: PAGE_NAME,
    description: PAGE_DESCRIPTION,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: PAGE_NAME, href: ROUTES.sudoku },
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
          eyebrow="Jeu quotidien"
          title="Sudoku"
          description="Remplis la grille pour que chaque ligne, colonne et carré de 3×3 contienne les chiffres de 1 à 9, sans répétition."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-6 flex flex-col gap-4">
          {SUDOKU_INTRO_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <SudokuGame />
        </div>

        <div className="mt-8 flex flex-col gap-8">
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
