import { popularPuzzles } from "@/lib/content"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import { isKnownSeedPuzzleSlug } from "@/lib/db/adapters/puzzle-catalog"
import { popularPuzzleHref } from "@/lib/home/popular-puzzle-links"
import {
  resolveAudienceCategoryPageData,
  resolveEcoleHubPageData,
  resolveGradeCategoryPageData,
  resolveHubCategoryPageData,
  resolveSeasonalCategoryPageData,
  resolveThemeCategoryPageData,
} from "@/lib/db/queries/category-resolvers"
import { resolvePuzzlePageData } from "@/lib/db/queries/pilot"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"

export type PuzzleLinkRecord = {
  source: string
  href: string
  slug: string
  inSeed: boolean
  resolves: boolean
}

export function slugFromPuzzleHref(href: string): string {
  const match = href.match(/\/mots-meles\/([^/]+)\/?$/)
  return match?.[1] ?? ""
}

async function collectCategoryLinks(
  source: string,
  loader: () => Promise<{ puzzles: { items: { href: string; slug: string }[] } } | null>,
): Promise<PuzzleLinkRecord[]> {
  const page = await loader()
  if (!page) return []
  return page.puzzles.items.map((item) => ({
    source,
    href: item.href,
    slug: item.slug,
    inSeed: false,
    resolves: false,
  }))
}

/** All puzzle hrefs rendered by homepage cards, category grids, and related listings. */
export async function collectRenderedPuzzleLinks(): Promise<PuzzleLinkRecord[]> {
  const records: PuzzleLinkRecord[] = []

  for (const puzzle of popularPuzzles) {
    const href = popularPuzzleHref(puzzle.title)
    const slug = slugFromPuzzleHref(href)
    records.push({
      source: `homepage:popular:${puzzle.title}`,
      href,
      slug,
      inSeed: false,
      resolves: false,
    })
  }

  for (const hub of Object.values(HUB_CATEGORY_SLUGS)) {
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

  for (const theme of themeSeed.filter((t) => !t.isSeasonal)) {
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
    record.resolves = !!(await resolvePuzzlePageData(record.slug))
  }

  const relatedRecords: PuzzleLinkRecord[] = []
  const seenRelated = new Set(records.map((r) => r.slug))

  for (const record of records) {
    const page = await resolvePuzzlePageData(record.slug)
    if (!page) continue
    for (const related of page.relatedPuzzles) {
      if (seenRelated.has(related.slug)) continue
      seenRelated.add(related.slug)
      relatedRecords.push({
        source: `related:${record.slug}`,
        href: related.href,
        slug: related.slug,
        inSeed: isKnownSeedPuzzleSlug(related.slug),
        resolves: !!(await resolvePuzzlePageData(related.slug)),
      })
    }
  }

  records.push(...relatedRecords)

  return records
}

export async function auditRenderedPuzzleLinks(): Promise<{
  records: PuzzleLinkRecord[]
  working: PuzzleLinkRecord[]
  missingSeed: PuzzleLinkRecord[]
  unresolved: PuzzleLinkRecord[]
  categoriesWithUnresolved: Map<string, string[]>
}> {
  const records = await collectRenderedPuzzleLinks()
  const working = records.filter((r) => r.resolves)
  const missingSeed = records.filter((r) => !r.inSeed)
  const unresolved = records.filter((r) => !r.resolves)

  const categoriesWithUnresolved = new Map<string, string[]>()
  for (const record of unresolved) {
    const key = record.source.split(":").slice(0, 2).join(":")
    const list = categoriesWithUnresolved.get(key) ?? []
    list.push(record.slug)
    categoriesWithUnresolved.set(key, list)
  }

  return { records, working, missingSeed, unresolved, categoriesWithUnresolved }
}
