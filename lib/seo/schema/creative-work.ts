import { absoluteUrl } from "@/lib/seo/routes"
import type { PuzzlePageData } from "@/lib/db/types/page-data"
import type { CreativeWorkSchema } from "./types"

export function buildCreativeWorkSchema(
  puzzle: Pick<
    PuzzlePageData,
    "title" | "canonicalPath" | "metaDescription" | "theme" | "grade" | "difficulty"
  >,
  siteUrl?: string,
): CreativeWorkSchema {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: puzzle.title,
    description: puzzle.metaDescription,
    url: absoluteUrl(puzzle.canonicalPath, siteUrl),
    inLanguage: "fr-FR",
    genre: puzzle.theme?.name,
    educationalLevel: puzzle.grade?.name,
  }
}
