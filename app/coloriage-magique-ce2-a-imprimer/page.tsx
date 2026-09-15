import type { Metadata } from "next"
import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { PageIllustration } from "@/components/ui/page-illustration"
import type { IllustrationSpec } from "@/lib/images/page-illustrations"
import { PrintThisPageButton } from "@/components/games/coloriage-magique/printable-coloriage-list"
import { designsForLevel } from "@/lib/coloriage-magique/engine"
import { ROUTES } from "@/lib/seo/routes"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import {
  COLORIAGE_CE2_FAQ,
  COLORIAGE_CE2_HOW_TO_PLAY,
  COLORIAGE_CE2_INTRO_PARAGRAPHS,
} from "@/lib/content/coloriage-ce2-seo"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"

const PAGE_NAME = "Coloriage Magique CE2 à Imprimer"
const PAGE_DESCRIPTION =
  "Coloriages magiques CE2 à imprimer gratuitement en PDF : dessins plus détaillés, 3 à 5 couleurs."

export const metadata: Metadata = {
  title: "Coloriage Magique CE2 à Imprimer Gratuit (PDF) | Hibou&Mots",
  description:
    "Coloriages magiques CE2 à imprimer gratuitement en PDF, avec numéros et légende de couleurs. Sans inscription.",
  other: { google: "notranslate" },
}

const HERO: IllustrationSpec = {
  src: "/images/heroes/coloriage-magique-hero.webp",
  alt: "Un enfant de CE2 colorie un coloriage magique avec plusieurs couleurs",
  title: PAGE_NAME,
  caption: "Imprime tes coloriages magiques CE2 en PDF.",
  width: 1200,
  height: 675,
}

const OUTLINE_COLOR = "#22303D"

export default function ColoriageMagiqueCe2AImprimerPage() {
  const designs = designsForLevel("ce2")

  const schemaGraph = buildGamePageSchemaGraph({
    path: ROUTES.coloriageMagiqueCe2Imprimer,
    name: PAGE_NAME,
    description: PAGE_DESCRIPTION,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: "Coloriage Magique à Imprimer", href: ROUTES.coloriageMagiqueImprimer },
      { label: PAGE_NAME, href: ROUTES.coloriageMagiqueCe2Imprimer },
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
          eyebrow="À imprimer — CE2"
          title="Coloriage Magique CE2 à Imprimer"
          description="Des dessins plus riches, prêts à imprimer, avec numéros et légende de couleurs."
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-4 flex flex-col gap-4">
          {COLORIAGE_CE2_INTRO_PARAGRAPHS.map((paragraph, i) => (
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

        <div className="no-print mb-4 flex justify-end">
          <PrintThisPageButton />
        </div>

        <div className="flex flex-col gap-10">
          {designs.map((design) => (
            <div
              key={design.id}
              className="break-inside-avoid flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6"
            >
              <h3 className="font-heading text-lg font-extrabold text-foreground">{design.title}</h3>
              <svg viewBox={design.viewBox} className="w-full max-w-xs">
                {design.regions.map((region) => {
                  const props = { key: region.id, fill: "white", stroke: OUTLINE_COLOR, strokeWidth: 2 }
                  if (region.shape.kind === "circle") {
                    return <circle {...props} cx={region.shape.cx} cy={region.shape.cy} r={region.shape.r} />
                  }
                  if (region.shape.kind === "polygon") {
                    return <polygon {...props} points={region.shape.points} />
                  }
                  return <path {...props} d={region.shape.d} />
                })}
                {design.regions.map((region) => (
                  <text
                    key={`${region.id}-label`}
                    x={region.labelX}
                    y={region.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill={OUTLINE_COLOR}
                  >
                    {region.number}
                  </text>
                ))}
              </svg>
              <ul className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-muted-foreground">
                {design.legend.map((entry) => (
                  <li key={entry.number}>
                    {entry.number} = {entry.colorName}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="no-print mt-8 flex flex-col gap-8">
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
