import type { PrismaClient } from "@prisma/client"
import { difficultySeed } from "./difficulties"
import { gradeSeed } from "./grades"
import { themeWordSeed } from "./theme-words"
import { themeSeed } from "./themes"
import { difficultySeedPt } from "./difficulties.pt"
import { themeSeedPt } from "./themes.pt"
import { themeWordSeedPt } from "./theme-words.pt"
// NEW: PT-BR grade seed data.
import { gradeSeedPt } from "./grades.pt"
import {
  CATEGORY_SEED_DEFINITIONS,
  seedCategories,
  seedPressBrands,
} from "./categories"
import { PT_CATEGORY_SEED_DEFINITIONS } from "./categories.pt"
import { buildPuzzlePlan, seedLocalizedPuzzles } from "./puzzles"
import { buildPtPuzzlePlan, seedPtPuzzles, seedPtGradePuzzles } from "./puzzles.pt"
import { MVP_PRESS_BRANDS } from "@/lib/db/adapters/category-constants"

export type SeedLogger = (message: string) => void

/**
 * Extracted from the original prisma/seed.ts so the same logic can run
 * from BOTH the local CLI script (prisma/seed.ts) and a protected admin
 * API route (app/api/admin/seed/route.ts). Needed because production's
 * DATABASE_URL is a Vercel "Sensitive" env var — write-only by design,
 * can never be pulled down for a local `prisma db seed` run. Only code
 * running ON Vercel (build step, or a deployed route) has legitimate
 * runtime access to it.
 *
 * Split into small, independently-callable pieces (rather than one
 * seedEverything() function) because puzzle generation is genuinely
 * slow (constraint-solving grid placement for 150 puzzles) and the
 * Hobby plan's serverless function time limit may not fit that in one
 * invocation. Each piece is idempotent (upserts throughout) and safe to
 * re-run or resume from a partial state.
 */

