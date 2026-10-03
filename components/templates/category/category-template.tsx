import type { CategoryPageData } from "@/lib/db/types/page-data"
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail"
import { SchemaJsonLd } from "@/components/seo"
import { buildCategoryPageSchemaGraph } from "@/lib/seo/schema"
import { shouldShowComboParentLinks } from "@/lib/seo/linking"
import { CategoryIntro, CategoryIntroDetails } from "./category-intro"
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
import { SeniorsEditorial } from "@/components/templates/seniors/seniors-editorial"
import { PageIllustration } from "@/components/ui/page-illustration"
import { getCategoryIllustrations } from "@/lib/images/page-illustrations"
import { cn } from "@/lib/utils"
// New: cross-format link block (mots mêlés ↔ mots croisés ↔ mots coupés).
// Deliberately rendered unconditionally, unlike CategoryExploreLinks —
// see the component's own doc comment for why.
import { PuzzleFormatLinks } from "@/components/shared/puzzle-format-links"
import { getCategoryChrome } from "@/lib/content/category-chrome"

export type CategoryTemplateProps = {
  category: CategoryPageData
  searchParams?: { page?: string }
}

export function CategoryTemplate({ category }: CategoryTemplateProps) {
  const emptyCatalogMode = shouldUseEmptyCatalogMode(category)
  const schemaGraph = buildCategoryPageSchemaGraph(category)
  const illustrations = getCategoryIllustrations(category)
  // CategoryPageData.locale is `string | undefined`. Narrow it before
  // any call that expects the "fr" | "pt-BR" union, and declare it
  // before getCategoryChrome so the value exists at every call site.
  const resolvedLocale = category.locale === "pt-BR" ? "pt-BR" : "fr"
  // NEW: locale now threaded into getCategoryChrome — the "hub-imprimer"
  // override was French-only and leaking its grid heading onto the
  // PT-BR print hub, since that page reuses the same slug.
  const chrome = getCategoryChrome(category.slug, resolvedLocale)
  // Bug fix (part 1, already shipped): this template is shared by French
  // and PT-BR category pages. Five components had no locale check and
  // rendered hardcoded/slug-keyed FRENCH content unconditionally on
  // PT-BR pages. Suppressed entirely since none had researched PT-BR
  // equivalent content: a synonym-coverage sentence (strategic keyword
  // device, no PT research done), the how-to-play block, two large
  // French editorial sections, and a French author bio implying she
  // wrote Portuguese content she didn't.
  //
  // Bug fix (part 2, this change): four MORE components — FaqAccordion,
  // RelatedCategoriesRow, PuzzleCardGrid, SubCategoryLinks — had the
  // same problem but for short UI labels, not strategic content. Those
  // got real Portuguese translations instead of suppression, since
  // accurate UI-label translation doesn't need keyword research the way
  // the synonym note did, and PuzzleCardGrid in particular is the
  // page's actual primary content (the puzzle listing) — suppressing it
  // was never an option.
  //
  // CategoryCta turned out to belong with part 1, not part 2: its
  // buttons link to the French-only generator and online-player tools,
  // which have no PT-BR equivalent at all. Translating the button
  // LABELS while the links stayed French-only would have been worse
  // than the original bug — a Portuguese label promising a Portuguese
  // experience that doesn't exist. Suppressed for PT-BR along with the
  // rest of part 1's list.
  const isPtBr = resolvedLocale === "pt-BR"

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

          <PageIllustration variant="hero" illustration={illustrations.hero} />

          {emptyCatalogMode && <CategoryEmptyState category={category} />}

          {!isPtBr && <CategorySynonymNote />}

          {!emptyCatalogMode && (
            <PuzzleCardGrid category={category} heading={chrome.gridHeading} locale={resolvedLocale} />
          )}

          {!emptyCatalogMode && !isPtBr && <HowToPlayBlock {...chrome.howToPlay} />}

          {!emptyCatalogMode && (
            <PageIllustration variant="preview" illustration={illustrations.preview} />
          )}

          <CategoryIntroDetails category={category} />

          <CategoryThemeSections slug={category.slug} />

          {!isPtBr && <CategoryPhase1Sections slug={category.slug} />}

          {!isPtBr && <CategoryPhase2Sections slug={category.slug} />}

          {category.slug === "adultes" && <AdultesEditorial />}

          {category.slug === "seniors" && <SeniorsEditorial />}

          <CategoryExploreLinks category={category} />

          {/* Cross-format links are French-only content (crosswords/mots
              coupés have no PT-BR equivalent yet) — this template is
              shared with PT-BR category pages, so guard by locale. */}
          {category.locale !== "pt-BR" && <PuzzleFormatLinks current="mots-meles" />}

          {shouldShowComboParentLinks(category.type) && category.comboParentLinks && (
            <ComboParentLinks links={category.comboParentLinks} />
          )}

          <SubCategoryLinks category={category} locale={resolvedLocale} />

          <FaqAccordion items={category.faqJson} locale={resolvedLocale} />

          {!isPtBr && shouldShowAuthorAttribution(category.slug, category.type) && (
            <AuthorAttribution />
          )}

          <RelatedCategoriesRow categories={category.relatedCategories} locale={resolvedLocale} />

          {!emptyCatalogMode && !isPtBr && <CategoryCta themeSlug={category.theme?.slug} />}
        </div>
      </div>
    </div>
  )
}

export { buildCategoryMetadata } from "@/lib/seo/metadata"
