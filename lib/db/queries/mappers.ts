import type { Prisma } from "@prisma/client"
import type {
  CategoryPageData,
  CategorySummary,
  CategoryType,
  FaqItem,
  PaginatedPuzzles,
  PuzzleCardData,
  PuzzlePageData,
} from "@/lib/db/types/page-data"
import { buildComboParentLinks } from "@/lib/seo/linking"
import {
  buildCreativeWorkSchema,
  buildFaqPageSchema,
  buildItemListSchema,
  buildLinksItemListSchema,
} from "@/lib/seo/schema"
import { gradePath } from "@/lib/seo/routes"
import { gradeSeed } from "@/prisma/seed/grades"
import {
  computeIsIndexable,
  type IndexableInput,
} from "@/lib/seo/indexability"
import {
  resolveCategoryFaq,
  resolvePuzzleFaq,
  CATEGORY_PAGE_SIZE,
} from "@/lib/seo/templates"
import {
  ptPuzzlePath,
  puzzlePath,
  resolveCategoryPath,
  resolvePuzzlePath,
} from "@/lib/seo/routes"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs"
import { selectRelatedPuzzles } from "@/lib/seo/related-puzzles"

const HUB_CATEGORY_SLUG_SET = new Set<string>(Object.values(HUB_CATEGORY_SLUGS))

export type CategoryRecord = Prisma.CategoryGetPayload<{
  include: {
    grade: true
    theme: true
    difficulty: true
    pressBrand: true
  }
}>

type PuzzleRecord = Prisma.PuzzleGetPayload<{
  include: {
    difficulty: true
    grade: true
    theme: true
    categories: {
      include: {
        category: {
          include: {
            grade: true
            theme: true
            difficulty: true
          }
        }
      }
    }
  }
}>

export function mapPuzzleToCardData(
  puzzle: Pick<
    PuzzleRecord,
    | "id"
    | "slug"
    | "title"
    | "size"
    | "viewCount"
    | "thumbnailUrl"
    | "wordList"
    | "difficulty"
    | "grade"
    | "theme"
    // PT-BR pack: needed to pick the right puzzle URL prefix below.
    | "language"
  >,
): PuzzleCardData {
  const wordList = Array.isArray(puzzle.wordList) ? puzzle.wordList : []
  // PT-BR pack: puzzle.language already existed on the schema (defaults
  // to "fr"). Without this branch, Portuguese puzzle cards would link to
  // /mots-meles/[slug]/ — a French-prefixed URL with no matching content
  // language. Route file for the PT path is app/caca-palavras/[slug]/page.tsx.
  const href = puzzle.language === "pt-BR" ? ptPuzzlePath(puzzle.slug) : puzzlePath(puzzle.slug)
  return {
    id: puzzle.id,
    slug: puzzle.slug,
    title: puzzle.title,
    href,
    difficulty: { slug: puzzle.difficulty.slug, name: puzzle.difficulty.name },
    grade: puzzle.grade ? { slug: puzzle.grade.slug, name: puzzle.grade.name } : undefined,
    theme: puzzle.theme ? { slug: puzzle.theme.slug, name: puzzle.theme.name } : undefined,
    size: puzzle.size,
    wordCount: wordList.length,
    viewCount: puzzle.viewCount,
    thumbnailUrl: puzzle.thumbnailUrl ?? undefined,
  }
}

export function paginatePuzzles(
  items: PuzzleCardData[],
  page: number,
  pageSize = CATEGORY_PAGE_SIZE,
): PaginatedPuzzles {
  const totalCount = items.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalCount,
    totalPages,
  }
}

export function isCategoryHub(
  category: Pick<
    CategoryRecord,
    "slug" | "type" | "gradeId" | "themeId" | "difficultyId" | "pressBrandId"
  >,
): boolean {
  if (HUB_CATEGORY_SLUG_SET.has(category.slug)) return true
  if (category.type === "GRADE") return !category.gradeId
  if (category.type === "THEME" || category.type === "SEASONAL") return !category.themeId
  if (category.type === "DIFFICULTY") return !category.difficultyId
  if (category.type === "PRESS_BRAND") return !category.pressBrandId
  return false
}

