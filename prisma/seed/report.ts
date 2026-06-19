import type { PrismaClient } from "@prisma/client"
import { computeIsIndexable } from "@/lib/seo/indexability"
import { resolveCategoryPath, resolvePuzzlePath, ROUTES } from "@/lib/seo/routes"
import type { CategoryType } from "@/lib/db/types/page-data"
import { CATEGORY_SEED_DEFINITIONS } from "./categories"
import { buildPuzzlePlan } from "./puzzles"

export type SeedCoverageReport = {
  categoryCount: number
  puzzleCount: number
  categoryPuzzleLinks: number
  indexableCategoryUrls: number
  puzzleUrls: number
  totalGeneratedUrls: number
  mvpClustersCovered: number
  mvpClustersTotal: number
  indexableCategoriesBelowThreshold: number
  duplicateTitles: number
}

const MVP_CLUSTER_ROUTES = [
  { id: "HEAD_GENERIC", path: ROUTES.home },
  { id: "HUB_GRATUITS", path: ROUTES.gratuits },
  { id: "HUB_IMPRIMER", path: ROUTES.imprimer },
  { id: "DIFFICULTY", path: "/mots-meles-difficulte/facile/" },
  { id: "AUDIENCE_ENFANTS", path: ROUTES.enfants },
  { id: "GRADE_LEVEL", path: "/mots-meles-ecole/cp/" },
  { id: "EDU_PEDAGOGIE", path: ROUTES.pedagogie },
  { id: "SEAS_NOEL", path: "/mots-meles-fetes-saisons/noel/" },
  { id: "SEAS_HALLOWEEN", path: "/mots-meles-fetes-saisons/halloween/" },
  { id: "TOPIC", path: "/mots-meles-thematiques/animaux/" },
  { id: "RULES_SOLUTIONS", path: ROUTES.solutions },
  { id: "HUB_ECOLE", path: ROUTES.ecoleHub },
  { id: "HUB_THEMATIQUES", path: ROUTES.thematiquesHub },
  { id: "HUB_FETES", path: ROUTES.fetesHub },
  { id: "GRADE_COMBO", path: "/mots-meles-ecole/ce1/noel/" },
  { id: "TOPIC_SPORT", path: "/mots-meles-thematiques/sport/" },
] as const

export function buildPlannedUrlSet(): Set<string> {
  const urls = new Set<string>([ROUTES.home])

  for (const def of CATEGORY_SEED_DEFINITIONS) {
    urls.add(
      resolveCategoryPath({
        type: def.type,
        slug: def.slug,
        grade: def.gradeSlug ? { slug: def.gradeSlug } : null,
        theme: def.themeSlug ? { slug: def.themeSlug } : null,
        difficulty: def.difficultySlug ? { slug: def.difficultySlug } : null,
        pressBrand: def.pressBrandSlug ? { slug: def.pressBrandSlug } : null,
      }),
    )
  }

  for (const spec of buildPuzzlePlan()) {
    urls.add(resolvePuzzlePath(spec.slug))
  }

  return urls
}

export async function buildSeedCoverageReport(prisma: PrismaClient): Promise<SeedCoverageReport> {
  const categories = await prisma.category.findMany({
    where: { status: "PUBLISHED" },
    include: {
      grade: true,
      theme: true,
      difficulty: true,
      pressBrand: true,
      _count: {
        select: {
          puzzles: { where: { puzzle: { status: "PUBLISHED" } } },
        },
      },
    },
  })

  const puzzles = await prisma.puzzle.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, title: true, metaTitle: true },
  })

  const linkCount = await prisma.categoryPuzzle.count()

  let indexableCategoryUrls = 0
  let belowThreshold = 0
  const categoryPaths = new Set<string>()

  for (const category of categories) {
    const puzzleCount = category._count.puzzles
    const indexable = computeIsIndexable({
      status: category.status,
      puzzleCount,
      minPuzzleThreshold: category.minPuzzleThreshold,
    } satisfies Parameters<typeof computeIsIndexable>[0])

    const path = resolveCategoryPath({
      type: category.type as CategoryType,
      slug: category.slug,
      grade: category.grade,
      theme: category.theme,
      difficulty: category.difficulty,
      pressBrand: category.pressBrand,
    })
    categoryPaths.add(path)

    if (indexable) indexableCategoryUrls += 1
    else if (puzzleCount < category.minPuzzleThreshold) belowThreshold += 1
  }

  const puzzleUrls = puzzles.map((puzzle) => resolvePuzzlePath(puzzle.slug))
  const titleSet = new Set<string>()
  let duplicateTitles = 0
  for (const puzzle of puzzles) {
    const key = puzzle.metaTitle ?? puzzle.title
    if (titleSet.has(key)) duplicateTitles += 1
    titleSet.add(key)
  }

  const indexablePaths = new Set<string>([ROUTES.home, ...categoryPaths])
  for (const path of puzzleUrls) indexablePaths.add(path)

  const mvpClustersCovered = MVP_CLUSTER_ROUTES.filter((cluster) => indexablePaths.has(cluster.path)).length

  return {
    categoryCount: categories.length,
    puzzleCount: puzzles.length,
    categoryPuzzleLinks: linkCount,
    indexableCategoryUrls,
    puzzleUrls: puzzleUrls.length,
    totalGeneratedUrls: indexablePaths.size,
    mvpClustersCovered,
    mvpClustersTotal: MVP_CLUSTER_ROUTES.length,
    indexableCategoriesBelowThreshold: belowThreshold,
    duplicateTitles,
  }
}

export function buildOfflineCoverageSummary(): {
  plannedCategories: number
  plannedPuzzles: number
  plannedUrls: number
} {
  const urls = buildPlannedUrlSet()
  return {
    plannedCategories: CATEGORY_SEED_DEFINITIONS.length,
    plannedPuzzles: buildPuzzlePlan().length,
    plannedUrls: urls.size,
  }
}
