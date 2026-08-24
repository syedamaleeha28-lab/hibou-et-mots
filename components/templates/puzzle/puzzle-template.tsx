import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { AuthorAttribution, SchemaJsonLd } from "@/components/seo"
import { buildPuzzlePageSchemaGraph } from "@/lib/seo/schema"
import { AdSlotPlaceholder } from "@/components/templates/shared/ad-slot-placeholder"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { PuzzleHeader } from "./puzzle-header"
import { PuzzlePlaySection } from "./puzzle-play-section"
import { PuzzleActionBar } from "./puzzle-action-bar"
import { RelatedPuzzlesGrid } from "./related-puzzles-grid"
import { PuzzleCta } from "./puzzle-cta"
// New: cross-format link block (mots mêlés ↔ mots croisés ↔ mots coupés).
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"

export type PuzzleTemplateProps = {
  puzzle: PuzzlePageData
}

export function PuzzleTemplate({ puzzle }: PuzzleTemplateProps) {
  const schemaGraph = buildPuzzlePageSchemaGraph(puzzle)

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <SchemaJsonLd data={schemaGraph} />

        <BreadcrumbTrail items={puzzle.breadcrumbs} className="mb-6" includeSchema={false} />

        <div className="flex flex-col gap-10 lg:gap-12">
          <PuzzleHeader puzzle={puzzle} />

          <AuthorAttribution />

          <PuzzlePlaySection puzzle={puzzle} />

          <PuzzleActionBar puzzle={puzzle} />

          <AdSlotPlaceholder variant="in-content" />

          <RelatedPuzzlesGrid puzzles={puzzle.relatedPuzzles} />

          <FaqAccordion items={puzzle.faqJson} />

          {/* Cross-format links are French-only content (crosswords/mots
              coupés have no PT-BR equivalent yet) — this template is
              shared with PT-BR puzzle pages, so guard by locale. */}
          {puzzle.language !== "pt-BR" && <PuzzleFormatLinks current="mots-meles" />}

          <PuzzleCta themeSlug={puzzle.theme?.slug} />
        </div>
      </div>
    </div>
  )
}

export { buildPuzzleMetadata } from "@/lib/seo/metadata"
