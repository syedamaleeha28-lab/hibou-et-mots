import type { CategoryPageData } from "@/lib/db/types/page-data"
import type { ContentPageData, ContentPageVariant } from "@/lib/db/types/content-page-data"
import { shouldShowAuthorAttribution } from "@/lib/content/author"
import { getCategoryExploreLinks } from "@/lib/seo/linking/category-explore-links"

export function mapCategoryToContentPageData(
  category: CategoryPageData,
  variant: ContentPageVariant,
): ContentPageData {
  return {
    slug: category.slug,
    variant,
    h1: category.h1,
    introText: category.introText,
    seoTitle: category.seoTitle,
    metaDescription: category.metaDescription,
    canonicalPath: category.canonicalPath,
    isIndexable: true,
    breadcrumbs: category.breadcrumbs,
    faqJson: category.faqJson,
    relatedLinks: category.relatedCategories.map((link) => ({
      id: link.id,
      label: link.label,
      href: link.href,
      description: link.description,
    })),
    exploreLinks: getCategoryExploreLinks(category),
    showAuthorAttribution: shouldShowAuthorAttribution(category.slug, category.type),
    schema: {
      faqPage: category.schema.faqPage,
    },
  }
}
