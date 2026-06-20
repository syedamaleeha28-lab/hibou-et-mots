/**
 * Audit puzzle hrefs shown on homepage + category resolvers vs DB / seed catalog.
 * Usage: npx tsx scripts/audit-puzzle-links.ts
 */
import { popularPuzzles } from "@/lib/content"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import { getSeedPuzzlePlan, isKnownSeedPuzzleSlug } from "@/lib/db/adapters/puzzle-catalog"
import { popularPuzzleHref } from "@/lib/home/popular-puzzle-links"
import { prisma } from "@/lib/db/client"
import {
  resolveAudienceCategoryPageData,
  resolveEcoleHubPageData,
  resolveGradeCategoryPageData,
  resolveHubCategoryPageData,
  resolveSeasonalCategoryPageData,
  resolveThemeCategoryPageData,
} from "@/lib/db/queries/category-resolvers"
import { MVP_SEASONAL_THEME_SLUGS } from "@/lib/db/adapters/category-constants"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"

type LinkRecord = {
  source: string
  href: string
  slug: string
  inSeed: boolean
  inDb: boolean
}

function slugFromHref(href: string): string {
  const match = href.match(/\/mots-meles\/([^/]+)\/?$/)
  return match?.[1] ?? ""
}

async function collectCategoryLinks(
  source: string,
  loader: () => Promise<{ puzzles: { items: { href: string; slug: string }[] } } | null>,
): Promise<LinkRecord[]> {
  const page = await loader()
  if (!page) return []
  return page.puzzles.items.map((item) => ({
    source,
    href: item.href,
    slug: item.slug,
    inSeed: false,
    inDb: false,
  }))
}

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

  const records: LinkRecord[] = []

  for (const puzzle of popularPuzzles) {
    const href = popularPuzzleHref(puzzle.title)
    const slug = slugFromHref(href)
    records.push({
      source: `homepage:popular:${puzzle.title}`,
      href,
      slug,
      inSeed: seedSlugs.has(slug),
      inDb: dbSlugs.has(slug),
    })
  }

  const hubSlugs = Object.values(HUB_CATEGORY_SLUGS)
  for (const hub of hubSlugs) {
    records.push(
      ...(await collectCategoryLinks(`hub:${hub}`, () => resolveHubCategoryPageData(hub, 1))),
    )
  }

  records.push(
    ...(await collectCategoryLinks("hub:ecole-resolver", () => resolveEcoleHubPageData(1))),
  )

  for (const grade of gradeSeed) {
    records.push(
      ...(await collectCategoryLinks(`grade:${grade.slug}`, () =>
        resolveGradeCategoryPageData(grade.slug, 1),
      )),
    )
  }

  for (const theme of themeSeed.filter((t) => t.isSeasonal)) {
    records.push(
      ...(await collectCategoryLinks(`seasonal:${theme.slug}`, () =>
        resolveSeasonalCategoryPageData(theme.slug, 1),
      )),
    )
  }

  for (const theme of themeSeed.filter((t) => !t.isSeasonal).slice(0, 6)) {
    records.push(
      ...(await collectCategoryLinks(`theme:${theme.slug}`, () =>
        resolveThemeCategoryPageData(theme.slug, 1),
      )),
    )
  }

  records.push(
    ...(await collectCategoryLinks("audience:enfants", () =>
      resolveAudienceCategoryPageData("enfants", 1),
    )),
  )

  for (const record of records) {
    record.inSeed = isKnownSeedPuzzleSlug(record.slug)
    record.inDb = dbSlugs.has(record.slug)
  }

  const unique = new Map<string, LinkRecord>()
  for (const r of records) {
    unique.set(`${r.source}|${r.slug}`, r)
  }
  const all = [...unique.values()]

  const working = all.filter((r) => r.inDb || (r.inSeed && dbSlugs.size === 0))
  const missingDb = all.filter((r) => dbSlugs.size > 0 && !r.inDb)
  const brokenSlugs = all.filter((r) => !r.inSeed)
  const categoriesWith404s = new Map<string, string[]>()

  for (const r of missingDb) {
    const cat = r.source.split(":")[0] + (r.source.includes(":") ? ":" + r.source.split(":")[1] : "")
    const list = categoriesWith404s.get(cat) ?? []
    list.push(r.slug)
    categoriesWith404s.set(cat, list)
  }

  console.log("\n=== PUZZLE LINK AUDIT ===\n")
  console.log(`Total linked puzzles: ${all.length}`)
  console.log(`Unique slugs: ${new Set(all.map((r) => r.slug)).size}`)
  console.log(`DB published puzzles: ${dbSlugs.size}`)
  console.log(`Seed catalog puzzles: ${seedSlugs.size}`)

  console.log("\n--- Working (in DB) ---")
  for (const r of working.filter((x) => x.inDb)) {
    console.log(`  OK  ${r.slug}  <- ${r.source}`)
  }

  console.log("\n--- Missing in DB (linked but no record) ---")
  for (const r of missingDb) {
    console.log(`  MISS ${r.slug}  <- ${r.source}  (seed=${r.inSeed})`)
  }

  console.log("\n--- Broken slugs (not in seed catalog) ---")
  for (const r of brokenSlugs) {
    console.log(`  BAD  ${r.slug}  <- ${r.source}  (db=${r.inDb})`)
  }

  console.log("\n--- Categories pointing to missing puzzles ---")
  for (const [cat, slugs] of categoriesWith404s) {
    console.log(`  ${cat}: ${[...new Set(slugs)].join(", ")}`)
  }

  await prisma.$disconnect()

  if (missingDb.length > 0 || brokenSlugs.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
