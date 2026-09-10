import { absoluteUrl } from "@/lib/seo/routes"
import type { PuzzleCardData } from "@/lib/db/types/page-data"
import type { ItemListSchema } from "./types"

export function buildItemListSchema(
  name: string,
  puzzles: PuzzleCardData[],
  siteUrl?: string,
  numberOfItems = puzzles.length,
): ItemListSchema {
  return buildLinksItemListSchema(
    name,
    puzzles.map((puzzle) => ({ name: puzzle.title, href: puzzle.href })),
    siteUrl,
    numberOfItems,
  )
}

export function buildLinksItemListSchema(
  name: string,
  items: Array<{ name: string; href: string }>,
  siteUrl?: string,
  numberOfItems = items.length,
): ItemListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.href, siteUrl),
      name: item.name,
    })),
  }
}
