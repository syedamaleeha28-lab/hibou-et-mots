/**
 * Audit puzzle hrefs shown on homepage + category resolvers.
 * Usage: npx tsx scripts/audit-puzzle-links.ts
 */
import { auditRenderedPuzzleLinks } from "@/lib/audit/puzzle-links"
import { prisma } from "@/lib/db/client"
import { getSeedPuzzlePlan } from "@/lib/db/adapters/puzzle-catalog"

async function main() {
  const seedSlugs = new Set(getSeedPuzzlePlan().map((s) => s.slug))
  let dbSlugs = new Set<string>()
  try {
    const rows = await prisma.puzzle.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    })
    dbSlugs = new Set(rows.map((r) => r.slug))
  } catch (error) {
    console.warn("DB unavailable:", error)
  }

  const { records, working, missingSeed, unresolved, categoriesWithUnresolved } =
    await auditRenderedPuzzleLinks()

  const uniqueSlugs = new Set(records.map((r) => r.slug))

  console.log("\n=== PUZZLE LINK AUDIT ===\n")
  console.log(`Total linked puzzles: ${records.length}`)
  console.log(`Unique slugs: ${uniqueSlugs.size}`)
  console.log(`Resolvable pages: ${working.length}`)
  console.log(`DB published puzzles: ${dbSlugs.size}`)
  console.log(`Seed catalog puzzles: ${seedSlugs.size}`)

  console.log("\n--- Working puzzle URLs ---")
  for (const r of working) {
    const dbFlag = dbSlugs.has(r.slug) ? "db" : "seed-mock"
    console.log(`  OK  ${r.slug}  <- ${r.source}  (${dbFlag})`)
  }

  console.log("\n--- Missing puzzle URLs (not in seed catalog) ---")
  for (const r of missingSeed) {
    console.log(`  BAD  ${r.slug}  <- ${r.source}`)
  }

  console.log("\n--- Unresolved puzzle pages ---")
  for (const r of unresolved) {
    console.log(`  404  ${r.slug}  <- ${r.source}  (seed=${r.inSeed})`)
  }

  console.log("\n--- Categories generating invalid slugs ---")
  if (categoriesWithUnresolved.size === 0) {
    console.log("  none")
  } else {
    for (const [cat, slugs] of categoriesWithUnresolved) {
      console.log(`  ${cat}: ${[...new Set(slugs)].join(", ")}`)
    }
  }

  await prisma.$disconnect()

  if (missingSeed.length > 0 || unresolved.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
