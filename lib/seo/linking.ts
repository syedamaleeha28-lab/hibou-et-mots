import type { CategoryType, ComboParentLink } from "@/lib/db/types/page-data"
import { comboPath, gradePath, seasonalPath, themePath } from "./routes"

export function buildComboParentLinks(input: {
  grade: { slug: string; name: string }
  theme: { slug: string; name: string; isSeasonal?: boolean }
}): ComboParentLink[] {
  const themeHref = input.theme.isSeasonal
    ? seasonalPath(input.theme.slug)
    : themePath(input.theme.slug)

  return [
    {
      label: `Mots mêlés ${input.grade.name}`,
      href: gradePath(input.grade.slug),
      description: `Toutes les grilles pour le niveau ${input.grade.name}`,
    },
    {
      label: `Mots mêlés ${input.theme.name}`,
      href: themeHref,
      description: `Toutes les grilles sur le thème ${input.theme.name}`,
    },
  ]
}

export function shouldShowSubCategories(_type: CategoryType, subCategoryCount: number): boolean {
  return subCategoryCount > 0
}

export function shouldShowComboParentLinks(type: CategoryType): boolean {
  return type === "COMBO"
}

export function categoryBackLinkLabel(type: CategoryType, themeName?: string): string {
  if (themeName) return `Voir tous les mots mêlés ${themeName}`
  return "Retour à la catégorie"
}

export function generatorCtaHref(themeSlug?: string): string {
  const base = "/generateur-mots-meles/"
  if (!themeSlug) return base
  return `${base}?theme=${encodeURIComponent(themeSlug)}`
}

export function comboPathFromSlugs(gradeSlug: string, themeSlug: string): string {
  return comboPath(gradeSlug, themeSlug)
}
