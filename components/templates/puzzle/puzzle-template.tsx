import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SchemaJsonLd } from "@/components/seo"
import { buildPuzzlePageSchemaGraph } from "@/lib/seo/schema"
import { AdSlotPlaceholder } from "@/components/templates/shared/ad-slot-placeholder"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { PuzzleHeader } from "./puzzle-header"
import { PuzzlePlaySection } from "./puzzle-play-section"
import { PuzzleActionBar } from "./puzzle-action-bar"
import { RelatedPuzzlesGrid } from "./related-puzzles-grid"
import { PuzzleCta } from "./puzzle-cta"

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

          <PuzzlePlaySection puzzle={puzzle} />

          <PuzzleActionBar puzzle={puzzle} />

          <AdSlotPlaceholder variant="in-content" />

          <RelatedPuzzlesGrid puzzles={puzzle.relatedPuzzles} />

          <FaqAccordion items={puzzle.faqJson} />

          <PuzzleCta themeSlug={puzzle.theme?.slug} />
        </div>
      </div>
    </div>
  )
}

export { buildPuzzleMetadata } from "@/lib/seo/metadata"
