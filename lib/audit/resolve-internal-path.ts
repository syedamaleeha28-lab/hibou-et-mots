import { existsSync } from "node:fs"
import { join } from "node:path"
import { normalizePath } from "@/lib/seo/canonical"
import { staticPathToAppPageFile } from "@/lib/seo/sitemap/routability"
import {
  ROUTES,
  comboPath,
  difficultyPath,
  gradePath,
  pressBrandPath,
  puzzlePath,
  seasonalPath,
  themePath,
} from "@/lib/seo/routes"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import {
  resolveAudienceCategoryPageData,
  resolveComboCategoryPageData,
  resolveDifficultyCategoryPageData,
  resolveGradeCategoryPageData,
  resolveHubCategoryPageData,
  resolvePressBrandCategoryPageData,
  resolveSeasonalCategoryPageData,
  resolveStaticSupportCategoryPageData,
  resolveThemeCategoryPageData,
} from "@/lib/db/queries/category-resolvers"
import { resolvePuzzlePageData } from "@/lib/db/queries/pilot"
import { MVP_P1_COMBOS, MVP_PRESS_BRANDS } from "@/lib/db/adapters/category-constants"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"
import { difficultySeed } from "@/prisma/seed/difficulties"

export type InternalLinkStatus = "valid" | "redirect" | "not_found"

export type InternalPathResolution = {
  path: string
  status: InternalLinkStatus
  redirectTo?: string
}

/** Known trailing-slash canonical paths (no content resolver needed). */
const STATIC_APP_PATHS = new Set<string>([
  ROUTES.home,
  ROUTES.gratuits,
  ROUTES.imprimer,
  ROUTES.jouer,
  ROUTES.generateur,
  ROUTES.recherche,
  ROUTES.difficulteHub,
  ROUTES.ecoleHub,
  ROUTES.fetesHub,
  ROUTES.thematiquesHub,
  ROUTES.presseHub,
  ROUTES.enfants,
  ROUTES.adultes,
  ROUTES.seniors,
  ROUTES.pedagogie,
  ROUTES.personnages,
  ROUTES.solutions,
  ROUTES.application,
  ROUTES.jeuxMagazines,
  ROUTES.ressources,
  ROUTES.mentionsLegales,
  ROUTES.confidentialite,
  ROUTES.contact,
  ROUTES.aPropos,
  ROUTES.auteur,
])

function hubSlugForPath(path: string): string | null {
  const map: Record<string, string> = {
    [ROUTES.gratuits]: HUB_CATEGORY_SLUGS.gratuits,
    [ROUTES.imprimer]: HUB_CATEGORY_SLUGS.imprimer,
    [ROUTES.ecoleHub]: HUB_CATEGORY_SLUGS.ecole,
    [ROUTES.fetesHub]: HUB_CATEGORY_SLUGS.fetes,
    [ROUTES.thematiquesHub]: HUB_CATEGORY_SLUGS.thematiques,
    [ROUTES.difficulteHub]: HUB_CATEGORY_SLUGS.difficulte,
    [ROUTES.presseHub]: HUB_CATEGORY_SLUGS.presse,
  }
  return map[path] ?? null
}

async function resolveCategoryLikePath(path: string): Promise<boolean> {
  if (path === ROUTES.ecoleHub) return !!(await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.ecole))
  if (path === ROUTES.fetesHub) return !!(await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.fetes))
  if (path === ROUTES.thematiquesHub)
    return !!(await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.thematiques))
  if (path === ROUTES.difficulteHub)
    return !!(await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.difficulte))
  if (path === ROUTES.presseHub) return !!(await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.presse))
  if (path === ROUTES.gratuits) return !!(await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.gratuits))
  if (path === ROUTES.imprimer) return !!(await resolveHubCategoryPageData(HUB_CATEGORY_SLUGS.imprimer))

  const hubSlug = hubSlugForPath(path)
  if (hubSlug) return !!(await resolveHubCategoryPageData(hubSlug))

  if (path === ROUTES.enfants) return !!(await resolveAudienceCategoryPageData("enfants"))
  if (path === ROUTES.adultes) return !!(await resolveAudienceCategoryPageData("adultes"))
  if (path === ROUTES.seniors) return !!(await resolveAudienceCategoryPageData("seniors"))

  for (const route of [
    ROUTES.pedagogie,
    ROUTES.personnages,
    ROUTES.application,
    ROUTES.solutions,
    ROUTES.jeuxMagazines,
    ROUTES.ressources,
  ]) {
    if (path === route) return !!(await resolveStaticSupportCategoryPageData(route))
  }

  const comboMatch = path.match(/^\/mots-meles-ecole\/([^/]+)\/([^/]+)\/$/)
  if (comboMatch) {
    return !!(await resolveComboCategoryPageData(comboMatch[1]!, comboMatch[2]!))
  }

  const gradeMatch = path.match(/^\/mots-meles-ecole\/([^/]+)\/$/)
  if (gradeMatch) {
    return !!(await resolveGradeCategoryPageData(gradeMatch[1]!))
  }

  const themeMatch = path.match(/^\/mots-meles-thematiques\/([^/]+)\/$/)
  if (themeMatch) {
    return !!(await resolveThemeCategoryPageData(themeMatch[1]!))
  }

  const seasonalMatch = path.match(/^\/mots-meles-fetes-saisons\/([^/]+)\/$/)
  if (seasonalMatch) {
    return !!(await resolveSeasonalCategoryPageData(seasonalMatch[1]!))
  }

  const difficultyMatch = path.match(/^\/mots-meles-difficulte\/([^/]+)\/$/)
  if (difficultyMatch) {
    return !!(await resolveDifficultyCategoryPageData(difficultyMatch[1]!))
  }

  const pressMatch = path.match(/^\/mots-meles-journaux-magazines\/([^/]+)\/$/)
  if (pressMatch) {
    return !!(await resolvePressBrandCategoryPageData(pressMatch[1]!))
  }

  return false
}

