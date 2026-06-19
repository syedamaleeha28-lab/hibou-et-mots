import { PrismaClient } from "@prisma/client"
import { difficultySeed } from "./seed/difficulties"
import { gradeSeed } from "./seed/grades"
import { themeWordSeed } from "./seed/theme-words"
import { themeSeed } from "./seed/themes"
import {
  CATEGORY_SEED_DEFINITIONS,
  clearContentSeed,
  seedCategories,
  seedPressBrands,
} from "./seed/categories"
import { buildPuzzlePlan, seedPuzzles } from "./seed/puzzles"
import { buildOfflineCoverageSummary, buildSeedCoverageReport } from "./seed/report"

const prisma = new PrismaClient()

async function seedReferenceData() {
  console.log("Seeding reference data…")

  for (const grade of gradeSeed) {
    await prisma.grade.upsert({
      where: { slug: grade.slug },
      create: grade,
      update: {
        name: grade.name,
        ageRange: grade.ageRange,
        order: grade.order,
        defaultGridSize: grade.defaultGridSize,
        seoTitle: grade.seoTitle,
        metaDescription: grade.metaDescription,
        introText: grade.introText,
      },
    })
  }
  console.log(`  ✓ ${gradeSeed.length} grades`)

  for (const difficulty of difficultySeed) {
    await prisma.difficulty.upsert({
      where: { slug: difficulty.slug },
      create: difficulty,
      update: {
        name: difficulty.name,
        gridSizeMin: difficulty.gridSizeMin,
        gridSizeMax: difficulty.gridSizeMax,
        wordCountMin: difficulty.wordCountMin,
        wordCountMax: difficulty.wordCountMax,
        directions: [...difficulty.directions],
      },
    })
  }
  console.log(`  ✓ ${difficultySeed.length} difficulties`)

  const themeIdBySlug = new Map<string, string>()

  for (const theme of themeSeed) {
    const record = await prisma.theme.upsert({
      where: { slug: theme.slug },
      create: {
        slug: theme.slug,
        name: theme.name,
        group: theme.group,
        isSeasonal: theme.isSeasonal,
        activeDateStart: theme.activeDateStart,
        activeDateEnd: theme.activeDateEnd,
        seoTitle: `Mots Mêlés ${theme.name} — Grilles Gratuites à Imprimer`,
        metaDescription: `Découvrez des grilles de mots mêlés sur le thème ${theme.name}, gratuites, imprimables en PDF et jouables en ligne.`,
        introText: `Une sélection de mots mêlés sur le thème ${theme.name}, à imprimer ou à jouer directement en ligne.`,
      },
      update: {
        name: theme.name,
        group: theme.group,
        isSeasonal: theme.isSeasonal,
        activeDateStart: theme.activeDateStart,
        activeDateEnd: theme.activeDateEnd,
      },
    })
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

async function seedContentData() {
  const offline = buildOfflineCoverageSummary()
  console.log("Seeding MVP content…")
  console.log(
    `  · plan: ${offline.plannedCategories} categories, ${offline.plannedPuzzles} puzzles, ${offline.plannedUrls} URLs`,
  )

  if (process.env.SEED_RESET_CONTENT === "1") {
    console.log("  · resetting existing content (categories, puzzles, links)")
    await clearContentSeed(prisma)
  }

  await seedPressBrands(prisma)
  console.log(`  ✓ press brands`)

  const categoryIdBySlug = await seedCategories(prisma)
  console.log(`  ✓ ${CATEGORY_SEED_DEFINITIONS.length} categories`)

  const { puzzleCount, linkCount } = await seedPuzzles(prisma, categoryIdBySlug)
  console.log(`  ✓ ${puzzleCount} puzzles (${buildPuzzlePlan().length} planned)`)
  console.log(`  ✓ ${linkCount} category–puzzle links`)

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
