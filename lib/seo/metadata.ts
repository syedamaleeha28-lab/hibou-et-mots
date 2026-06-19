import type { Metadata } from "next"
import type { CategoryPageData, PuzzlePageData } from "@/lib/db/types/page-data"
import { absoluteUrl } from "./routes"
import { robotsDirective, robotsMetaContent } from "./indexability"

const SITE_NAME = "Hibou&Mots"

export function buildCategoryMetadata(
  category: CategoryPageData,
  page = 1,
  siteUrl?: string,
): Metadata {
  const robots = robotsDirective({
    pageType: "category",
    isIndexable: category.isIndexable,
    page,
  })

  const title =
    page > 1
      ? `${category.seoTitle} — Page ${page}`
      : category.seoTitle

  const canonical = page > 1
    ? `${category.canonicalPath}?page=${page}`
    : category.canonicalPath

  return {
    title,
    description: category.metaDescription,
    alternates: {
      canonical: absoluteUrl(canonical, siteUrl),
    },
    robots: robotsMetaContent(robots),
    openGraph: {
      title,
      description: category.metaDescription,
      url: absoluteUrl(canonical, siteUrl),
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "website",
    },
  }
}

export function buildPuzzleMetadata(
  puzzle: PuzzlePageData,
  siteUrl?: string,
): Metadata {
  const title = puzzle.metaTitle ?? puzzle.title
  const description =
    puzzle.metaDescription ??
    `Jouez et imprimez ce mots mêlés gratuit : ${puzzle.title}. Grille ${puzzle.size}×${puzzle.size}, difficulté ${puzzle.difficulty.name}.`

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(puzzle.canonicalPath, siteUrl),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(puzzle.canonicalPath, siteUrl),
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "article",
    },
  }
}
