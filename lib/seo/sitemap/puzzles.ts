import { prisma } from "@/lib/db/client"
import { absoluteUrl, resolvePuzzlePath } from "@/lib/seo/routes"
import type { SitemapUrlEntry } from "./types"
import { pilotPuzzleSitemapEntries } from "./pilot-entries"
import { PUZZLE_SITEMAP_PRIORITY } from "./priority"
import { SITEMAP_PUZZLE_BATCH_SIZE } from "./types"

export async function getPublishedPuzzleCount(): Promise<number> {
  try {
    return await prisma.puzzle.count({ where: { status: "PUBLISHED" } })
  } catch {
    return 0
  }
}

export async function getPuzzleSitemapBatchCount(): Promise<number> {
  const total = await getPublishedPuzzleCount()
  if (total === 0) return 1
  return Math.ceil(total / SITEMAP_PUZZLE_BATCH_SIZE)
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
    // DB unavailable — fall back to pilot entries on page 0.
  }

  if (page === 0) {
    return pilotPuzzleSitemapEntries(base.replace(/\/$/, ""))
  }

  return []
}

export function puzzleSitemapSegmentPath(page: number): string {
  return `/sitemaps/sitemap-puzzles/${page}/`
}
