import type { Metadata } from "next"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { PageIllustration } from "@/components/ui/page-illustration"
import type { IllustrationSpec } from "@/lib/images/page-illustrations"
import { MotsCoupesGame } from "@/components/games/mots-coupes/mots-coupes-game"
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import {
  MOTS_COUPES_FAQ_ONLINE,
  MOTS_COUPES_HOW_TO_PLAY_ONLINE,
  MOTS_COUPES_INTRO_PARAGRAPHS_ONLINE,
} from "@/lib/content/mots-coupes-seo"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"
import { ROUTES } from "@/lib/seo/routes"

const PAGE_NAME = "Mots Coupés"
const PAGE_DESCRIPTION =
  "Joue aux mots coupés gratuitement en ligne : reconstitue chaque mot en associant le bon début à la bonne fin."

export const metadata: Metadata = {
  title: "Mots Coupés Gratuit en Ligne | Hibou&Mots",
  description:
    "Joue aux mots coupés gratuitement en ligne : reconstitue chaque mot en associant le bon début à la bonne fin. Une nouvelle grille chaque jour, sans inscription.",
  other: {
    google: "notranslate",
  },
}

const HERO: IllustrationSpec = {
  src: "/images/heroes/mots-coupes-hero.webp",
  alt: "Deux enfants assemblent les deux moitiés d'une grande carte représentant un soleil, symbolisant le jeu des mots coupés",
  title: PAGE_NAME,
  caption: "Retrouve le début et la fin de chaque mot.",
  width: 1200,
  height: 675,
}

const PREVIEW: IllustrationSpec = {
  src: "/images/previews/mots-coupes-preview.webp",
  alt: "Aperçu d'une fiche de mots coupés avec des cartes à associer reliées par des pointillés",
  title: `Exemple de grille — ${PAGE_NAME}`,
  caption: "Chaque grille est prête à imprimer ou à jouer en ligne.",
  width: 800,
  height: 600,
}

export default function MotsCoupesPage() {
  const schemaGraph = buildGamePageSchemaGraph({
    path: ROUTES.motsCoupes,
    name: PAGE_NAME,
    description: PAGE_DESCRIPTION,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: PAGE_NAME, href: ROUTES.motsCoupes },
    ],
    faqItems: MOTS_COUPES_FAQ_ONLINE,
  })

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaGraph} />

        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Jeu quotidien"
          title="Mots Coupés"
          description="Chaque mot a été coupé en deux morceaux. Retrouve le bon début et la bonne fin pour reconstituer tous les mots."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-6 flex flex-col gap-4">
          {MOTS_COUPES_INTRO_PARAGRAPHS_ONLINE.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6">
          <PageIllustration variant="hero" illustration={HERO} />
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <MotsCoupesGame />
        </div>

        <div className="mt-6">
          <PageIllustration variant="preview" illustration={PREVIEW} />
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <HowToPlayBlock {...MOTS_COUPES_HOW_TO_PLAY_ONLINE} />

          <FaqAccordion items={MOTS_COUPES_FAQ_ONLINE} />

          <PuzzleFormatLinks current="mots-coupes" />
        </div>
      </div>
    </div>
  )
}