export async function seedReferenceDataAll(prisma: PrismaClient, log: SeedLogger) {
  log("Seeding reference data (fr)…")

  for (const grade of gradeSeed) {
    const existing = await prisma.grade.findFirst({ where: { locale: "fr", slug: grade.slug } })
    // Explicit field mapping, not a spread — gradeSeed entries carry an
    // `h1` field (used elsewhere for category seoTitle fallback) that
    // does NOT exist on the Prisma Grade model. Spreading `...grade`
    // directly into create/update data throws "Unknown argument `h1`".
    const data = {
      locale: "fr",
      slug: grade.slug,
      name: grade.name,
      ageRange: grade.ageRange,
      order: grade.order,
      defaultGridSize: grade.defaultGridSize,
      seoTitle: grade.seoTitle,
      metaDescription: grade.metaDescription,
      introText: grade.introText,
    }
    if (existing) {
      await prisma.grade.update({ where: { id: existing.id }, data })
    } else {
      await prisma.grade.create({ data })
    }
  }
  log(`  ✓ ${gradeSeed.length} grades`)

  for (const difficulty of difficultySeed) {
    const existing = await prisma.difficulty.findFirst({
      where: { locale: "fr", slug: difficulty.slug },
    })
    const data = { ...difficulty, locale: "fr", directions: [...difficulty.directions] }
    if (existing) {
      await prisma.difficulty.update({ where: { id: existing.id }, data })
    } else {
      await prisma.difficulty.create({ data })
    }
  }
  log(`  ✓ ${difficultySeed.length} difficulties`)

  const themeIdBySlug = new Map<string, string>()
  for (const theme of themeSeed) {
    const existing = await prisma.theme.findFirst({ where: { locale: "fr", slug: theme.slug } })
    const data = {
      locale: "fr",
      slug: theme.slug,
      name: theme.name,
      group: theme.group,
      isSeasonal: theme.isSeasonal,
      activeDateStart: theme.activeDateStart,
      activeDateEnd: theme.activeDateEnd,
      seoTitle: `Mots Mêlés ${theme.name} — Grilles Gratuites à Imprimer`,
      metaDescription: `Découvrez des grilles de mots mêlés sur le thème ${theme.name}, gratuites, imprimables en PDF et jouables en ligne.`,
      introText: `Une sélection de mots mêlés sur le thème ${theme.name}, à imprimer ou à jouer directement en ligne.`,
    }
    const record = existing
      ? await prisma.theme.update({
          where: { id: existing.id },
          data: {
            name: theme.name,
            group: theme.group,
            isSeasonal: theme.isSeasonal,
            activeDateStart: theme.activeDateStart,
            activeDateEnd: theme.activeDateEnd,
          },
        })
      : await prisma.theme.create({ data })
    themeIdBySlug.set(theme.slug, record.id)
  }
  log(`  ✓ ${themeSeed.length} themes`)

  let wordCount = 0
  for (const theme of themeSeed) {
    const themeId = themeIdBySlug.get(theme.slug)
    if (!themeId) continue
    await prisma.themeWord.deleteMany({ where: { themeId } })
    const words = themeWordSeed.filter((w) => w.themeSlug === theme.slug)
    if (words.length > 0) {
      await prisma.themeWord.createMany({
        data: words.map((w) => ({
          themeId,
          word: w.word,
          length: w.length,
          minGradeOrder: w.minGradeOrder,
        })),
      })
      wordCount += words.length
    }
  }
  log(`  ✓ ${wordCount} theme words`)

  log("Seeding reference data (pt-BR)…")

  // NEW: PT-BR grades. Must run before category seeding — Category.gradeId
  // is a foreign key, and without these rows existing first, PT grade
  // categories would silently get gradeId: null (see the note at the top
  // of grades.pt.ts for why that breaks individual grade page URLs).
  for (const grade of gradeSeedPt) {
    const existing = await prisma.grade.findFirst({ where: { locale: "pt-BR", slug: grade.slug } })
    const data = {
      locale: "pt-BR",
      slug: grade.slug,
      name: grade.name,
      ageRange: grade.ageRange,
      order: grade.order,
      defaultGridSize: grade.defaultGridSize,
      seoTitle: grade.seoTitle,
      metaDescription: grade.metaDescription,
      introText: grade.introText,
    }
    if (existing) {
      await prisma.grade.update({ where: { id: existing.id }, data })
    } else {
      await prisma.grade.create({ data })
    }
  }
  log(`  ✓ ${gradeSeedPt.length} grades (pt-BR)`)

  for (const difficulty of difficultySeedPt) {
    const existing = await prisma.difficulty.findFirst({
      where: { locale: "pt-BR", slug: difficulty.slug },
    })
    const data = { ...difficulty, directions: [...difficulty.directions] }
    if (existing) {
      await prisma.difficulty.update({ where: { id: existing.id }, data })
    } else {
      await prisma.difficulty.create({ data })
    }
  }
  log(`  ✓ ${difficultySeedPt.length} difficulties (pt-BR)`)

  const themeIdBySlugPt = new Map<string, string>()
  for (const theme of themeSeedPt) {
    const existing = await prisma.theme.findFirst({ where: { locale: "pt-BR", slug: theme.slug } })
    const data = {
      locale: "pt-BR",
      slug: theme.slug,
      name: theme.name,
      group: theme.group,
      isSeasonal: theme.isSeasonal,
      activeDateStart: theme.activeDateStart,
      activeDateEnd: theme.activeDateEnd,
      seoTitle: `Caça-Palavras de ${theme.name} — Grades Grátis para Imprimir`,
      metaDescription: `Descubra grades de caça-palavras sobre ${theme.name.toLowerCase()}, grátis, imprimíveis em PDF e jogáveis online.`,
      introText: `Uma seleção de caça-palavras sobre ${theme.name.toLowerCase()}, para imprimir ou jogar diretamente online.`,
    }
    const record = existing
      ? await prisma.theme.update({
          where: { id: existing.id },
          data: { name: theme.name, group: theme.group, isSeasonal: theme.isSeasonal },
        })
      : await prisma.theme.create({ data })
    themeIdBySlugPt.set(theme.slug, record.id)
  }
  log(`  ✓ ${themeSeedPt.length} themes (pt-BR)`)

  let wordCountPt = 0
  for (const theme of themeSeedPt) {
    const themeId = themeIdBySlugPt.get(theme.slug)
    if (!themeId) continue
    await prisma.themeWord.deleteMany({ where: { themeId } })
    const words = themeWordSeedPt.filter((w) => w.themeSlug === theme.slug)
    if (words.length > 0) {
      await prisma.themeWord.createMany({
        data: words.map((w) => ({
          themeId,
          word: w.word,
          length: w.length,
          minGradeOrder: w.minGradeOrder,
        })),
      })
      wordCountPt += words.length
    }
  }
  log(`  ✓ ${wordCountPt} theme words (pt-BR)`)
}

/** Categories only — cheap (no puzzle generation), safe as a single call. */
export async function seedCategoriesAll(
  prisma: PrismaClient,
  log: SeedLogger,
): Promise<Map<string, string>> {
  await seedPressBrands(prisma)
  log("  ✓ press brands")

  const categoryIdBySlug = await seedCategories(prisma, [
    ...CATEGORY_SEED_DEFINITIONS,
    ...PT_CATEGORY_SEED_DEFINITIONS,
  ])
  log(`  ✓ ${CATEGORY_SEED_DEFINITIONS.length} categories (fr)`)
  log(`  ✓ ${PT_CATEGORY_SEED_DEFINITIONS.length} categories (pt-BR)`)
  return categoryIdBySlug
}

/** Rebuilds the locale:slug → id map from what's already in the DB — used
 *  by puzzle-seeding steps that run as SEPARATE calls after categories
 *  were seeded in an earlier call (each API call is stateless). */
export async function loadCategoryIdBySlug(prisma: PrismaClient): Promise<Map<string, string>> {
  const categories = await prisma.category.findMany({ select: { id: true, locale: true, slug: true } })
  return new Map(categories.map((c) => [`${c.locale}:${c.slug}`, c.id]))
}

const themeNameBySlugFr = new Map(themeSeed.map((t) => [t.slug, t.name]))

