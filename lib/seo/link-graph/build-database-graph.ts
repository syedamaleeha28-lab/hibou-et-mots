import { prisma } from "@/lib/db/client"
import type { CategoryType } from "@/lib/db/types/page-data"
import { buildComboParentLinks } from "@/lib/seo/linking"
import { ROUTES, resolveCategoryPath, resolvePuzzlePath } from "@/lib/seo/routes"
import type { GraphAdjacency } from "./build-seed-graph"
import { collectHomeNavigationLinks } from "./build-seed-graph"
import { normalizeGraphPath } from "./paths"

function addEdge(adjacency: GraphAdjacency, from: string, to: string) {
  const source = normalizeGraphPath(from)
  const target = normalizeGraphPath(to)
  if (source === target) return
  if (!adjacency.has(source)) adjacency.set(source, new Set())
  adjacency.get(source)!.add(target)
}

export async function buildDatabaseLinkGraph(): Promise<GraphAdjacency | null> {
  if (process.env.VITEST === "true" || process.env.PILOT_USE_MOCK_ONLY === "true") {
    return null
  }

  try {
    const adjacency: GraphAdjacency = new Map()

    for (const href of collectHomeNavigationLinks()) {
      addEdge(adjacency, ROUTES.home, href)
    }

    const categories = await prisma.category.findMany({
      where: { status: "PUBLISHED" },
      include: {
        grade: true,
        theme: true,
        difficulty: true,
        pressBrand: true,
        puzzles: {
          where: { puzzle: { status: "PUBLISHED" } },
          include: { puzzle: { select: { slug: true } } },
        },
      },
    })

    const categoryPathById = new Map<string, string>()

    for (const category of categories) {
      const path = resolveCategoryPath({
        type: category.type as CategoryType,
        slug: category.slug,
        grade: category.grade,
        theme: category.theme,
        difficulty: category.difficulty,
        pressBrand: category.pressBrand,
      })
      categoryPathById.set(category.id, path)
      addEdge(adjacency, path, ROUTES.generateur)

      if (category.type === "COMBO" && category.grade && category.theme) {
        for (const link of buildComboParentLinks({
          grade: category.grade,
          theme: {
            ...category.theme,
            isSeasonal: category.theme.isSeasonal,
          },
        })) {
          addEdge(adjacency, path, link.href)
        }
      }

      for (const link of category.puzzles) {
        addEdge(adjacency, path, resolvePuzzlePath(link.puzzle.slug))
      }
    }

    for (const category of categories) {
      if (!category.parentCategoryId) continue
      const childPath = categoryPathById.get(category.id)
      const parentPath = categoryPathById.get(category.parentCategoryId)
      if (childPath && parentPath) {
        addEdge(adjacency, parentPath, childPath)
      }
    }

    const puzzles = await prisma.puzzle.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    })

    for (const puzzle of puzzles) {
      addEdge(adjacency, resolvePuzzlePath(puzzle.slug), ROUTES.generateur)
    }

    return adjacency
  } catch {
    return null
  }
}

export async function listDatabaseRequiredPages(): Promise<string[] | null> {
  if (process.env.VITEST === "true" || process.env.PILOT_USE_MOCK_ONLY === "true") {
    return null
  }

  try {
    const pages = new Set<string>([normalizeGraphPath(ROUTES.home)])

    const categories = await prisma.category.findMany({
      where: { status: "PUBLISHED" },
      include: {
        grade: true,
        theme: true,
        difficulty: true,
        pressBrand: true,
      },
    })

    for (const category of categories) {
      pages.add(
        resolveCategoryPath({
          type: category.type as CategoryType,
          slug: category.slug,
          grade: category.grade,
          theme: category.theme,
          difficulty: category.difficulty,
          pressBrand: category.pressBrand,
        }),
      )
    }

    const puzzles = await prisma.puzzle.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    })

    for (const puzzle of puzzles) {
      pages.add(resolvePuzzlePath(puzzle.slug))
    }

    return [...pages]
  } catch {
    return null
  }
}
