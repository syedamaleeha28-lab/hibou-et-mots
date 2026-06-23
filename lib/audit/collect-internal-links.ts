import { popularPuzzles } from "@/lib/content"
import {
  MVP_P1_COMBOS,
  MVP_PRESS_BRANDS,
  HUB_CATEGORY_SLUGS,
} from "@/lib/db/adapters/category-constants"
import type { CategoryPageData, PuzzlePageData } from "@/lib/db/types/page-data"
import { featuredThemeCategories } from "@/lib/home/featured-themes"
import { popularPuzzleHref } from "@/lib/home/popular-puzzle-links"
import {
  footerLegalLinks,
  footerSiloColumns,
  headerMegaMenus,
  headerPrimaryLinks,
  mobileBottomTabs,
} from "@/lib/navigation"
import { collectHomeNavigationLinks } from "@/lib/seo/link-graph/validate"
import { categoryPathFromDefinition } from "@/lib/seo/link-graph/paths"
import { getStaticSitemapEntries } from "@/lib/seo/sitemap/static"
import { seedCategorySitemapPaths, seedPuzzleSitemapPaths } from "@/lib/seo/sitemap/seed-entries"
import {
  DEFAULT_SITE_URL,
  ROUTES,
  gradePath,
  puzzlePath,
} from "@/lib/seo/routes"
import {
  resolveAudienceCategoryPageData,
  resolveComboCategoryPageData,
  resolveDifficultyCategoryPageData,
  resolveEcoleHubPageData,
  resolveGradeCategoryPageData,
  resolveHubCategoryPageData,
  resolvePressBrandCategoryPageData,
  resolveSeasonalCategoryPageData,
  resolveStaticSupportCategoryPageData,
  resolveThemeCategoryPageData,
} from "@/lib/db/queries/category-resolvers"
import { resolvePuzzlePageData } from "@/lib/db/queries/pilot"
import { getCategoryExploreLinks } from "@/lib/seo/linking/category-explore-links"
import { generatorCtaHref } from "@/lib/seo/linking"
import { normalizeInternalHref } from "@/lib/audit/resolve-internal-path"
import { CATEGORY_SEED_DEFINITIONS } from "@/prisma/seed/categories"
import { difficultySeed } from "@/prisma/seed/difficulties"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"
import { getSeedPuzzlePlan } from "@/lib/db/adapters/puzzle-catalog"

export type InternalLinkRef = {
  href: string
  path: string
  source: string
  section: InternalLinkSection
}

export type InternalLinkSection =
  | "navigation"
  | "footer"
  | "homepage"
  | "category-hub"
  | "grade"
  | "theme"
  | "seasonal"
  | "difficulty"
  | "combo"
  | "press"
  | "audience"
  | "static-support"
  | "puzzle"
  | "tool"
  | "sitemap"

const TOOL_PAGE_LINKS: Array<{ href: string; source: string; from: "generateur" | "jouer" }> = [
  { href: ROUTES.jouer, source: "tool:jouer:cta", from: "generateur" },
  { href: ROUTES.generateur, source: "tool:jouer:cross", from: "jouer" },
  { href: ROUTES.enfants, source: "tool:hub-links", from: "generateur" },
  { href: ROUTES.adultes, source: "tool:hub-links", from: "generateur" },
  { href: ROUTES.seniors, source: "tool:hub-links", from: "generateur" },
  { href: ROUTES.ecoleHub, source: "tool:hub-links", from: "generateur" },
  { href: ROUTES.thematiquesHub, source: "tool:hub-links", from: "generateur" },
  { href: ROUTES.fetesHub, source: "tool:hub-links", from: "generateur" },
  { href: ROUTES.imprimer, source: "tool:hub-links", from: "generateur" },
  { href: ROUTES.gratuits, source: "tool:hub-links", from: "generateur" },
  { href: ROUTES.imprimer, source: "tool:editorial", from: "generateur" },
  { href: ROUTES.generateur, source: "tool:editorial", from: "jouer" },
  { href: ROUTES.enfants, source: "tool:hub-links", from: "jouer" },
  { href: ROUTES.adultes, source: "tool:hub-links", from: "jouer" },
  { href: ROUTES.seniors, source: "tool:hub-links", from: "jouer" },
  { href: ROUTES.ecoleHub, source: "tool:hub-links", from: "jouer" },
  { href: ROUTES.thematiquesHub, source: "tool:hub-links", from: "jouer" },
  { href: ROUTES.fetesHub, source: "tool:hub-links", from: "jouer" },
  { href: ROUTES.imprimer, source: "tool:hub-links", from: "jouer" },
  { href: ROUTES.gratuits, source: "tool:hub-links", from: "jouer" },
  { href: ROUTES.imprimer, source: "tool:editorial", from: "jouer" },
]

