import { PrismaClient } from "@prisma/client"
import { difficultySeed } from "./seed/difficulties"
import { gradeSeed } from "./seed/grades"
import { themeWordSeed } from "./seed/theme-words"
import { themeSeed } from "./seed/themes"
import { difficultySeedPt } from "./seed/difficulties.pt"
import { themeSeedPt } from "./seed/themes.pt"
import { themeWordSeedPt } from "./seed/theme-words.pt"
import {
  CATEGORY_SEED_DEFINITIONS,
  clearContentSeed,
  seedCategories,
  seedPressBrands,
} from "./seed/categories"
import { PT_CATEGORY_SEED_DEFINITIONS } from "./seed/categories.pt"
import { buildPuzzlePlan, seedPuzzles } from "./seed/puzzles"
import { seedPtPuzzles } from "./seed/puzzles.pt"
import { buildOfflineCoverageSummary, buildSeedCoverageReport } from "./seed/report"

const prisma = new PrismaClient()

/**
 * PT-BR pack: all four upserts below changed from `where: { slug }` to
 * `findFirst({ where: { locale, slug } })` + branch. This is REQUIRED for
 * French rows too, not just Portuguese — `slug` alone stopped being a
 * unique field the moment the locale migration ran
 * (`@@unique([locale, slug])`). The old `where: { slug: ... }` upserts
 * would fail to type-check / fail at runtime against the new schema.
 */
async function seedReferenceData() {
  console.log("Seeding reference data (fr)…")

  for (const grade of gradeSeed) {
    const existing = await prisma.grade.findFirst({ where: { locale: "fr", slug: grade.slug } })
    // gradeSeed carries `h1` for category pages; Grade model has no h1 column.
    // Explicit fields avoid a TS destructuring quirk on the gradeSeed const union.
    const data = {
      slug: grade.slug,
      name: grade.name,
      ageRange: grade.ageRange,
      order: grade.order,
      defaultGridSize: grade.defaultGridSize,
      seoTitle: grade.seoTitle,
      metaDescription: grade.metaDescription,
      introText: grade.introText,
      locale: "fr",
    }
    if (existing) {
      await prisma.grade.update({ where: { id: existing.id }, data })
    } else {
      await prisma.grade.create({ data })
    }
  }
  console.log(`  ✓ ${gradeSeed.length} grades`)

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
  console.log(`  ✓ ${difficultySeed.length} difficulties`)

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
  console.log(`  ✓ ${themeSeed.length} themes`)

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
  console.log(`  ✓ ${wordCount} theme words`)
}

/**
 * PT-BR pack: mirrors seedReferenceData() above, but for the v1 scope
 * only (2 themes, 3 difficulty levels — no grades yet).
 */
async function seedReferenceDataPt() {
  console.log("Seeding reference data (pt-BR)…")

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
  console.log(`  ✓ ${difficultySeedPt.length} difficulties (pt-BR)`)

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
          data: {
            name: theme.name,
            group: theme.group,
            isSeasonal: theme.isSeasonal,
          },
        })
      : await prisma.theme.create({ data })
    themeIdBySlugPt.set(theme.slug, record.id)
  }
  console.log(`  ✓ ${themeSeedPt.length} themes (pt-BR)`)

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
  console.log(`  ✓ ${wordCountPt} theme words (pt-BR)`)
}

async function seedContentData() {
  const offline = buildOfflineCoverageSummary()
  console.log("Seeding MVP content (fr)…")
  console.log(
    `  · plan: ${offline.plannedCategories} categories, ${offline.plannedPuzzles} puzzles, ${offline.plannedUrls} URLs`,
  )

  if (process.env.SEED_RESET_CONTENT === "1") {
    console.log("  · resetting existing content (categories, puzzles, links)")
    await clearContentSeed(prisma)
  }

  await seedPressBrands(prisma)
  console.log(`  ✓ press brands`)

  // PT-BR pack: seed BOTH locales' categories in one pass so the
  // returned map has composite "locale:slug" keys for every category
  // that puzzle-linking needs, regardless of locale.
  const categoryIdBySlug = await seedCategories(prisma, [
    ...CATEGORY_SEED_DEFINITIONS,
    ...PT_CATEGORY_SEED_DEFINITIONS,
  ])
  console.log(`  ✓ ${CATEGORY_SEED_DEFINITIONS.length} categories (fr)`)
  console.log(`  ✓ ${PT_CATEGORY_SEED_DEFINITIONS.length} categories (pt-BR)`)

  const { puzzleCount, linkCount } = await seedPuzzles(prisma, categoryIdBySlug)
  console.log(`  ✓ ${puzzleCount} puzzles (fr) (${buildPuzzlePlan().length} planned)`)
  console.log(`  ✓ ${linkCount} category–puzzle links (fr)`)

  const ptResult = await seedPtPuzzles(prisma, categoryIdBySlug)
  console.log(`  ✓ ${ptResult.puzzleCount} puzzles (pt-BR)`)
  console.log(`  ✓ ${ptResult.linkCount} category–puzzle links (pt-BR)`)

  try {
    const report = await buildSeedCoverageReport(prisma)
    console.log("Content seed report:")
    console.log(`  · categories: ${report.categoryCount}`)
    console.log(`  · puzzles: ${report.puzzleCount}`)
    console.log(`  · indexable categories: ${report.indexableCategoryUrls}`)
    console.log(`  · puzzle URLs: ${report.puzzleUrls}`)
    console.log(`  · total URLs: ${report.totalGeneratedUrls}`)
    console.log(`  · MVP clusters: ${report.mvpClustersCovered}/${report.mvpClustersTotal}`)
    console.log(`  · categories below threshold: ${report.indexableCategoriesBelowThreshold}`)
  } catch (error) {
    console.warn("  · coverage report skipped:", error instanceof Error ? error.message : error)
  }
}

async function main() {
  await seedReferenceData()
  await seedReferenceDataPt()
  await seedContentData()
  console.log("Seed complete.")
}

main()
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
