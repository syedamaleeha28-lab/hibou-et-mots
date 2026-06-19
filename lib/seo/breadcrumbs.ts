import { absoluteUrl } from "./routes"

export type BreadcrumbItem = {
  label: string
  href: string
}

export type BreadcrumbListSchema = {
  "@context": "https://schema.org"
  "@type": "BreadcrumbList"
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    name: string
    item?: string
  }>
}

export function buildBreadcrumbListSchema(
  items: BreadcrumbItem[],
  siteUrl?: string,
): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href, siteUrl),
    })),
  }
}

/** Always start with Accueil — PRD §19 */
export function withHome(items: BreadcrumbItem[]): BreadcrumbItem[] {
  if (items[0]?.href === "/") return items
  return [{ label: "Accueil", href: "/" }, ...items]
}

export const SILO_LABELS = {
  ecole: "École",
  fetes: "Fêtes & Saisons",
  thematiques: "Thématiques",
  difficulte: "Difficulté",
  public: "Par Public",
  presse: "Presse & Marques",
  hub: "Mots Mêlés",
} as const
