/**
 * Prisma query layer for category pages.
 * Route files call these functions; templates receive mapped `CategoryPageData`.
 *
 * PT-BR pack: every lookup now takes an optional `locale` (default "fr"),
 * matching the (locale, slug) uniqueness added to the schema. Existing
 * French call sites that don't pass `locale` are unaffected.
 *
 * IMPORTANT: requires `npx prisma migrate dev --name add_locale_support`
 * to have been run — see prisma/schema.prisma notes in this pack.
 */
import { prisma } from "@/lib/db/client"
import type { CategoryType } from "@/lib/db/types/page-data"
import type { CategoryPageData } from "@/lib/db/types/page-data"
import {
  isCategoryHub,
  mapCategoryToPageData,
  mapPuzzleToCardData,
  paginatePuzzles,
  type CategoryRecord,
} from "./mappers"
import { resolveCategoryPath } from "@/lib/seo/routes"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"

export type { CategoryPageData } from "@/lib/db/types/page-data"
export {
  mapCategoryToPageData,
  mapCategoryToSummary,
  mapPuzzleToCardData,
  paginatePuzzles,
  isCategoryHub,
} from "./mappers"

const categoryInclude = {
  grade: true,
  theme: true,
  difficulty: true,
  pressBrand: true,
} as const

const categoryIncludeWithCounts = {
  ...categoryInclude,
  _count: {
    select: {
      puzzles: {
        where: { puzzle: { status: "PUBLISHED" } },
      },
    },
  },
} as const

export async function getCategoryBySlug(
  slug: string,
  locale = "fr",
): Promise<CategoryRecord | null> {
  return prisma.category.findFirst({
    where: { slug, locale },
    include: categoryInclude,
  })
}

export async function getCategoryByThemeSlug(
  themeSlug: string,
  locale = "fr",
): Promise<CategoryRecord | null> {
  return prisma.category.findFirst({
    where: {
      type: "THEME",
      locale,
      theme: { slug: themeSlug, locale },
    },
    include: categoryInclude,
  })
}

export async function getCategoryByGradeSlug(
  gradeSlug: string,
  locale = "fr",
): Promise<CategoryRecord | null> {
  return prisma.category.findFirst({
    where: {
      type: "GRADE",
      locale,
      grade: { slug: gradeSlug, locale },
    },
    include: categoryInclude,
  })
}

export async function getCategoryBySeasonalThemeSlug(
  themeSlug: string,
  locale = "fr",
): Promise<CategoryRecord | null> {
  return prisma.category.findFirst({
    where: {
      type: "SEASONAL",
      locale,
      theme: { slug: themeSlug, locale },
    },
    include: categoryInclude,
  })
}

export async function getCategoryByDifficultySlug(
  levelSlug: string,
  locale = "fr",
): Promise<CategoryRecord | null> {
  return prisma.category.findFirst({
    where: {
      type: "DIFFICULTY",
      locale,
      difficulty: { slug: levelSlug, locale },
    },
    include: categoryInclude,
  })
}

export async function getCategoryByPressBrandSlug(
  brandSlug: string,
): Promise<CategoryRecord | null> {
  // PressBrand has no locale field (unchanged from original) — press hub
  // is French-only for now.
  return prisma.category.findFirst({
    where: {
      type: "PRESS_BRAND",
      pressBrand: { slug: brandSlug },
    },
    include: categoryInclude,
  })
}

export async function getComboCategory(
  gradeSlug: string,
  themeSlug: string,
  locale = "fr",
): Promise<CategoryRecord | null> {
  return prisma.category.findFirst({
    where: {
      type: "COMBO",
      locale,
      grade: { slug: gradeSlug, locale },
      theme: { slug: themeSlug, locale },
    },
    include: categoryInclude,
  })
}

export async function getCategoryPageData(
  slug: string,
  page = 1,
  locale = "fr",
): Promise<CategoryPageData | null> {
  const category = await getCategoryBySlug(slug, locale)
  if (!category) return null

  const puzzleRows = await prisma.puzzle.findMany({
    where: {
      status: "PUBLISHED",
      categories: { some: { categoryId: category.id } },
    },
    include: {
      difficulty: true,
      grade: true,
      theme: true,
    },
    orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
  })

  const puzzles = puzzleRows.map(mapPuzzleToCardData)
  const subCategories = await listSubCategories(category.id)
  const relatedCategories = await listRelatedCategories(category.id)

  return mapCategoryToPageData(category, puzzles, {
    page,
    subCategories,
    relatedCategories,
  })
}

export async function listSubCategories(
  parentCategoryId: string,
): Promise<CategoryPageData["subCategories"]> {
  const children = await prisma.category.findMany({
    where: {
      parentCategoryId,
      status: "PUBLISHED",
    },
    include: categoryIncludeWithCounts,
    orderBy: { slug: "asc" },
  })

  return children.map((child) => ({
    id: child.id,
    label: child.h1,
    href: resolveCategoryPath({
      type: child.type as CategoryType,
      locale: (child.locale as "fr" | "pt-BR" | undefined) ?? "fr",
      slug: child.slug,
      grade: child.grade,
      theme: child.theme,
      difficulty: child.difficulty,
      pressBrand: child.pressBrand,
    }),
    description: child.introText.slice(0, 120),
    puzzleCount: child._count.puzzles,
    badge: child.grade?.name,
  }))
}

