import type { FaqItem } from "@/lib/db/types/page-data"
import {
  CATEGORY_SYNONYM_NOTE,
  HOME_SYNONYM_PHRASE,
  HOW_TO_PLAY_SYNONYM_DESCRIPTION,
  TOOL_SYNONYM_PHRASE,
} from "@/lib/content/synonym-phrases"
import { adultesEditorialPlainText } from "@/lib/content/adultes"
import { pedagogieEditorialPlainText } from "@/lib/content/pedagogie"
import { seniorsEditorialPlainText } from "@/lib/content/seniors"
import { GENERATOR_FAQ, HOME_FAQ, ONLINE_PLAY_FAQ } from "@/lib/content/phase1/tools"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import type { CategoryPageData } from "@/lib/db/types/page-data"
import {
  resolveAudienceCategoryPageData,
  resolveComboCategoryPageData,
  resolveDifficultyCategoryPageData,
  resolveEcoleHubPageData,
  resolveGradeCategoryPageData,
  resolveHubCategoryPageData,
  resolvePressBrandCategoryPageData,
  resolveSeasonalCategoryPageData,
  resolveStaticSupportCategoryPageData,
  resolveThemeCategoryPageData,
} from "@/lib/db/queries/category-resolvers"
import { resolveCategoryFaq } from "@/lib/seo/templates"
import { categoryPathFromDefinition } from "@/lib/seo/link-graph/paths"
import { IMPORTANT_PAGE_PATHS } from "@/lib/seo/link-map/important-pages"
import { ROUTES } from "@/lib/seo/routes"
import {
  CATEGORY_SEED_DEFINITIONS,
  type CategorySeedDefinition,
} from "@/prisma/seed/categories"

export type SynonymPageCopy = {
  path: string
  slug: string
  isImportant: boolean
  text: string
}

function flattenFaq(faq: FaqItem[]): string {
  return faq.flatMap((item) => [item.question, item.answer]).join(" ")
}

const EDITORIAL_BY_SLUG: Record<string, string> = {
  pedagogie: pedagogieEditorialPlainText(),
  seniors: seniorsEditorialPlainText(),
  adultes: adultesEditorialPlainText(),
}

const HOME_PAGE_COPY = [
  HOME_SYNONYM_PHRASE,
  flattenFaq(HOME_FAQ),
  HOW_TO_PLAY_SYNONYM_DESCRIPTION,
].join(" ")

const GENERATOR_PAGE_COPY = [TOOL_SYNONYM_PHRASE, flattenFaq(GENERATOR_FAQ)].join(" ")

const ONLINE_PLAY_PAGE_COPY = [TOOL_SYNONYM_PHRASE, flattenFaq(ONLINE_PLAY_FAQ)].join(" ")

function isHubSlug(slug: string): boolean {
  return Object.values(HUB_CATEGORY_SLUGS).includes(
    slug as (typeof HUB_CATEGORY_SLUGS)[keyof typeof HUB_CATEGORY_SLUGS],
  )
}

async function resolveCategoryPage(
  def: CategorySeedDefinition,
): Promise<CategoryPageData | null> {
  if (def.isStaticSupport) {
    return resolveStaticSupportCategoryPageData(categoryPathFromDefinition(def), 1)
  }
  if (def.isHub) {
    if (def.slug === HUB_CATEGORY_SLUGS.ecole) return resolveEcoleHubPageData(1)
    if (isHubSlug(def.slug)) {
      return resolveHubCategoryPageData(
        def.slug as (typeof HUB_CATEGORY_SLUGS)[keyof typeof HUB_CATEGORY_SLUGS],
        1,
      )
    }
  }
  if (def.gradeSlug && def.themeSlug) {
    return resolveComboCategoryPageData(def.gradeSlug, def.themeSlug, 1)
  }
  if (def.gradeSlug && def.type === "GRADE") {
    return resolveGradeCategoryPageData(def.gradeSlug, 1)
  }
  if (def.themeSlug && def.type === "THEME") {
    return resolveThemeCategoryPageData(def.themeSlug, 1)
  }
  if (def.themeSlug && def.type === "SEASONAL") {
    return resolveSeasonalCategoryPageData(def.themeSlug, 1)
  }
  if (def.difficultySlug) {
    return resolveDifficultyCategoryPageData(def.difficultySlug, 1)
  }
  if (def.pressBrandSlug) {
    return resolvePressBrandCategoryPageData(def.pressBrandSlug, 1)
  }
  if (def.type === "AUDIENCE" && ["enfants", "adultes", "seniors"].includes(def.slug)) {
    return resolveAudienceCategoryPageData(
      def.slug as "enfants" | "adultes" | "seniors",
      1,
    )
  }
  return null
}

function flattenCategoryPage(page: CategoryPageData, def: CategorySeedDefinition): string {
  const faq = resolveCategoryFaq(
    page.slug,
    page.type,
    page.faqJson,
    isHubSlug(page.slug) || def.isHub === true,
  )

  return [
    page.h1,
    page.seoTitle,
    page.metaDescription,
    page.introText,
    flattenFaq(faq),
    CATEGORY_SYNONYM_NOTE,
    HOW_TO_PLAY_SYNONYM_DESCRIPTION,
    EDITORIAL_BY_SLUG[page.slug] ?? "",
  ]
    .filter(Boolean)
    .join(" ")
}

/** Collect visible editorial copy used for synonym audits (source-based). */
export async function collectSynonymPageCopies(): Promise<SynonymPageCopy[]> {
  const importantSet = new Set(IMPORTANT_PAGE_PATHS)
  const copies: SynonymPageCopy[] = [
    {
      path: ROUTES.home,
      slug: "home",
      isImportant: true,
      text: HOME_PAGE_COPY,
    },
    {
      path: ROUTES.generateur,
      slug: "generateur",
      isImportant: true,
      text: GENERATOR_PAGE_COPY,
    },
    {
      path: ROUTES.jouer,
      slug: "jouer",
      isImportant: true,
      text: ONLINE_PLAY_PAGE_COPY,
    },
  ]

  for (const def of CATEGORY_SEED_DEFINITIONS) {
    const path = categoryPathFromDefinition(def)
    const page = await resolveCategoryPage(def)
    if (!page) continue

    copies.push({
      path,
      slug: def.slug,
      isImportant: importantSet.has(path),
      text: flattenCategoryPage(page, def),
    })
  }

  return copies.sort((a, b) => a.path.localeCompare(b.path))
}
