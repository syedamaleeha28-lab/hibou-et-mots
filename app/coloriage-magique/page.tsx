import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { ColoriageGame } from "@/components/games/coloriage-magique/coloriage-game"
import { ROUTES } from "@/lib/seo/routes"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import {
  COLORIAGE_MAGIQUE_FAQ,
  COLORIAGE_MAGIQUE_HOW_TO_PLAY,
  COLORIAGE_MAGIQUE_INTRO_PARAGRAPHS,
} from "@/lib/content/coloriage-magique-seo"

export const metadata: Metadata = {
  title: "Coloriage Magique Gratuit en Ligne | Hibou&Mots",
  description:
    "Coloriage magique gratuit en ligne pour la maternelle et le CP : clique sur les numéros pour révéler le dessin. Un nouveau coloriage chaque jour, sans inscription.",
  other: {
    google: "notranslate",
  },
}

export default function ColoriageMagiquePage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Jeu quotidien"
          title="Coloriage Magique"
          description="Clique sur un numéro, puis colore la zone qui lui correspond — le dessin se révèle petit à petit !"
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-6 flex flex-col gap-4">
          {COLORIAGE_MAGIQUE_INTRO_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <ColoriageGame />
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <HowToPlayBlock {...COLORIAGE_MAGIQUE_HOW_TO_PLAY} />

          <FaqAccordion items={COLORIAGE_MAGIQUE_FAQ} />

          <OtherActivitiesLinks />
        </div>
      </div>
    </div>
  )
}

// A coloring page is a genuinely different activity type from every
// other puzzle format on the site — not a word puzzle, not a number
// puzzle. Its own small, honestly-labeled links block, same pattern as
// sudoku's SudokuFormatLinks.
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
