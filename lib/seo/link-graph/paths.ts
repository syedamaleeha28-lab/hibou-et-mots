import type { CategoryType } from "@/lib/db/types/page-data"
import type { CategorySeedDefinition } from "@/prisma/seed/categories"
import { normalizePath } from "@/lib/seo/canonical"
import { resolveCategoryPath } from "@/lib/seo/routes"

export function categoryPathFromDefinition(def: CategorySeedDefinition): string {
  return resolveCategoryPath({
    type: def.type as CategoryType,
    slug: def.slug,
    grade: def.gradeSlug ? { slug: def.gradeSlug } : null,
    theme: def.themeSlug ? { slug: def.themeSlug } : null,
    difficulty: def.difficultySlug ? { slug: def.difficultySlug } : null,
    pressBrand: def.pressBrandSlug ? { slug: def.pressBrandSlug } : null,
  })
}

export function normalizeGraphPath(path: string): string {
  return normalizePath(path)
}
