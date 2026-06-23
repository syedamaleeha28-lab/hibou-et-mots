import type { CategoryType } from "@/lib/db/types/page-data"
import { featuredThemeCategories } from "@/lib/home/featured-themes"
import {
  footerLegalLinks,
  footerSiloColumns,
  headerMegaMenus,
  headerPrimaryLinks,
  mobileBottomTabs,
} from "@/lib/navigation"
import { normalizePath } from "@/lib/seo/canonical"
import { buildComboParentLinks } from "@/lib/seo/linking"
import { listCategoryExploreHrefsForSlug } from "@/lib/seo/linking/category-explore-links"
import {
  ROUTES,
  resolvePuzzlePath,
  seasonalPath,
  themePath,
  gradePath,
  difficultyPath,
} from "@/lib/seo/routes"
import { CATEGORY_SEED_DEFINITIONS } from "@/prisma/seed/categories"
import { buildPuzzlePlan } from "@/prisma/seed/puzzles"
import { themeSeed } from "@/prisma/seed/themes"
import { categoryPathFromDefinition, normalizeGraphPath } from "./paths"

export type GraphAdjacency = Map<string, Set<string>>

function addEdge(adjacency: GraphAdjacency, from: string, to: string) {
  const source = normalizeGraphPath(from)
  const target = normalizeGraphPath(to)
  if (source === target) return
  if (!adjacency.has(source)) adjacency.set(source, new Set())
  adjacency.get(source)!.add(target)
}

function slugToPath(slug: string): string | null {
  const def = CATEGORY_SEED_DEFINITIONS.find((entry) => entry.slug === slug)
  if (def) return categoryPathFromDefinition(def)

  const theme = themeSeed.find((entry) => entry.slug === slug)
  if (theme) {
    return theme.isSeasonal ? seasonalPath(slug) : themePath(slug)
  }

  if (["maternelle", "cp", "ce1", "ce2", "cm1", "cm2", "6e"].includes(slug)) {
    return gradePath(slug)
  }

  if (["facile", "moyen", "difficile", "geant"].includes(slug)) {
    return difficultyPath(slug)
  }

  const audienceRoutes: Record<string, string> = {
    enfants: ROUTES.enfants,
    adultes: ROUTES.adultes,
    seniors: ROUTES.seniors,
    pedagogie: ROUTES.pedagogie,
    personnages: ROUTES.personnages,
    application: ROUTES.application,
    solutions: ROUTES.solutions,
    "jeux-magazines": ROUTES.jeuxMagazines,
    "ressources-enseignants": ROUTES.ressources,
  }
  if (audienceRoutes[slug]) return audienceRoutes[slug]!

  return null
}

export function collectHomeNavigationLinks(): string[] {
  const links = new Set<string>()

  for (const link of headerPrimaryLinks) links.add(link.href)
  for (const panel of headerMegaMenus) {
    for (const featured of panel.featured ?? []) links.add(featured.href)
    for (const section of panel.sections) {
      for (const link of section.links) links.add(link.href)
    }
  }
  for (const tab of mobileBottomTabs) links.add(tab.href)
  for (const column of footerSiloColumns) {
    for (const link of column.links) links.add(link.href)
  }
  for (const link of footerLegalLinks) links.add(link.href)
  for (const theme of featuredThemeCategories) links.add(theme.href)

  return [...links].map(normalizeGraphPath)
}

export function buildSeedLinkGraph(): GraphAdjacency {
  const adjacency: GraphAdjacency = new Map()
  const definitionsBySlug = new Map(CATEGORY_SEED_DEFINITIONS.map((def) => [def.slug, def]))

  for (const href of collectHomeNavigationLinks()) {
    addEdge(adjacency, ROUTES.home, href)
  }

  for (const def of CATEGORY_SEED_DEFINITIONS) {
    const path = categoryPathFromDefinition(def)

    if (def.parentSlug) {
      const parent = definitionsBySlug.get(def.parentSlug)
      if (parent) {
        addEdge(adjacency, categoryPathFromDefinition(parent), path)
      }
    }

    if (def.type === "COMBO" && def.gradeSlug && def.themeSlug) {
      const theme = themeSeed.find((entry) => entry.slug === def.themeSlug)
      for (const link of buildComboParentLinks({
        grade: { slug: def.gradeSlug, name: def.gradeSlug },
        theme: {
          slug: def.themeSlug,
          name: def.themeSlug,
          isSeasonal: theme?.isSeasonal,
        },
      })) {
        addEdge(adjacency, path, link.href)
      }
    }

    addEdge(adjacency, path, ROUTES.generateur)
    addEdge(adjacency, path, ROUTES.jouer)
    addEdge(adjacency, path, ROUTES.imprimer)

    for (const href of listCategoryExploreHrefsForSlug(def.slug)) {
      addEdge(adjacency, path, href)
    }
  }

  for (const spec of buildPuzzlePlan()) {
    const puzzlePath = resolvePuzzlePath(spec.slug)
    addEdge(adjacency, puzzlePath, ROUTES.generateur)

    for (const categorySlug of spec.categorySlugs) {
      const categoryPath = slugToPath(categorySlug)
      if (categoryPath) {
        addEdge(adjacency, categoryPath, puzzlePath)
      }
    }
  }

  return adjacency
}

export function listSeedRequiredPages(): string[] {
  const pages = new Set<string>([normalizePath(ROUTES.home)])

  for (const def of CATEGORY_SEED_DEFINITIONS) {
    pages.add(categoryPathFromDefinition(def))
  }

  for (const spec of buildPuzzlePlan()) {
    pages.add(resolvePuzzlePath(spec.slug))
  }

  return [...pages]
}

export function resolveCategoryPathFromSlug(slug: string): string | null {
  const def = CATEGORY_SEED_DEFINITIONS.find((entry) => entry.slug === slug)
  if (def) return categoryPathFromDefinition(def)
  return slugToPath(slug)
}

export { normalizeGraphPath }