function mapCategoryToRelatedLink(
  category: CategoryRecord & { _count?: { puzzles: number } },
): CategoryPageData["relatedCategories"][number] {
  return {
    id: category.id,
    label: category.h1,
    href: resolveCategoryPath({
      type: category.type as CategoryType,
      locale: (category.locale as "fr" | "pt-BR" | undefined) ?? "fr",
      slug: category.slug,
      grade: category.grade,
      theme: category.theme,
      difficulty: category.difficulty,
      pressBrand: category.pressBrand,
    }),
    description: category.metaDescription.slice(0, 120),
    puzzleCount: category._count?.puzzles ?? 0,
  }
}

const HUB_SLUG_LIST = Object.values(HUB_CATEGORY_SLUGS)

export async function listRelatedCategories(
  categoryId: string,
): Promise<CategoryPageData["relatedCategories"]> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: categoryInclude,
  })
  if (!category) return []

  const locale = category.locale ?? "fr"
  const hub = isCategoryHub(category)

  if (hub || HUB_SLUG_LIST.includes(category.slug as (typeof HUB_SLUG_LIST)[number])) {
    const siblings = await prisma.category.findMany({
      where: {
        locale,
        slug: { in: HUB_SLUG_LIST.filter((slug) => slug !== category.slug) },
        status: "PUBLISHED",
      },
      include: categoryIncludeWithCounts,
      take: 4,
    })
    return siblings.map(mapCategoryToRelatedLink)
  }

  switch (category.type) {
    case "GRADE": {
      if (!category.grade) return []
      const adjacentOrders = [category.grade.order - 1, category.grade.order + 1].filter(
        (order) => order >= 0,
      )
      const related = await prisma.category.findMany({
        where: {
          type: "GRADE",
          locale,
          gradeId: { not: null },
          grade: { order: { in: adjacentOrders } },
          status: "PUBLISHED",
        },
        include: categoryIncludeWithCounts,
        take: 2,
      })
      const themes = await prisma.category.findMany({
        where: { type: "THEME", locale, themeId: { not: null }, status: "PUBLISHED" },
        include: categoryIncludeWithCounts,
        orderBy: { slug: "asc" },
        take: 2,
      })
      return [...related, ...themes].map(mapCategoryToRelatedLink)
    }
    case "THEME":
    case "SEASONAL": {
      if (!category.theme) return []
      const siblings = await prisma.category.findMany({
        where: {
          type: category.type,
          locale,
          themeId: { not: null },
          theme: { group: category.theme.group },
          id: { not: category.id },
          status: "PUBLISHED",
        },
        include: categoryIncludeWithCounts,
        take: 4,
      })
      return siblings.map(mapCategoryToRelatedLink)
    }
    case "DIFFICULTY": {
      const siblings = await prisma.category.findMany({
        where: {
          type: "DIFFICULTY",
          locale,
          difficultyId: { not: null },
          id: { not: category.id },
          status: "PUBLISHED",
        },
        include: categoryIncludeWithCounts,
        orderBy: { slug: "asc" },
        take: 3,
      })
      return siblings.map(mapCategoryToRelatedLink)
    }
    case "COMBO": {
      if (!category.grade || !category.theme) return []
      const parents = await prisma.category.findMany({
        where: {
          locale,
          OR: [
            { type: "GRADE", gradeId: category.gradeId ?? undefined },
            {
              type: category.theme.isSeasonal ? "SEASONAL" : "THEME",
              themeId: category.themeId ?? undefined,
            },
          ],
          status: "PUBLISHED",
        },
        include: categoryIncludeWithCounts,
      })
      return parents.map(mapCategoryToRelatedLink)
    }
    case "AUDIENCE": {
      const audienceSlugs = ["enfants", "adultes", "seniors"]
      if (audienceSlugs.includes(category.slug)) {
        const siblings = await prisma.category.findMany({
          where: {
            type: "AUDIENCE",
            locale,
            slug: { in: audienceSlugs.filter((slug) => slug !== category.slug) },
            status: "PUBLISHED",
          },
          include: categoryIncludeWithCounts,
        })
        return siblings.map(mapCategoryToRelatedLink)
      }
      const hubs = await prisma.category.findMany({
        where: {
          locale,
          slug: { in: [HUB_CATEGORY_SLUGS.gratuits, HUB_CATEGORY_SLUGS.ecole] },
          status: "PUBLISHED",
        },
        include: categoryIncludeWithCounts,
      })
      return hubs.map(mapCategoryToRelatedLink)
    }
    case "PRESS_BRAND": {
      const siblings = await prisma.category.findMany({
        where: {
          type: "PRESS_BRAND",
          id: { not: category.id },
          status: "PUBLISHED",
        },
        include: categoryIncludeWithCounts,
        take: 3,
      })
      return siblings.map(mapCategoryToRelatedLink)
    }
    default:
      return []
  }
}

export async function listCategoryPuzzles(
  categoryId: string,
  page = 1,
  pageSize = 24,
) {
  const puzzleRows = await prisma.puzzle.findMany({
    where: {
      status: "PUBLISHED",
      categories: { some: { categoryId } },
    },
    include: {
      difficulty: true,
      grade: true,
      theme: true,
    },
    orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
  })

  return paginatePuzzles(puzzleRows.map(mapPuzzleToCardData), page, pageSize)
}
