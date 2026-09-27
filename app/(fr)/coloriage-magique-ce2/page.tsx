import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { PageIllustration } from "@/components/ui/page-illustration"
import type { IllustrationSpec } from "@/lib/images/page-illustrations"
import { ColoriageBoard } from "@/components/games/coloriage-magique/coloriage-board"
import { designsForLevel, getDayIndex, getDesignForDay } from "@/lib/coloriage-magique/engine"
import { ROUTES } from "@/lib/seo/routes"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import {
  COLORIAGE_CE2_FAQ,
  COLORIAGE_CE2_HOW_TO_PLAY,
  COLORIAGE_CE2_INTRO_PARAGRAPHS,
} from "@/lib/content/coloriage-ce2-seo"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"

const PAGE_NAME = "Coloriage Magique CE2"
const PAGE_DESCRIPTION =
  "Coloriage magique gratuit en ligne pour le CE2 : dessins plus détaillés, 3 à 5 couleurs à identifier."

export const metadata: Metadata = {
  title: "Coloriage Magique CE2 Gratuit en Ligne | Hibou&Mots",
  description:
    "Coloriage magique gratuit pour le CE2 : dessins plus riches, 3 à 5 couleurs, à jouer en ligne ou à imprimer. Sans inscription.",
  other: { google: "notranslate" },
}

const HERO: IllustrationSpec = {
  src: "/images/heroes/coloriage-magique-hero.webp",
  alt: "Un enfant de CE2 colorie un coloriage magique avec plusieurs couleurs",
  title: PAGE_NAME,
  caption: "Des dessins plus détaillés, adaptés au CE2.",
  width: 1200,
  height: 675,
}

export default function ColoriageMagiqueCe2Page() {
  const dayIndex = getDayIndex()
  const design = getDesignForDay(dayIndex, designsForLevel("ce2"))

  const schemaGraph = buildGamePageSchemaGraph({
    path: ROUTES.coloriageMagiqueCe2,
    name: PAGE_NAME,
    description: PAGE_DESCRIPTION,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: "Coloriage Magique", href: ROUTES.coloriageMagique },
      { label: PAGE_NAME, href: ROUTES.coloriageMagiqueCe2 },
    ],
    faqItems: COLORIAGE_CE2_FAQ,
  })

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaGraph} />

        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Jeu quotidien — CE2"
          title="Coloriage Magique CE2"
          description="Des dessins plus riches, avec plusieurs couleurs à identifier — adaptés au niveau CE2."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-6 flex flex-col gap-4">
          {COLORIAGE_CE2_INTRO_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6">
          <PageIllustration variant="hero" illustration={HERO} />
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <ColoriageBoard design={design} />
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <HowToPlayBlock {...COLORIAGE_CE2_HOW_TO_PLAY} />

          <FaqAccordion items={COLORIAGE_CE2_FAQ} />

          <ColoriageCe2Links />
        </div>
      </div>
    </div>
  )
}

function ColoriageCe2Links() {
  const links = [
    { label: "Coloriage magique (maternelle/CP)", href: ROUTES.coloriageMagique },
    { label: "Coloriage magique à imprimer", href: ROUTES.coloriageMagiqueImprimer },
    { label: "Sudoku CE2", href: "/sudoku-ce2/" },
  ]
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
      <h2 className="font-heading text-lg font-extrabold text-foreground">
        Autres niveaux et activités
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
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
