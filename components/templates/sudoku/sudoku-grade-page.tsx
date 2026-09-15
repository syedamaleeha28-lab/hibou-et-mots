import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { PageIllustration } from "@/components/ui/page-illustration"
import type { IllustrationSpec } from "@/lib/images/page-illustrations"
import { SudokuBoard } from "@/components/games/sudoku/sudoku-board"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { SUDOKU_HOW_TO_PLAY } from "@/lib/content/sudoku-seo"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"
import { puzzlesForTier } from "@/lib/sudoku/puzzles"
import type { SudokuGradeInfo } from "@/lib/sudoku/grades"
import { ROUTES, sudokuGradePath } from "@/lib/seo/routes"

const TIER_LABEL: Record<1 | 2, string> = { 1: "Facile", 2: "Difficile" }

export function buildSudokuGradeMetadata(grade: SudokuGradeInfo): Metadata {
  return {
    title: `Sudoku ${grade.name} Gratuit à Imprimer et en Ligne | Hibou&Mots`,
    description: `Sudoku pour le ${grade.name} (${grade.ageRange}) : grilles adaptées, gratuites, à jouer en ligne ou à imprimer. Sans inscription.`,
    other: { google: "notranslate" },
  }
}

export function SudokuGradePage({ grade }: { grade: SudokuGradeInfo }) {
  const puzzles = puzzlesForTier(grade.tier)
  const path = sudokuGradePath(grade.slug)

  const schemaGraph = buildGamePageSchemaGraph({
    path,
    name: `Sudoku ${grade.name}`,
    description: `Sudoku pour le ${grade.name} (${grade.ageRange}), gratuit, à jouer en ligne ou à imprimer.`,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: "Sudoku", href: ROUTES.sudoku },
      { label: `Sudoku ${grade.name}`, href: path },
    ],
    faqItems: [
      {
        question: `Le sudoku est-il adapté au niveau ${grade.name} ?`,
        answer: `Oui — les grilles de cette page sont calibrées pour le ${grade.name} (${grade.ageRange}), avec un niveau de difficulté ${TIER_LABEL[grade.tier].toLowerCase()} adapté à cet âge.`,
      },
      {
        question: "Peut-on imprimer ces grilles de sudoku ?",
        answer: `Oui, retrouve toutes nos grilles de sudoku, dont celles du ${grade.name}, sur la page à imprimer, en PDF gratuit.`,
      },
    ],
  })

  const HERO: IllustrationSpec = {
    src: "/images/heroes/sudoku-hero.webp",
    alt: `Sudoku pour le ${grade.name} — deux enfants résolvent une grille ensemble`,
    title: `Sudoku ${grade.name}`,
    caption: `Grilles adaptées au ${grade.name} (${grade.ageRange}).`,
    width: 1200,
    height: 675,
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaGraph} />

        <SectionHeading
          align="left"
          as="h1"
          eyebrow={`Sudoku ${grade.name}`}
          title={`Sudoku ${grade.name}`}
          description={`Des grilles de sudoku pensées pour le ${grade.name} (${grade.ageRange}) — niveau ${TIER_LABEL[grade.tier].toLowerCase()}.`}
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-foreground/90">
            Le sudoku est un excellent exercice de logique pour un enfant en {grade.name} : aucun
            calcul n&apos;est nécessaire, seulement de l&apos;observation et de la concentration.
            Les grilles de cette page sont de niveau {TIER_LABEL[grade.tier].toLowerCase()},
            adaptées aux enfants de {grade.ageRange}.
          </p>
        </div>

        <div className="mt-6">
          <PageIllustration variant="hero" illustration={HERO} />
        </div>

        <div className="mt-6 flex flex-col gap-8">
          {puzzles.map((puzzle) => (
            <div key={puzzle.id} className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
              <SudokuBoard puzzle={puzzle} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <HowToPlayBlock {...SUDOKU_HOW_TO_PLAY} />

          <FaqAccordion
            items={[
              {
                question: `Le sudoku est-il adapté au niveau ${grade.name} ?`,
                answer: `Oui — les grilles de cette page sont calibrées pour le ${grade.name} (${grade.ageRange}), avec un niveau de difficulté ${TIER_LABEL[grade.tier].toLowerCase()} adapté à cet âge.`,
              },
              {
                question: "Peut-on imprimer ces grilles de sudoku ?",
                answer: `Oui, retrouve toutes nos grilles de sudoku, dont celles du ${grade.name}, sur la page à imprimer, en PDF gratuit.`,
              },
              {
                question: "Y a-t-il d'autres niveaux scolaires disponibles ?",
                answer:
                  "Oui, retrouve toutes nos grilles de sudoku par niveau (CE1, CE2, CM1, CM2) depuis la page Sudoku principale.",
              },
            ]}
          />

          <SudokuGradeLinks currentSlug={grade.slug} />
        </div>
      </div>
    </div>
  )
}

function SudokuGradeLinks({ currentSlug }: { currentSlug: string }) {
  const links = [
    { label: "Sudoku (tous niveaux)", href: ROUTES.sudoku },
    { label: "Sudoku à imprimer", href: ROUTES.sudokuImprimer },
  ]
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-lg font-extrabold text-foreground">
        Autres niveaux et formats
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-2xl border border-border bg-background p-4 text-sm font-extrabold text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