export function mapCategoryToSummary(category: CategoryRecord): CategorySummary {
  const href = resolveCategoryPath({
    type: category.type as CategoryType,
    locale: (category.locale as "fr" | "pt-BR" | undefined) ?? "fr",
    slug: category.slug,
    grade: category.grade,
    theme: category.theme,
    difficulty: category.difficulty,
    pressBrand: category.pressBrand,
  })

  return {
    id: category.id,
    type: category.type as CategoryType,
    slug: category.slug,
    label: category.h1,
    href,
  }
}

// PT-BR pack: root breadcrumb label swap. buildBreadcrumbs() (unseen file,
// unchanged) always emits the French root label ("Accueil"). Rather than
// editing that shared function blind, we patch just the root item here
// when locale is pt-BR — same href ("/"), Portuguese label only.
function localizeBreadcrumbRoot(
  breadcrumbs: CategoryPageData["breadcrumbs"],
  locale: string,
): CategoryPageData["breadcrumbs"] {
  if (locale !== "pt-BR" || breadcrumbs.length === 0) return breadcrumbs
  const [root, ...rest] = breadcrumbs
  return [{ ...root, label: "Início" }, ...rest]
}

export function mapCategoryToPageData(
  category: CategoryRecord,
  puzzles: PuzzleCardData[],
  options: {
    page?: number
    subCategories?: CategoryPageData["subCategories"]
    relatedCategories?: CategoryPageData["relatedCategories"]
    comboParentLinks?: CategoryPageData["comboParentLinks"]
  } = {},
): CategoryPageData {
  const page = options.page ?? 1
  const hub = isCategoryHub(category)
  const locale = (category.locale as "fr" | "pt-BR" | undefined) ?? "fr"
  const canonicalPath = resolveCategoryPath({
    type: category.type as CategoryType,
    locale,
    slug: category.slug,
    grade: category.grade,
    theme: category.theme,
    difficulty: category.difficulty,
    pressBrand: category.pressBrand,
  })

  // PT-BR pack: skip resolveCategoryFaq (unseen file — likely has French
  // slug-specific fallback text baked in) and use the FAQ items supplied
  // directly on the mock category record instead.
  const faqJson: FaqItem[] =
    locale === "pt-BR"
      ? ((category.faqJson as FaqItem[] | null) ?? [])
      : resolveCategoryFaq(
          category.slug,
          category.type as CategoryType,
          category.faqJson as CategoryPageData["faqJson"] | null,
          hub,
        )

  const paginated = paginatePuzzles(puzzles, page)
  const puzzleCount = puzzles.length

  const breadcrumbsRaw = buildBreadcrumbs({
    pageType: "category",
    category: {
      type: category.type as CategoryType,
      h1: category.h1,
      canonicalPath,
      isHub: hub,
      grade: category.grade ?? undefined,
      theme: category.theme ?? undefined,
      difficulty: category.difficulty ?? undefined,
      pressBrand: category.pressBrand ?? undefined,
    },
  })
  const breadcrumbs = localizeBreadcrumbRoot(breadcrumbsRaw, locale)

  const indexableInput: IndexableInput = {
    status: category.status,
    puzzleCount,
    minPuzzleThreshold: category.minPuzzleThreshold,
  }

  const comboParentLinks =
    options.comboParentLinks ??
    (category.type === "COMBO" && category.grade && category.theme
      ? buildComboParentLinks({
          grade: category.grade,
          theme: {
            ...category.theme,
            isSeasonal: category.theme.isSeasonal,
          },
        })
      : undefined)

  const itemList =
    category.slug === "hub-ecole" && locale !== "pt-BR"
      ? buildLinksItemListSchema(
          "Niveaux scolaires — Mots mêlés École",
          gradeSeed.map((grade) => ({
            name: grade.name,
            href: gradePath(grade.slug),
          })),
        )
      : buildItemListSchema(category.h1, paginated.items)

  return {
    id: category.id,
    type: category.type as CategoryType,
    slug: category.slug,
    h1: category.h1,
    introText: category.introText,
    faqJson,
    seoTitle: category.seoTitle,
    metaDescription: category.metaDescription,
    canonicalPath,
    isIndexable: computeIsIndexable(indexableInput),
    puzzleCount,
    minPuzzleThreshold: category.minPuzzleThreshold,
    breadcrumbs,
    subCategories: options.subCategories ?? [],
    puzzles: paginated,
    relatedCategories: options.relatedCategories ?? [],
    comboParentLinks,
    grade: category.grade ?? undefined,
    theme: category.theme ?? undefined,
    difficulty: category.difficulty ?? undefined,
    pressBrand: category.pressBrand ?? undefined,
    schema: {
      itemList,
      faqPage: buildFaqPageSchema(faqJson),
    },
  }
}