const HOME_SILO_LINKS: Array<{ href: string; label: string }> = [
  { href: ROUTES.gratuits, label: "gratuits" },
  { href: ROUTES.imprimer, label: "imprimer" },
  { href: ROUTES.jouer, label: "jouer" },
  { href: ROUTES.generateur, label: "generateur" },
  { href: ROUTES.ecoleHub, label: "ecole" },
  { href: ROUTES.thematiquesHub, label: "thematiques" },
  { href: ROUTES.fetesHub, label: "fetes" },
  { href: ROUTES.presseHub, label: "presse" },
  { href: ROUTES.enfants, label: "enfants" },
  { href: ROUTES.adultes, label: "adultes" },
  { href: ROUTES.seniors, label: "seniors" },
]

function linkRef(
  href: string,
  source: string,
  section: InternalLinkSection,
): InternalLinkRef {
  return { href, path: normalizeInternalHref(href), source, section }
}

function linksFromCategoryPage(
  page: CategoryPageData,
  prefix: string,
  section: InternalLinkSection,
): InternalLinkRef[] {
  const links: InternalLinkRef[] = []
  for (const item of page.breadcrumbs) {
    links.push(linkRef(item.href, `${prefix}:breadcrumb`, section))
  }
  for (const item of page.subCategories) {
    links.push(linkRef(item.href, `${prefix}:subcategory`, section))
  }
  for (const item of page.puzzles.items) {
    links.push(linkRef(item.href, `${prefix}:puzzle-grid`, section))
  }
  for (const item of page.relatedCategories) {
    links.push(linkRef(item.href, `${prefix}:related`, section))
  }
  for (const item of page.comboParentLinks ?? []) {
    links.push(linkRef(item.href, `${prefix}:combo-parent`, section))
  }
  for (const item of getCategoryExploreLinks(page)) {
    links.push(linkRef(item.href, `${prefix}:explore`, section))
  }
  links.push(linkRef(generatorCtaHref(page.theme?.slug), `${prefix}:cta-generateur`, section))
  links.push(linkRef(ROUTES.jouer, `${prefix}:cta-jouer`, section))
  links.push(linkRef(ROUTES.imprimer, `${prefix}:cta-imprimer`, section))
  return links
}

function linksFromPuzzlePage(page: PuzzlePageData, prefix: string): InternalLinkRef[] {
  const links: InternalLinkRef[] = []
  for (const item of page.breadcrumbs) {
    links.push(linkRef(item.href, `${prefix}:breadcrumb`, "puzzle"))
  }
  for (const item of page.relatedPuzzles) {
    links.push(linkRef(item.href, `${prefix}:related`, "puzzle"))
  }
  for (const item of page.parentCategories) {
    links.push(linkRef(item.href, `${prefix}:parent-category`, "puzzle"))
  }
  return links
}

async function collectFromCategoryLoader(
  section: InternalLinkSection,
  prefix: string,
  loader: () => Promise<CategoryPageData | null>,
): Promise<InternalLinkRef[]> {
  const page = await loader()
  if (!page) return []
  return linksFromCategoryPage(page, prefix, section)
}

export function collectNavigationLinks(): InternalLinkRef[] {
  const links: InternalLinkRef[] = []

  for (const item of headerPrimaryLinks) {
    links.push(linkRef(item.href, "nav:header-primary", "navigation"))
  }
  for (const panel of headerMegaMenus) {
    for (const featured of panel.featured ?? []) {
      links.push(linkRef(featured.href, `nav:mega:${panel.id}:featured`, "navigation"))
    }
    for (const section of panel.sections) {
      for (const item of section.links) {
        links.push(linkRef(item.href, `nav:mega:${panel.id}:${section.title}`, "navigation"))
      }
    }
  }
  for (const tab of mobileBottomTabs) {
    links.push(linkRef(tab.href, "nav:mobile-tab", "navigation"))
  }

  return links
}

