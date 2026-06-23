import type { CategoryPageData } from "@/lib/db/types/page-data"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SchemaJsonLd } from "@/components/seo"
import { buildCategoryPageSchemaGraph } from "@/lib/seo/schema"
import { shouldShowComboParentLinks } from "@/lib/seo/linking"
import { CategoryIntro } from "./category-intro"
import { CategoryPhase1Sections } from "./category-phase1-sections"
import { CategoryPhase2Sections } from "./category-phase2-sections"
import { CategoryThemeSections } from "./category-theme-sections"
import { CategoryExploreLinks } from "./category-explore-links"
import { SubCategoryLinks } from "./sub-category-links"
import { ComboParentLinks } from "./combo-parent-links"
import { PuzzleCardGrid } from "./puzzle-card-grid"
import { RelatedCategoriesRow } from "./related-categories-row"
import { CategoryCta } from "./category-cta"
import { HowToPlayBlock } from "@/components/templates/shared/how-to-play-block"
import { FaqAccordion } from "@/components/templates/shared/faq-accordion"

export type CategoryTemplateProps = {
  category: CategoryPageData
  searchParams?: { page?: string }
}

export function CategoryTemplate({ category }: CategoryTemplateProps) {
  const schemaGraph = buildCategoryPageSchemaGraph(category)

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <SchemaJsonLd data={schemaGraph} />

        <BreadcrumbTrail items={category.breadcrumbs} className="mb-6" includeSchema={false} />

        <div className="flex flex-col gap-10 lg:gap-14">
          <CategoryIntro category={category} />

          <CategoryThemeSections slug={category.slug} />

          <CategoryPhase1Sections slug={category.slug} />

          <CategoryPhase2Sections slug={category.slug} />

          <CategoryExploreLinks category={category} />

          {shouldShowComboParentLinks(category.type) && category.comboParentLinks && (
            <ComboParentLinks links={category.comboParentLinks} />
          )}

          <SubCategoryLinks category={category} />

          <PuzzleCardGrid category={category} />

          <HowToPlayBlock />

          <FaqAccordion items={category.faqJson} />

          <RelatedCategoriesRow categories={category.relatedCategories} />

          <CategoryCta themeSlug={category.theme?.slug} />
        </div>
      </div>
    </div>
  )
}

export { buildCategoryMetadata } from "@/lib/seo/metadata"
