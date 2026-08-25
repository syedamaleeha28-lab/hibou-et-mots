import { PrismaClient } from "@prisma/client"
import { clearContentSeed } from "./seed/categories"
import {
  getFrPuzzlePlanLength,
  seedCategoriesAll,
  seedPuzzlesFrBatch,
  seedPuzzlesFrBonusLinks,
  seedPuzzlesPtAll,
  seedPuzzlesPtGradesAll,
  seedReferenceDataAll,
} from "./seed/run-all"
import { buildOfflineCoverageSummary, buildSeedCoverageReport } from "./seed/report"

const prisma = new PrismaClient()

// Local CLI run has no serverless time limit, so it's safe to run the
// whole FR puzzle plan in one batch here (unlike the production API
// route, which chunks this — see app/api/admin/seed/route.ts).
const LOCAL_BATCH_SIZE = 10_000

async function main() {
  await seedReferenceDataAll(prisma, console.log)

  const offline = buildOfflineCoverageSummary()
  console.log("Seeding MVP content…")
  console.log(
    `  · plan: ${offline.plannedCategories} categories, ${offline.plannedPuzzles} puzzles, ${offline.plannedUrls} URLs`,
  )

  if (process.env.SEED_RESET_CONTENT === "1") {
    console.log("  · resetting existing content (categories, puzzles, links)")
    await clearContentSeed(prisma)
  }

  const categoryIdBySlug = await seedCategoriesAll(prisma, console.log)

  await seedPuzzlesFrBatch(prisma, categoryIdBySlug, 0, LOCAL_BATCH_SIZE, console.log)
  await seedPuzzlesFrBonusLinks(prisma, categoryIdBySlug, console.log)
  await seedPuzzlesPtAll(prisma, categoryIdBySlug, console.log)
  await seedPuzzlesPtGradesAll(prisma, categoryIdBySlug, console.log)

  console.log(`  ✓ fr puzzles (${getFrPuzzlePlanLength()} planned)`)

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
