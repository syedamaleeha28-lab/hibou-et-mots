import type { CategoryType } from "@/lib/db/types/page-data"

export function priorityForCategoryType(type: CategoryType, isHub: boolean): number {
  if (isHub) return 1.0
  switch (type) {
    case "GRADE":
    case "THEME":
    case "SEASONAL":
    case "DIFFICULTY":
    case "AUDIENCE":
      return 0.8
    case "COMBO":
      return 0.6
    case "PRESS_BRAND":
      return 0.4
    default:
      return 0.4
  }
}

export function priorityForStaticPage(path: string): number {
  if (path === "/") return 1.0
  if (
    path.includes("pedagogie") ||
    path.includes("personnages") ||
    path.includes("solutions") ||
    path.includes("ressources")
  ) {
    return 0.4
  }
  return 0.8
}

export const PUZZLE_SITEMAP_PRIORITY = 0.5