export function collectFooterLinks(): InternalLinkRef[] {
  const links: InternalLinkRef[] = []
  for (const column of footerSiloColumns) {
    for (const item of column.links) {
      links.push(linkRef(item.href, `footer:${column.title}`, "footer"))
    }
  }
  for (const item of footerLegalLinks) {
    links.push(linkRef(item.href, "footer:legal", "footer"))
  }
  return links
}

export function collectHomepageLinks(): InternalLinkRef[] {
  const links: InternalLinkRef[] = []

  for (const href of collectHomeNavigationLinks()) {
    if (!links.some((l) => l.path === normalizeInternalHref(href))) {
      links.push(linkRef(href, "homepage:nav-derived", "homepage"))
    }
  }

  for (const theme of featuredThemeCategories) {
    links.push(linkRef(theme.href, `homepage:featured:${theme.title}`, "homepage"))
  }

  for (const puzzle of popularPuzzles) {
    const href = popularPuzzleHref(puzzle.title)
    links.push(linkRef(href, `homepage:popular:${puzzle.title}`, "homepage"))
  }

  for (const grade of gradeSeed) {
    links.push(linkRef(gradePath(grade.slug), `homepage:grade:${grade.slug}`, "homepage"))
  }

  for (const item of HOME_SILO_LINKS) {
    links.push(linkRef(item.href, `homepage:silo:${item.label}`, "homepage"))
  }

  links.push(linkRef(ROUTES.ecoleHub, "homepage:seo:ecole", "homepage"))
  links.push(linkRef(ROUTES.thematiquesHub, "homepage:seo:thematiques", "homepage"))
  links.push(linkRef(ROUTES.fetesHub, "homepage:seo:fetes", "homepage"))
  links.push(linkRef(ROUTES.jouer, "homepage:hero:jouer", "homepage"))
  links.push(linkRef(ROUTES.generateur, "homepage:hero:generateur", "homepage"))
  links.push(linkRef(ROUTES.imprimer, "homepage:printable", "homepage"))
  links.push(linkRef(ROUTES.adultes, "homepage:seo:adultes", "homepage"))
  links.push(linkRef(ROUTES.seniors, "homepage:seo:seniors", "homepage"))
  links.push(linkRef(ROUTES.enfants, "homepage:silo:enfants", "homepage"))
  links.push(linkRef(ROUTES.adultes, "homepage:silo:adultes", "homepage"))
  links.push(linkRef(ROUTES.seniors, "homepage:silo:seniors", "homepage"))

  return links
}

export function collectToolPageLinks(): InternalLinkRef[] {
  return TOOL_PAGE_LINKS.map((item) =>
    linkRef(item.href, `${item.source}:${item.from}`, "tool"),
  )
}

export async function collectCategoryPageLinks(): Promise<InternalLinkRef[]> {
  const links: InternalLinkRef[] = []

  for (const hub of Object.values(HUB_CATEGORY_SLUGS)) {
    links.push(
      ...(await collectFromCategoryLoader("category-hub", `hub:${hub}`, () =>
        resolveHubCategoryPageData(hub, 1),
      )),
    )
  }

  links.push(
    ...(await collectFromCategoryLoader("category-hub", "hub:ecole-resolver", () =>
      resolveEcoleHubPageData(1),
    )),
  )

  for (const grade of gradeSeed) {
    links.push(
      ...(await collectFromCategoryLoader("grade", `grade:${grade.slug}`, () =>
        resolveGradeCategoryPageData(grade.slug, 1),
      )),
    )
  }

  for (const theme of themeSeed.filter((t) => !t.isSeasonal)) {
    links.push(
      ...(await collectFromCategoryLoader("theme", `theme:${theme.slug}`, () =>
        resolveThemeCategoryPageData(theme.slug, 1),
      )),
    )
  }

  for (const theme of themeSeed.filter((t) => t.isSeasonal)) {
    links.push(
      ...(await collectFromCategoryLoader("seasonal", `seasonal:${theme.slug}`, () =>
        resolveSeasonalCategoryPageData(theme.slug, 1),
      )),
    )
  }

  for (const level of difficultySeed) {
    links.push(
      ...(await collectFromCategoryLoader("difficulty", `difficulty:${level.slug}`, () =>
        resolveDifficultyCategoryPageData(level.slug, 1),
      )),
    )
  }

  for (const combo of MVP_P1_COMBOS) {
    links.push(
      ...(await collectFromCategoryLoader(
        "combo",
        `combo:${combo.grade}:${combo.theme}`,
        () => resolveComboCategoryPageData(combo.grade, combo.theme, 1),
      )),
    )
  }

  for (const brand of MVP_PRESS_BRANDS) {
    links.push(
      ...(await collectFromCategoryLoader("press", `press:${brand.slug}`, () =>
        resolvePressBrandCategoryPageData(brand.slug, 1),
      )),
    )
  }

  for (const audience of ["enfants", "adultes", "seniors"] as const) {
    links.push(
      ...(await collectFromCategoryLoader("audience", `audience:${audience}`, () =>
        resolveAudienceCategoryPageData(audience, 1),
      )),
    )
  }

  for (const route of [
    ROUTES.pedagogie,
    ROUTES.personnages,
    ROUTES.application,
    ROUTES.solutions,
    ROUTES.jeuxMagazines,
    ROUTES.ressources,
  ]) {
    links.push(
      ...(await collectFromCategoryLoader("static-support", `support:${route}`, () =>
        resolveStaticSupportCategoryPageData(route, 1),
      )),
    )
  }

  return links
}

