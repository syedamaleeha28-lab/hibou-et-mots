import { prisma } from "@/lib/db/client"
import { absoluteUrl, resolvePuzzlePath } from "@/lib/seo/routes"
import type { SitemapUrlEntry } from "./types"
import { seedPublishedPuzzleCount } from "./pilot-entries"
import { seedPuzzleSitemapEntries } from "./seed-entries"
import { PUZZLE_SITEMAP_PRIORITY } from "./priority"
import { SITEMAP_PUZZLE_BATCH_SIZE } from "./types"

export async function getPublishedPuzzleCount(): Promise<number> {
  try {
    const total = await prisma.puzzle.count({ where: { status: "PUBLISHED" } })
    if (total > 0) return total
  } catch {
    // DB unavailable — fall back to seed catalog below.
  }
  return seedPublishedPuzzleCount()
}

export async function getPuzzleSitemapBatchCount(): Promise<number> {
  const total = await getPublishedPuzzleCount()
  return Math.max(1, Math.ceil(total / SITEMAP_PUZZLE_BATCH_SIZE))
}

export async function getPuzzleSitemapEntries(
  page: number,
  siteUrl?: string,
): Promise<SitemapUrlEntry[]> {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://hibou-et-mots.fr"
  const skip = page * SITEMAP_PUZZLE_BATCH_SIZE

  try {
    const puzzles = await prisma.puzzle.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      skip,
      take: SITEMAP_PUZZLE_BATCH_SIZE,
    })

    if (puzzles.length > 0) {
      return puzzles.map((puzzle) => ({
        loc: absoluteUrl(resolvePuzzlePath(puzzle.slug), base),
        lastModified: puzzle.updatedAt,
        changeFrequency: "weekly" as const,
        priority: PUZZLE_SITEMAP_PRIORITY,
      }))
    }
  } catch {
    // DB unavailable — fall back to seed catalog below.
  }

  return seedPuzzleSitemapEntries(base.replace(/\/$/, ""), page)
}

export function puzzleSitemapSegmentPath(page: number): string {
  return `/sitemaps/sitemap-puzzles/${page}/`
}