export function normalizeInternalHref(href: string): string {
  const withoutQuery = href.split("#")[0]?.split("?")[0] ?? href
  if (withoutQuery.startsWith("http")) {
    try {
      return normalizePath(new URL(withoutQuery).pathname)
    } catch {
      return normalizePath(withoutQuery)
    }
  }
  return normalizePath(withoutQuery)
}

export async function resolveInternalPath(
  href: string,
  rootDir = process.cwd(),
): Promise<InternalPathResolution> {
  const path = normalizeInternalHref(href)

  if (!path.startsWith("/")) {
    return { path, status: "not_found" }
  }

  const puzzleMatch = path.match(/^\/mots-meles\/([^/]+)\/$/)
  if (puzzleMatch) {
    const slug = puzzleMatch[1]!
    const page = await resolvePuzzlePageData(slug)
    return page ? { path, status: "valid" } : { path, status: "not_found" }
  }

  if (path === ROUTES.home) {
    return { path, status: "valid" }
  }

  if (STATIC_APP_PATHS.has(path)) {
    const pageFile = staticPathToAppPageFile(path)
    if (!existsSync(join(rootDir, pageFile))) {
      return { path, status: "not_found" }
    }
    const categoryLike =
      path !== ROUTES.jouer &&
      path !== ROUTES.generateur &&
      path !== ROUTES.recherche &&
      path !== ROUTES.mentionsLegales &&
      path !== ROUTES.confidentialite &&
      path !== ROUTES.contact &&
      path !== ROUTES.aPropos &&
      path !== ROUTES.auteur

    if (categoryLike) {
      const ok = await resolveCategoryLikePath(path)
      return ok ? { path, status: "valid" } : { path, status: "not_found" }
    }
    return { path, status: "valid" }
  }

  if (await resolveCategoryLikePath(path)) {
    return { path, status: "valid" }
  }

  const pageFile = staticPathToAppPageFile(path)
  if (existsSync(join(rootDir, pageFile))) {
    return { path, status: "valid" }
  }

  return { path, status: "not_found" }
}

/** All category URL patterns exercised by navigation and seed content. */
export function listKnownCategoryPaths(): string[] {
  const paths = new Set<string>([
    ROUTES.home,
    ...Object.values(HUB_CATEGORY_SLUGS).map((slug) => {
      const hubMap: Record<string, string> = {
        [HUB_CATEGORY_SLUGS.gratuits]: ROUTES.gratuits,
        [HUB_CATEGORY_SLUGS.imprimer]: ROUTES.imprimer,
        [HUB_CATEGORY_SLUGS.ecole]: ROUTES.ecoleHub,
        [HUB_CATEGORY_SLUGS.fetes]: ROUTES.fetesHub,
        [HUB_CATEGORY_SLUGS.thematiques]: ROUTES.thematiquesHub,
        [HUB_CATEGORY_SLUGS.difficulte]: ROUTES.difficulteHub,
        [HUB_CATEGORY_SLUGS.presse]: ROUTES.presseHub,
      }
      return hubMap[slug]!
    }),
    ROUTES.enfants,
    ROUTES.adultes,
    ROUTES.seniors,
    ROUTES.pedagogie,
    ROUTES.personnages,
    ROUTES.application,
    ROUTES.solutions,
    ROUTES.jeuxMagazines,
    ROUTES.ressources,
    ROUTES.jouer,
    ROUTES.generateur,
    ROUTES.recherche,
    ROUTES.mentionsLegales,
    ROUTES.confidentialite,
    ROUTES.contact,
    ROUTES.aPropos,
    ROUTES.auteur,
  ])

  for (const grade of gradeSeed) paths.add(gradePath(grade.slug))
  for (const theme of themeSeed.filter((t) => !t.isSeasonal)) paths.add(themePath(theme.slug))
  for (const theme of themeSeed.filter((t) => t.isSeasonal)) paths.add(seasonalPath(theme.slug))
  for (const level of difficultySeed) paths.add(difficultyPath(level.slug))
  for (const combo of MVP_P1_COMBOS) paths.add(comboPath(combo.grade, combo.theme))
  for (const brand of MVP_PRESS_BRANDS) paths.add(pressBrandPath(brand.slug))

  return [...paths].map(normalizePath)
}

export function isPuzzlePath(path: string): boolean {
  return /^\/mots-meles\/[^/]+\/$/.test(normalizePath(path))
}

export function puzzleSlugFromPath(path: string): string | null {
  const match = normalizePath(path).match(/^\/mots-meles\/([^/]+)\/$/)
  return match?.[1] ?? null
}

export { puzzlePath }
