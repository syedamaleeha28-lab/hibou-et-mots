import { absoluteUrl } from "@/lib/seo/routes"
import type { PuzzleCardData } from "@/lib/db/types/page-data"
import type { ItemListSchema } from "./types"

export function buildItemListSchema(
  name: string,
  puzzles: PuzzleCardData[],
  siteUrl?: string,
): ItemListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: puzzles.length,
    itemListElement: puzzles.map((puzzle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(puzzle.href, siteUrl),
      name: puzzle.title,
    })),
  }
}
