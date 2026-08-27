import { absoluteUrl, ROUTES, gradePath, PT_ROUTES } from "./routes"
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

/**
 * NEW: Portuguese silo labels. Only covers the 3 category types PT-BR
 * actually has (GRADE/COMBO, THEME, DIFFICULTY) — SEASONAL and
 * PRESS_BRAND aren't in PT scope, so those fall through to null (no
 * silo crumb) rather than a fabricated one.
 */
const SILO_LABELS_PT = {
  ecole: "Escola",
  thematiques: "Temáticos",
  difficulte: "Dificuldade",
} as const

type CategoryBreadcrumbInput = {
  type: CategoryType
  h1: string
  canonicalPath: string
  isHub?: boolean
  /**
   * NEW. Was missing entirely — siloForCategoryType() below was
   * hardcoded to French labels/hrefs regardless of locale, so every
   * PT-BR grade/theme/difficulty page showed a French middle breadcrumb
   * crumb (e.g. "École" linking to /mots-meles-ecole/) pointing at the
   * wrong-language page. Found while testing the PT grade cluster, but
   * affects theme/difficulty pages too, since they share this same
   * function.
   */
  locale?: "fr" | "pt-BR"
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

function siloForCategoryType(
  type: CategoryType,
  locale: "fr" | "pt-BR" = "fr",
): { label: string; href: string } | null {
  if (locale === "pt-BR") {
    switch (type) {
      case "GRADE":
      case "COMBO":
        return { label: SILO_LABELS_PT.ecole, href: PT_ROUTES.ecoleHub }
      case "THEME":
        return { label: SILO_LABELS_PT.thematiques, href: PT_ROUTES.thematiquesHub }
      case "DIFFICULTY":
        return { label: SILO_LABELS_PT.difficulte, href: PT_ROUTES.difficulteHub }
      default:
        return null
    }
  }
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

  if (category.isHub || category.type === "AUDIENCE") {
    items.push({ label: category.h1, href: category.canonicalPath })
    return items
  }

  const silo = siloForCategoryType(category.type, category.locale)

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
    const locale =
      combo.locale === "pt-BR" || combo.locale === "fr"
        ? combo.locale
        : undefined
    const silo = siloForCategoryType("COMBO", locale)
    return [
      { label: "Accueil", href: "/" },
      ...(silo ? [silo] : []),
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
    // NEW: was missing — meant every PT-BR puzzle's breadcrumb silo
    // crumb (not just the new grade puzzles, ALL of them, including
    // the 12 already-live theme puzzles) defaulted to French. Requires
    // CategorySummary to carry `locale` — see the page-data.ts patch
    // note that ships alongside this file.
    locale:
      primary.locale === "pt-BR" || primary.locale === "fr"
        ? primary.locale
        : undefined,
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
