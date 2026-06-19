import { describe, expect, it } from "vitest"
import {
  generatePuzzleBatch,
  resolveGenerateOptions,
  selectWordsFromBank,
  type DifficultySlug,
} from "@/lib/puzzle-engine"
import { themeWordSeed } from "@/prisma/seed/theme-words"
import { CATEGORY_SEED_DEFINITIONS } from "@/prisma/seed/categories"
import {
  buildPuzzlePlan,
  EXPECTED_PUZZLE_COUNT_MAX,
  EXPECTED_PUZZLE_COUNT_MIN,
} from "@/prisma/seed/puzzles"
import { buildOfflineCoverageSummary, buildPlannedUrlSet } from "@/prisma/seed/report"
import { resolveCategoryPath, ROUTES } from "@/lib/seo/routes"
import { MVP_P0_GRADE_SLUGS, MVP_P0_THEME_SLUGS } from "@/lib/db/adapters/category-constants"

describe("content seed plan", () => {
  it("defines the full MVP category set", () => {
    expect(CATEGORY_SEED_DEFINITIONS.length).toBeGreaterThanOrEqual(45)
    const slugs = new Set(CATEGORY_SEED_DEFINITIONS.map((entry) => entry.slug))
    expect(slugs.has("hub-ecole")).toBe(true)
    expect(slugs.has("animaux")).toBe(true)
    expect(slugs.has("ce1-noel")).toBe(true)
    expect(slugs.has("ressources-enseignants")).toBe(true)
  })

  it("plans 100-150 unique puzzles", () => {
    const plan = buildPuzzlePlan()
    const slugs = new Set(plan.map((entry) => entry.slug))
    expect(plan.length).toBeGreaterThanOrEqual(EXPECTED_PUZZLE_COUNT_MIN)
    expect(plan.length).toBeLessThanOrEqual(EXPECTED_PUZZLE_COUNT_MAX)
    expect(slugs.size).toBe(plan.length)
    expect(slugs.has("animaux-facile-01")).toBe(true)
  })

  it("assigns at least four category links per P0 leaf category", () => {
    const plan = buildPuzzlePlan()
    const linksByCategory = new Map<string, number>()

    for (const spec of plan) {
      for (const slug of spec.categorySlugs) {
        linksByCategory.set(slug, (linksByCategory.get(slug) ?? 0) + 1)
      }
    }

    for (const theme of MVP_P0_THEME_SLUGS) {
      expect(linksByCategory.get(theme) ?? 0).toBeGreaterThanOrEqual(4)
    }
    for (const grade of MVP_P0_GRADE_SLUGS) {
      expect(linksByCategory.get(grade) ?? 0).toBeGreaterThanOrEqual(4)
    }
    for (const difficulty of ["facile", "moyen", "difficile"]) {
      expect(linksByCategory.get(difficulty) ?? 0).toBeGreaterThanOrEqual(4)
    }
  })

  it("generates all planned puzzles with the puzzle engine", () => {
    const plan = buildPuzzlePlan().slice(0, 12)
    const bankByTheme = new Map<string, { word: string; length: number; minGradeOrder: number }[]>()

    for (const entry of themeWordSeed) {
      const list = bankByTheme.get(entry.themeSlug) ?? []
      list.push({
        word: entry.word,
        length: entry.word.length,
        minGradeOrder: entry.minGradeOrder,
      })
      bankByTheme.set(entry.themeSlug, list)
    }

    function wordsForSpec(
      themeSlug: string,
      gradeOrder: number,
      difficulty: DifficultySlug,
      seed: number,
    ): string[] {
      const bank = bankByTheme.get(themeSlug) ?? []
      const attempts: DifficultySlug[] =
        difficulty === "difficile"
          ? ["difficile", "moyen", "facile"]
          : difficulty === "moyen"
            ? ["moyen", "facile"]
            : ["facile"]
      for (const level of attempts) {
        try {
          return selectWordsFromBank(bank, gradeOrder, level, seed)
        } catch {
          continue
        }
      }
      return selectWordsFromBank(bank, gradeOrder, "facile", seed)
    }

    const batch = generatePuzzleBatch(
      plan.map((spec) => ({
        id: spec.id,
        options: resolveGenerateOptions({
          difficulty: spec.difficulty,
          grade: spec.gradeSlug,
          words: wordsForSpec(
            spec.themeSlug,
            spec.gradeSlug ? 2 : 4,
            spec.difficulty,
            spec.seed,
          ),
          seed: spec.seed,
        }),
      })),
      { seedBase: 99_000 },
    )

    expect(batch.stats.failed).toBe(0)
    expect(batch.stats.succeeded).toBe(plan.length)
  })

  it("builds planned URL coverage for categories and puzzles", () => {
    const summary = buildOfflineCoverageSummary()
    expect(summary.plannedCategories).toBe(CATEGORY_SEED_DEFINITIONS.length)
    expect(summary.plannedPuzzles).toBe(buildPuzzlePlan().length)
    expect(summary.plannedUrls).toBe(buildPlannedUrlSet().size)
    expect(summary.plannedUrls).toBeGreaterThan(140)
  })

  it("resolves static support category paths from DB slugs", () => {
    expect(
      resolveCategoryPath({
        type: "AUDIENCE",
        slug: "ressources-enseignants",
      }),
    ).toBe(ROUTES.ressources)
    expect(
      resolveCategoryPath({
        type: "AUDIENCE",
        slug: "application",
      }),
    ).toBe(ROUTES.application)
  })
})