/**
 * FR puzzle generation, batched via offset/limit — this is the slow part
 * (150 puzzles' worth of constraint-solving grid placement). Call this
 * repeatedly with increasing offsets until it reports fewer results than
 * `limit`, meaning you've reached the end of the plan.
 */
export async function seedPuzzlesFrBatch(
  prisma: PrismaClient,
  categoryIdBySlug: Map<string, string>,
  offset: number,
  limit: number,
  log: SeedLogger,
): Promise<{ processedInBatch: number; totalPlanned: number }> {
  const fullPlan = buildPuzzlePlan()
  const batch = fullPlan.slice(offset, offset + limit)
  if (batch.length === 0) {
    return { processedInBatch: 0, totalPlanned: fullPlan.length }
  }
  const result = await seedLocalizedPuzzles(prisma, "fr", batch, categoryIdBySlug, themeNameBySlugFr)
  log(`  ✓ fr puzzles ${offset}–${offset + batch.length} of ${fullPlan.length} (${result.linkCount} links)`)
  return { processedInBatch: batch.length, totalPlanned: fullPlan.length }
}

/**
 * The French-only "bonus" category links (press brands, static support
 * pages, audience hubs) that the original seedPuzzles() wrapper did after
 * generating all puzzles. Run this ONCE, after all FR puzzle batches are
 * done — it only reads already-created puzzles by slug, so it doesn't
 * need to run in the same call as generation.
 */
export async function seedPuzzlesFrBonusLinks(
  prisma: PrismaClient,
  categoryIdBySlug: Map<string, string>,
  log: SeedLogger,
): Promise<{ linkCount: number }> {
  const specs = buildPuzzlePlan()
  let linkCount = 0

  let pressIndex = 0
  for (const brand of MVP_PRESS_BRANDS) {
    const categoryId = categoryIdBySlug.get(`fr:${brand.slug}`)
    if (!categoryId) continue
    const pressPuzzles = specs
      .filter((spec) => spec.themeSlug === "animaux" || spec.themeSlug === "sport")
      .slice(pressIndex, pressIndex + 4)
    for (const spec of pressPuzzles) {
      const puzzle = await prisma.puzzle.findUnique({ where: { slug: spec.slug } })
      if (!puzzle) continue
      await prisma.categoryPuzzle.upsert({
        where: { categoryId_puzzleId: { categoryId, puzzleId: puzzle.id } },
        create: { categoryId, puzzleId: puzzle.id },
        update: {},
      })
      linkCount += 1
    }
    pressIndex += 2
  }

  const supportSlugs = [
    "pedagogie",
    "personnages",
    "application",
    "solutions",
    "jeux-magazines",
    "ressources-enseignants",
    "adultes",
    "seniors",
  ]
  const supportPuzzles = specs.slice(0, 6)
  for (const supportSlug of supportSlugs) {
    const categoryId = categoryIdBySlug.get(`fr:${supportSlug}`)
    if (!categoryId) continue
    for (const spec of supportPuzzles) {
      const puzzle = await prisma.puzzle.findUnique({ where: { slug: spec.slug } })
      if (!puzzle) continue
      await prisma.categoryPuzzle.upsert({
        where: { categoryId_puzzleId: { categoryId, puzzleId: puzzle.id } },
        create: { categoryId, puzzleId: puzzle.id },
        update: {},
      })
      linkCount += 1
    }
  }

  log(`  ✓ ${linkCount} bonus fr category–puzzle links (press/support/audience)`)
  return { linkCount }
}

/** PT puzzles — only 12 of them, small enough to run in a single call. */
export async function seedPuzzlesPtAll(
  prisma: PrismaClient,
  categoryIdBySlug: Map<string, string>,
  log: SeedLogger,
): Promise<{ puzzleCount: number; linkCount: number }> {
  const result = await seedPtPuzzles(prisma, categoryIdBySlug)
  log(`  ✓ ${result.puzzleCount} puzzles (pt-BR)`)
  log(`  ✓ ${result.linkCount} category–puzzle links (pt-BR)`)
  return result
}

/** NEW: PT grade-tagged puzzles — 18 of them (9 grades × 2 themes),
 *  also small enough for a single call. Run AFTER seedPuzzlesPtAll and
 *  AFTER category seeding (needs both theme and grade categories to
 *  already exist for the dual category-linking). */
export async function seedPuzzlesPtGradesAll(
  prisma: PrismaClient,
  categoryIdBySlug: Map<string, string>,
  log: SeedLogger,
): Promise<{ puzzleCount: number; linkCount: number }> {
  const result = await seedPtGradePuzzles(prisma, categoryIdBySlug)
  log(`  ✓ ${result.puzzleCount} grade puzzles (pt-BR)`)
  log(`  ✓ ${result.linkCount} grade category–puzzle links (pt-BR)`)
  return result
}

export function getFrPuzzlePlanLength(): number {
  return buildPuzzlePlan().length
}

export function getPtPuzzlePlanLength(): number {
  return buildPtPuzzlePlan().length
}
