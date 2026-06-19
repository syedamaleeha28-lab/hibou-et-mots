import { absoluteUrl, ROUTES, gradePath } from "./routes"
import type { CategoryType, CategorySummary } from "@/lib/db/types/page-data"

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

type CategoryBreadcrumbInput = {
  type: CategoryType
  h1: string
  canonicalPath: string
  grade?: { slug: string; name: string }
  theme?: { slug: string; name: string; isSeasonal?: boolean }
  difficulty?: { slug: string; name: string }
  pressBrand?: { slug: string; name: string }
}

export type BreadcrumbContext =
  | { pageType: "home" }
  | { pageType: "category"; category: CategoryBreadcrumbInput }
  | {
      pageType: "puzzle"
      puzzle: { title: string; canonicalPath: string }
      parentCategories?: CategorySummary[]
    }

function siloForCategoryType(type: CategoryType): { label: string; href: string } | null {
  switch (type) {
    case "GRADE":
    case "COMBO":
      return { label: SILO_LABELS.ecole, href: ROUTES.ecoleHub }
    case "THEME":
      return { label: SILO_LABELS.thematiques, href: ROUTES.thematiquesHub }
    case "SEASONAL":
      return { label: SILO_LABELS.fetes, href: ROUTES.fetesHub }
    case "DIFFICULTY":
      return { label: SILO_LABELS.difficulte, href: ROUTES.difficulteHub }
    case "PRESS_BRAND":
      return { label: SILO_LABELS.presse, href: ROUTES.presseHub }
    case "AUDIENCE":
      return null
    default:
      return null
  }
}

export function buildCategoryBreadcrumbs(category: CategoryBreadcrumbInput): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: "Accueil", href: "/" }]
  const silo = siloForCategoryType(category.type)

  if (category.type === "AUDIENCE") {
    items.push({ label: category.h1, href: category.canonicalPath })
    return items
  }

  if (silo) items.push(silo)

  if (category.type === "COMBO" && category.grade) {
    items.push({
      label: category.grade.name,
      href: gradePath(category.grade.slug),
    })
    if (category.theme) {
      items.push({ label: category.theme.name, href: category.canonicalPath })
    }
    return items
  }

  if (category.type === "GRADE" && category.grade) {
    items.push({ label: category.grade.name, href: category.canonicalPath })
    return items
  }

  if ((category.type === "THEME" || category.type === "SEASONAL") && category.theme) {
    items.push({ label: category.theme.name, href: category.canonicalPath })
    return items
  }

  if (category.type === "DIFFICULTY" && category.difficulty) {
    items.push({ label: category.difficulty.name, href: category.canonicalPath })
    return items
  }

  if (category.type === "PRESS_BRAND" && category.pressBrand) {
    items.push({ label: category.pressBrand.name, href: category.canonicalPath })
    return items
  }

  items.push({ label: category.h1, href: category.canonicalPath })
  return items
}

export function buildPuzzleBreadcrumbs(
  puzzle: { title: string; canonicalPath: string },
  parentCategories: CategorySummary[] = [],
): BreadcrumbItem[] {
  const grade = parentCategories.find((c) => c.type === "GRADE")
  const theme = parentCategories.find(
    (c) => c.type === "THEME" || c.type === "SEASONAL",
  )
  const combo = parentCategories.find((c) => c.type === "COMBO")
  const difficulty = parentCategories.find((c) => c.type === "DIFFICULTY")
  const audience = parentCategories.find((c) => c.type === "AUDIENCE")
  const press = parentCategories.find((c) => c.type === "PRESS_BRAND")

  if (combo && grade && theme) {
    return [
      { label: "Accueil", href: "/" },
      { label: SILO_LABELS.ecole, href: ROUTES.ecoleHub },
      { label: grade.label, href: grade.href },
      { label: theme.label, href: theme.href },
      { label: puzzle.title, href: puzzle.canonicalPath },
    ]
  }

  const primary =
    combo ?? grade ?? theme ?? difficulty ?? audience ?? press ?? parentCategories[0]

  if (!primary) {
    return withHome([{ label: puzzle.title, href: puzzle.canonicalPath }])
  }

  const categoryTrail = buildCategoryBreadcrumbs({
    type: primary.type,
    h1: primary.label,
    canonicalPath: primary.href,
    grade: grade ? { slug: "", name: grade.label } : undefined,
    theme: theme ? { slug: "", name: theme.label } : undefined,
    difficulty: difficulty ? { slug: "", name: difficulty.label } : undefined,
    pressBrand: press ? { slug: "", name: press.label } : undefined,
  })

  return [...categoryTrail, { label: puzzle.title, href: puzzle.canonicalPath }]
}

export function buildBreadcrumbs(context: BreadcrumbContext): BreadcrumbItem[] {
  switch (context.pageType) {
    case "home":
      return [{ label: "Accueil", href: "/" }]
    case "category":
      return buildCategoryBreadcrumbs(context.category)
    case "puzzle":
      return buildPuzzleBreadcrumbs(
        context.puzzle,
        context.parentCategories ?? [],
      )
    default:
      return [{ label: "Accueil", href: "/" }]
  }
}
