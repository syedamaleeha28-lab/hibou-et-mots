import Link from "next/link"
import { SectionHeading } from "@/components/layout/section-heading"
import { SchemaJsonLd } from "@/components/seo"
import { CrosswordBoard } from "@/components/games/mini-crossword/crossword-board"
import { gridsForTier } from "@/lib/mini-crossword/grids"
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"
import { buildGamePageSchemaGraph } from "@/lib/seo/schema/game-page"
import { motsCroisesForcePath } from "@/lib/seo/routes"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import {
  MOTS_CROISES_FAQ,
  MOTS_CROISES_HOW_TO_PLAY,
  MOTS_CROISES_INTRO_PARAGRAPHS,
} from "@/lib/content/mots-croises-seo"

type Tier = 1 | 2 | 3 | 4 | 5

const TIER_COPY: Record<Tier, { title: string; description: string; detail: string }> = {
  1: {
    title: "Mots Croisés Force 1 (Facile)",
    description: "Le niveau le plus accessible : petite grille, mots courts, idéal pour débuter.",
    detail:
      "Le niveau Force 1 convient aux débutants et aux enfants qui découvrent les mots croisés. La grille est compacte, les mots sont courts et les définitions restent simples — parfait pour prendre confiance avant de passer aux niveaux suivants.",
  },
  2: {
    title: "Mots Croisés Force 2",
    description: "Un peu plus de mots à trouver, toujours avec un vocabulaire courant.",
    detail:
      "Force 2 ajoute quelques définitions supplémentaires par rapport au niveau Force 1, tout en gardant un vocabulaire familier. C'est un bon niveau pour progresser sans se décourager.",
  },
  3: {
    title: "Mots Croisés Force 3 (Intermédiaire)",
    description: "Notre niveau intermédiaire : cinq définitions à croiser autour d'un mot central.",
    detail:
      "Force 3 est notre niveau intermédiaire : un mot central de cinq lettres et cinq définitions verticales à croiser. Un format idéal pour une pause quotidienne, ni trop facile ni trop difficile.",
  },
  4: {
    title: "Mots Croisés Force 4",
    description: "Une grille plus large avec six mots à trouver.",
    detail:
      "Force 4 propose une grille plus large avec six mots à trouver au total. Un bon choix si le niveau Force 3 est devenu trop facile pour toi.",
  },
  5: {
    title: "Mots Croisés Force 5 (Difficile)",
    description: "Notre niveau le plus corsé, pour les amateurs confirmés.",
    detail:
      "Force 5 est notre niveau le plus corsé : un mot central de sept lettres et cinq définitions croisées à résoudre. Pour les amateurs de mots croisés qui veulent un vrai défi.",
  },
}

export function ForceTierPage({ tier }: { tier: Tier }) {
  const copy = TIER_COPY[tier]
  const grids = gridsForTier(tier)
  const otherTiers = ([1, 2, 3, 4, 5] as Tier[]).filter((t) => t !== tier)
  const path = motsCroisesForcePath(tier)

  // NEW: FAQ content now exists (MOTS_CROISES_FAQ), so the schema graph
  // gets a real FAQPage node instead of honestly omitting one.
  const schemaGraph = buildGamePageSchemaGraph({
    path,
    name: copy.title,
    description: copy.description,
    breadcrumbs: [
      { label: "Accueil", href: "/" },
      { label: "Mots Croisés à Imprimer", href: "/mots-croises-a-imprimer/" },
      { label: copy.title, href: path },
    ],
    faqItems: MOTS_CROISES_FAQ,
  })

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaGraph} />

        <SectionHeading
          align="left"
          as="h1"
          eyebrow="Mots croisés en ligne"
          title={copy.title}
          description={copy.description}
          className="gap-2 [&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-4xl"
        />

        <div className="mt-4 flex flex-col gap-4">
          <p className="text-base leading-relaxed text-foreground/90">{copy.detail}</p>
          {MOTS_CROISES_INTRO_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-8">
          {grids.map((grid) => (
            <div key={grid.id} className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
              <CrosswordBoard grid={grid} />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/70 p-5">
          <h2 className="font-heading text-lg font-extrabold text-foreground">Autres niveaux de difficulté</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {otherTiers.map((t) => (
              <li key={t}>
                <Link
                  href={`/mots-croises-force-${t}/`}
                  className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-sm font-extrabold text-foreground hover:bg-secondary/20"
                >
                  Force {t}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-muted-foreground">
            Tu préfères imprimer ta grille ?{" "}
            <Link href="/mots-croises-a-imprimer/" className="text-primary underline">
              Voir les mots croisés à imprimer
            </Link>
            .
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <HowToPlayBlock {...MOTS_CROISES_HOW_TO_PLAY} />

          <FaqAccordion items={MOTS_CROISES_FAQ} />

          <PuzzleFormatLinks current="mots-croises" />
        </div>
      </div>
    </div>
  )
}
