import { prisma } from "@/lib/db/client"
import { absoluteUrl, DEFAULT_SITE_URL, resolveCategoryPath, resolvePuzzlePath } from "@/lib/seo/routes"
import { getCategoryIllustrations } from "@/lib/images/page-illustrations"
import type { CategoryType } from "@/lib/db/types/page-data"
import type { SitemapImageEntry } from "./types"

async function getPuzzleThumbnailEntries(base: string): Promise<SitemapImageEntry[]> {
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
}

/** Category page hero + preview illustrations — same mapping as the live pages use. */
async function getCategoryIllustrationEntries(base: string): Promise<SitemapImageEntry[]> {
  const categories = await prisma.category.findMany({
    where: { status: "PUBLISHED" },
    include: { grade: true, theme: true, difficulty: true, pressBrand: true },
  })

  const entries: SitemapImageEntry[] = []
  for (const category of categories) {
    const canonicalPath = resolveCategoryPath({
      type: category.type as CategoryType,
      slug: category.slug,
      grade: category.grade ?? undefined,
      theme: category.theme ?? undefined,
      difficulty: category.difficulty ?? undefined,
    })
    const pageUrl = absoluteUrl(canonicalPath, base)
    const { hero, preview } = getCategoryIllustrations({ canonicalPath, h1: category.h1 })

    entries.push({
      loc: pageUrl,
      imageLoc: absoluteUrl(hero.src, base),
      title: hero.title ?? category.h1,
      caption: hero.caption ?? category.h1,
    })
    entries.push({
      loc: pageUrl,
      imageLoc: absoluteUrl(preview.src, base),
      title: preview.title ?? category.h1,
      caption: preview.caption ?? category.h1,
    })
  }
  return entries
}

export async function getImageSitemapEntries(siteUrl?: string): Promise<SitemapImageEntry[]> {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL

  try {
    const [puzzleEntries, categoryEntries] = await Promise.all([
      getPuzzleThumbnailEntries(base),
      getCategoryIllustrationEntries(base),
    ])
    return [...puzzleEntries, ...categoryEntries]
  } catch {
    return []
  }
}
