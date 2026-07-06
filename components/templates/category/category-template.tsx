import type { CategoryPageData } from "@/lib/db/types/page-data"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SchemaJsonLd } from "@/components/seo"
import { buildCategoryPageSchemaGraph } from "@/lib/seo/schema"
import { shouldShowComboParentLinks } from "@/lib/seo/linking"
import { CategoryIntro } from "./category-intro"
import { CategorySynonymNote } from "@/components/seo/category-synonym-note"
import { CategoryPhase1Sections } from "./category-phase1-sections"
import { CategoryPhase2Sections } from "./category-phase2-sections"
import { CategoryThemeSections } from "./category-theme-sections"
import { CategoryExploreLinks } from "./category-explore-links"
import { SubCategoryLinks } from "./sub-category-links"
import { ComboParentLinks } from "./combo-parent-links"
import { shouldUseEmptyCatalogMode } from "@/lib/category/catalog-layout"
import { CategoryEmptyState } from "./category-empty-state"
import { PuzzleCardGrid } from "./puzzle-card-grid"
import { RelatedCategoriesRow } from "./related-categories-row"
import { CategoryCta } from "./category-cta"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"
import { AuthorAttribution } from "@/components/seo/author-attribution"
import { shouldShowAuthorAttribution } from "@/lib/content/author"
import { AdultesEditorial } from "@/components/templates/adultes/adultes-editorial"
import { PedagogieEditorial } from "@/components/templates/pedagogie/pedagogie-editorial"
import { SeniorsEditorial } from "@/components/templates/seniors/seniors-editorial"
import { cn } from "@/lib/utils"

export type CategoryTemplateProps = {
  category: CategoryPageData
  searchParams?: { page?: string }
}

export function CategoryTemplate({ category }: CategoryTemplateProps) {
  const emptyCatalogMode = shouldUseEmptyCatalogMode(category)
  const schemaGraph = buildCategoryPageSchemaGraph(category)

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <SchemaJsonLd data={schemaGraph} />

        <BreadcrumbTrail items={category.breadcrumbs} className="mb-6" includeSchema={false} />

        <div
          className={cn(
            "flex flex-col",
            emptyCatalogMode ? "gap-6 lg:gap-8" : "gap-10 lg:gap-14",
          )}
        >
          <CategoryIntro category={category} />

          {emptyCatalogMode && <CategoryEmptyState category={category} />}

          <CategorySynonymNote />

          <CategoryThemeSections slug={category.slug} />

          <CategoryPhase1Sections slug={category.slug} />

          <CategoryPhase2Sections slug={category.slug} />

          {category.slug === "pedagogie" && <PedagogieEditorial />}

          {category.slug === "adultes" && <AdultesEditorial />}

          {category.slug === "seniors" && <SeniorsEditorial />}

          <CategoryExploreLinks category={category} />

          {shouldShowComboParentLinks(category.type) && category.comboParentLinks && (
            <ComboParentLinks links={category.comboParentLinks} />
          )}

          <SubCategoryLinks category={category} />

          {!emptyCatalogMode && <PuzzleCardGrid category={category} />}

          {!emptyCatalogMode && <HowToPlayBlock />}

          <FaqAccordion items={category.faqJson} />

          {shouldShowAuthorAttribution(category.slug, category.type) && (
            <AuthorAttribution />
          )}

          <RelatedCategoriesRow categories={category.relatedCategories} />

          {!emptyCatalogMode && <CategoryCta themeSlug={category.theme?.slug} />}
        </div>
      </div>
    </div>
  )
}

export { buildCategoryMetadata } from "@/lib/seo/metadata"
