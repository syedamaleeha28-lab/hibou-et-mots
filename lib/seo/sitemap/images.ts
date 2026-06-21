import { prisma } from "@/lib/db/client"
import { absoluteUrl, DEFAULT_SITE_URL, resolvePuzzlePath } from "@/lib/seo/routes"
import type { SitemapImageEntry } from "./types"

export async function getImageSitemapEntries(siteUrl?: string): Promise<SitemapImageEntry[]> {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL

  try {
    const puzzles = await prisma.puzzle.findMany({
      where: {
        status: "PUBLISHED",
        thumbnailUrl: { not: null },
      },
      select: {
        slug: true,
        title: true,
        thumbnailUrl: true,
      },
    })

    return puzzles
      .filter((puzzle): puzzle is typeof puzzle & { thumbnailUrl: string } => !!puzzle.thumbnailUrl)
      .map((puzzle) => ({
        loc: absoluteUrl(resolvePuzzlePath(puzzle.slug), base),
        imageLoc: puzzle.thumbnailUrl.startsWith("http")
          ? puzzle.thumbnailUrl
          : absoluteUrl(puzzle.thumbnailUrl, base),
        title: puzzle.title,
        caption: `Vignette — ${puzzle.title}`,
      }))
  } catch {
    return []
  }
}
