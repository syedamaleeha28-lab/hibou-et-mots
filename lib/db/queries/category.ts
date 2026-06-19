/**
 * Prisma query layer for category pages.
 * Route files call these functions; templates receive mapped `CategoryPageData`.
 */
import { prisma } from "@/lib/db/client"
import type { CategoryType } from "@/lib/db/types/page-data"
import type { CategoryPageData } from "@/lib/db/types/page-data"
import {
  mapCategoryToPageData,
  mapPuzzleToCardData,
  paginatePuzzles,
  type CategoryRecord,
} from "./mappers"
import { resolveCategoryPath } from "@/lib/seo/routes"

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

export async function getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  return prisma.category.findUnique({
    where: { slug },
    include: categoryInclude,
  })
}

export async function getCategoryByThemeSlug(
  themeSlug: string,
): Promise<CategoryRecord | null> {
  return prisma.category.findFirst({
    where: {
      type: "THEME",
      theme: { slug: themeSlug },
    },
    include: categoryInclude,
  })
}

export async function getCategoryPageData(
  slug: string,
  page = 1,
): Promise<CategoryPageData | null> {
  const category = await getCategoryBySlug(slug)
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
    include: categoryInclude,
    orderBy: { slug: "asc" },
  })

  return children.map((child) => ({
    id: child.id,
    label: child.h1,
    href: resolveCategoryPath({
      type: child.type as CategoryType,
      slug: child.slug,
      grade: child.grade,
      theme: child.theme,
      difficulty: child.difficulty,
      pressBrand: child.pressBrand,
    }),
    description: child.introText.slice(0, 120),
    puzzleCount: 0,
    badge: child.grade?.name,
  }))
}

export async function listRelatedCategories(
  categoryId: string,
): Promise<CategoryPageData["relatedCategories"]> {
  void categoryId
  // Phase C seed + linking algorithm will populate related categories.
  return []
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
