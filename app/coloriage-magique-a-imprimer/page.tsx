import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { PageIllustration } from "@/components/ui/page-illustration"
import type { IllustrationSpec } from "@/lib/images/page-illustrations"
import { PrintableColoriageList } from "@/components/games/coloriage-magique/printable-coloriage-list"
import { ROUTES } from "@/lib/seo/routes"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import {
  COLORIAGE_MAGIQUE_FAQ,
  COLORIAGE_MAGIQUE_HOW_TO_PLAY,
  COLORIAGE_MAGIQUE_INTRO_PARAGRAPHS,
} from "@/lib/content/coloriage-magique-seo"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"

const PAGE_NAME = "Coloriage Magique à Imprimer"
const PAGE_DESCRIPTION =
  "Coloriages magiques à imprimer gratuitement en PDF pour la maternelle, le CP, le CE1 et plus."

export const metadata: Metadata = {
  title: "Coloriage Magique à Imprimer Gratuit (PDF) | Hibou&Mots",
  description:
    "Coloriages magiques à imprimer gratuitement en PDF pour la maternelle, le CP, le CE1 et plus. Numéros à colorer, sans inscription.",
  other: {
    google: "notranslate",
  },
}

const HERO: IllustrationSpec = {
  src: "/images/heroes/coloriage-magique-hero.webp",
  alt: "Un enfant colorie avec des crayons de couleur le dessin d'un soleil souriant",
  title: PAGE_NAME,
  caption: "Imprime tes coloriages magiques en PDF.",
  width: 1200,
  height: 675,
}

export default function ColoriageMagiqueAImprimerPage() {
  const schemaGraph = buildGamePageSchemaGraph({
    path: ROUTES.coloriageMagiqueImprimer,
    name: PAGE_NAME,
    description: PAGE_DESCRIPTION,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: PAGE_NAME, href: ROUTES.coloriageMagiqueImprimer },
    ],
    faqItems: COLORIAGE_MAGIQUE_FAQ,
  })

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaGraph} />

        <SectionHeading
          align="left"
          as="h1"
          eyebrow="À imprimer"
          title="Coloriage Magique à Imprimer"
          description="Toutes nos grilles, prêtes à imprimer avec le bouton ci-dessous — aucune inscription requise."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-4 flex flex-col gap-4">
          {COLORIAGE_MAGIQUE_INTRO_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} className="no-print text-sm leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
          <p className="text-sm font-semibold text-muted-foreground">
            Clique sur « Imprimer cette page », puis choisis « Enregistrer en PDF » dans la fenêtre
            d&apos;impression de ton navigateur si tu préfères une version numérique.
          </p>
        </div>

        <div className="no-print mt-6">
          <PageIllustration variant="hero" illustration={HERO} />
        </div>

        <div className="mt-6">
          <PrintableColoriageList />
        </div>

        <div className="no-print mt-8 flex flex-col gap-8">
          <HowToPlayBlock {...COLORIAGE_MAGIQUE_HOW_TO_PLAY} />

          <FaqAccordion items={COLORIAGE_MAGIQUE_FAQ} />

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
