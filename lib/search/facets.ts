import { prisma } from "@/lib/db/client"
import { difficultySeed } from "@/prisma/seed/difficulties"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"
import { CATEGORY_SEED_DEFINITIONS } from "@/prisma/seed/categories"
import { resolveCategoryPath } from "@/lib/seo/routes"
import type { SearchFacets } from "./types"

function fallbackFacets(): SearchFacets {
  return {
    themes: themeSeed.map((entry) => ({ slug: entry.slug, label: entry.name })),
    grades: gradeSeed.map((entry) => ({ slug: entry.slug, label: entry.name })),
    difficulties: difficultySeed.map((entry) => ({ slug: entry.slug, label: entry.name })),
    categories: CATEGORY_SEED_DEFINITIONS.slice(0, 24).map((entry) => ({
      slug: entry.slug,
      label: entry.h1,
    })),
  }
}

export async function getSearchFacets(): Promise<SearchFacets> {
  if (process.env.VITEST === "true" || process.env.PILOT_USE_MOCK_ONLY === "true") {
    return fallbackFacets()
  }

  try {
    const [themes, grades, difficulties, categories] = await Promise.all([
      prisma.theme.findMany({
        select: { slug: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.grade.findMany({
        select: { slug: true, name: true },
        orderBy: { order: "asc" },
      }),
      prisma.difficulty.findMany({
        select: { slug: true, name: true },
      }),
      prisma.category.findMany({
        where: { status: "PUBLISHED" },
        select: {
          slug: true,
          h1: true,
          type: true,
          grade: { select: { slug: true } },
          theme: { select: { slug: true } },
          difficulty: { select: { slug: true } },
          pressBrand: { select: { slug: true } },
        },
        orderBy: { h1: "asc" },
        take: 40,
      }),
    ])

    return {
      themes: themes.map((entry) => ({ slug: entry.slug, label: entry.name })),
      grades: grades.map((entry) => ({ slug: entry.slug, label: entry.name })),
      difficulties: difficulties.map((entry) => ({ slug: entry.slug, label: entry.name })),
      categories: categories.map((entry) => ({
        slug: entry.slug,
        label: entry.h1,
      })),
    }
  } catch {
    return fallbackFacets()
  }
}

export { fallbackFacets }