export async function collectPuzzlePageLinks(
  seedSlugs?: string[],
): Promise<InternalLinkRef[]> {
  const slugs = seedSlugs ?? getSeedPuzzlePlan().map((spec) => spec.slug)
  const links: InternalLinkRef[] = []
  const seen = new Set<string>()

  for (const slug of slugs) {
    const page = await resolvePuzzlePageData(slug)
    if (!page) continue
    for (const ref of linksFromPuzzlePage(page, `puzzle:${slug}`)) {
      const key = `${ref.path}|${ref.source}`
      if (seen.has(key)) continue
      seen.add(key)
      links.push(ref)
    }
  }

  return links
}

export function collectSitemapLinks(siteUrl = DEFAULT_SITE_URL): InternalLinkRef[] {
  const links: InternalLinkRef[] = []

  for (const entry of getStaticSitemapEntries(siteUrl)) {
    links.push(linkRef(entry.loc, "sitemap:static", "sitemap"))
  }

  for (const path of seedCategorySitemapPaths()) {
    links.push(linkRef(path, "sitemap:category-seed", "sitemap"))
  }

  for (const path of seedPuzzleSitemapPaths()) {
    links.push(linkRef(path, "sitemap:puzzle-seed", "sitemap"))
  }

  for (const def of CATEGORY_SEED_DEFINITIONS) {
    links.push(
      linkRef(
        categoryPathFromDefinition(def),
        `sitemap:category-definition:${def.slug}`,
        "sitemap",
      ),
    )
  }

  for (const spec of getSeedPuzzlePlan()) {
    links.push(linkRef(puzzlePath(spec.slug), `sitemap:puzzle-plan:${spec.slug}`, "sitemap"))
  }

  return links
}

/** Internal links for pillar/category map (skips individual puzzle pages for speed). */
export async function collectInternalLinksForMap(): Promise<InternalLinkRef[]> {
  const sections = [
    collectNavigationLinks(),
    collectFooterLinks(),
    collectHomepageLinks(),
    collectToolPageLinks(),
    await collectCategoryPageLinks(),
  ]

  const merged: InternalLinkRef[] = []
  const seen = new Set<string>()

  for (const batch of sections) {
    for (const ref of batch) {
      if (!ref.path.startsWith("/")) continue
      const key = `${ref.path}|${ref.source}`
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(ref)
    }
  }

  return merged
}

/** All internal links from rendered page data, navigation, tools, and sitemap sources. */
export async function collectAllInternalLinks(): Promise<InternalLinkRef[]> {
  const sections = [
    collectNavigationLinks(),
    collectFooterLinks(),
    collectHomepageLinks(),
    collectToolPageLinks(),
    await collectCategoryPageLinks(),
    await collectPuzzlePageLinks(),
    collectSitemapLinks(),
  ]

  const merged: InternalLinkRef[] = []
  const seen = new Set<string>()

  for (const batch of sections) {
    for (const ref of batch) {
      if (!ref.path.startsWith("/")) continue
      const key = `${ref.path}|${ref.source}`
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(ref)
    }
  }

  return merged
}
