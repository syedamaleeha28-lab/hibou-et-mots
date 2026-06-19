import { prisma } from "@/lib/db/client"
import type { PuzzlePageData } from "@/lib/db/types/page-data"
import { mapPuzzleToCardData, mapPuzzleToPageData } from "./mappers"

export type { PuzzlePageData } from "@/lib/db/types/page-data"
export { mapPuzzleToCardData, mapPuzzleToPageData } from "./mappers"

const puzzleInclude = {
  difficulty: true,
  grade: true,
  theme: true,
  categories: {
    include: {
      category: {
        include: {
          grade: true,
          theme: true,
          difficulty: true,
          pressBrand: true,
        },
      },
    },
  },
} as const

export async function getPuzzleBySlug(slug: string) {
  return prisma.puzzle.findUnique({
    where: { slug },
    include: puzzleInclude,
  })
}

export async function getPuzzlePageData(slug: string): Promise<PuzzlePageData | null> {
  const puzzle = await getPuzzleBySlug(slug)
  if (!puzzle || puzzle.status !== "PUBLISHED") return null

  const primaryCategoryId = puzzle.categories[0]?.categoryId
  const relatedCandidates = primaryCategoryId
    ? (
        await prisma.puzzle.findMany({
          where: {
            status: "PUBLISHED",
            id: { not: puzzle.id },
            categories: { some: { categoryId: primaryCategoryId } },
          },
          include: {
            difficulty: true,
            grade: true,
            theme: true,
          },
          take: 24,
          orderBy: { viewCount: "desc" },
        })
      ).map((row) => ({
        ...mapPuzzleToCardData(row),
        themeId: row.themeId,
        gradeId: row.gradeId,
        difficultyId: row.difficultyId,
      }))
    : []

  return mapPuzzleToPageData(puzzle, relatedCandidates)
}