export function pickPrimaryCategory(
  categories: Array<CategorySummary & { type: CategoryType }>,
): CategorySummary | undefined {
  const priority: CategoryType[] = ["COMBO", "THEME", "SEASONAL", "GRADE", "DIFFICULTY", "AUDIENCE", "PRESS_BRAND"]
  for (const type of priority) {
    const match = categories.find((c) => c.type === type)
    if (match) return match
  }
  return categories[0]
}

export function mapPuzzleToPageData(
  puzzle: PuzzleRecord,
  relatedCandidates: PuzzleCardData[],
): PuzzlePageData {
  const grid = puzzle.gridData as string[][]
  const wordList = puzzle.wordList as PuzzlePageData["wordList"]
  const solutionData = puzzle.solutionData as PuzzlePageData["solutionData"]
  const canonicalPath = resolvePuzzlePath(puzzle.slug)

  const parentCategories = puzzle.categories.map((cp) =>
    mapCategoryToSummary(cp.category as CategoryRecord),
  )

  const breadcrumbs = buildBreadcrumbs({
    pageType: "puzzle",
    puzzle: { title: puzzle.title, canonicalPath },
    parentCategories,
  })

  const faqJson = resolvePuzzleFaq(null)

  const relatedPuzzles = selectRelatedPuzzles(relatedCandidates, {
    puzzleId: puzzle.id,
    themeId: puzzle.themeId,
    gradeId: puzzle.gradeId,
    difficultyId: puzzle.difficultyId,
  })

  const pageData: Omit<PuzzlePageData, "schema"> = {
    id: puzzle.id,
    slug: puzzle.slug,
    title: puzzle.title,
    // PT-BR pack: lets locale-aware UI (e.g. PuzzleHeader's H1 prefix)
    // branch correctly instead of hardcoding French.
    language: puzzle.language,
    grid,
    wordList,
    solutionData,
    size: puzzle.size,
    largePrint: puzzle.largePrint,
    difficulty: { slug: puzzle.difficulty.slug, name: puzzle.difficulty.name },
    grade: puzzle.grade ?? undefined,
    theme: puzzle.theme ?? undefined,
    pdfUrl: puzzle.pdfUrl ?? undefined,
    thumbnailUrl: puzzle.thumbnailUrl ?? undefined,
    metaTitle: puzzle.metaTitle ?? undefined,
    metaDescription: puzzle.metaDescription ?? undefined,
    canonicalPath,
    breadcrumbs,
    relatedPuzzles,
    parentCategories,
    faqJson,
  }

  return {
    ...pageData,
    schema: {
      creativeWork: buildCreativeWorkSchema(
        pageData,
        undefined,
        puzzle.thumbnailUrl ?? undefined,
        {
          parentCategorySlugs: puzzle.categories.map((cp) => cp.category.slug),
        },
      ),
      faqPage: buildFaqPageSchema(faqJson),
    },
  }
}
