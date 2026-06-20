import { absoluteUrl } from "@/lib/seo/routes"
import type { PuzzlePageData } from "@/lib/db/types/page-data"
import type { CreativeWorkSchema } from "./types"

const CHILD_GRADE_SLUGS = new Set([
  "maternelle",
  "cp",
  "ce1",
  "ce2",
  "cm1",
  "cm2",
  "6e",
])

export function isChildOrientedPuzzle(
  puzzle: Pick<PuzzlePageData, "grade"> & {
    parentCategorySlugs?: string[]
  },
): boolean {
  if (puzzle.grade?.slug && CHILD_GRADE_SLUGS.has(puzzle.grade.slug)) {
    return true
  }
  return puzzle.parentCategorySlugs?.includes("enfants") ?? false
}

export function buildCreativeWorkSchema(
  puzzle: Pick<
    PuzzlePageData,
    "title" | "canonicalPath" | "metaDescription" | "theme" | "grade" | "difficulty"
  >,
  siteUrl?: string,
  thumbnailUrl?: string,
  options?: { parentCategorySlugs?: string[] },
): CreativeWorkSchema {
  const childOriented = isChildOrientedPuzzle({
    grade: puzzle.grade,
    parentCategorySlugs: options?.parentCategorySlugs,
  })

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: puzzle.title,
    description: puzzle.metaDescription,
    url: absoluteUrl(puzzle.canonicalPath, siteUrl),
    inLanguage: "fr-FR",
    learningResourceType: "puzzle",
    isAccessibleForFree: true,
    genre: puzzle.theme?.name,
    educationalLevel: puzzle.grade?.name,
    ...(childOriented
      ? {
          audience: {
            "@type": "Audience",
            audienceType: "enfants",
          },
        }
      : {}),
    ...(thumbnailUrl
      ? {
          image: thumbnailUrl.startsWith("http")
            ? thumbnailUrl
            : absoluteUrl(thumbnailUrl, siteUrl),
        }
      : {}),
  }
}
