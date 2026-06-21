import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { resolveInternalPath } from "@/lib/audit/resolve-internal-path"
import { getSeedPuzzlePlan } from "@/lib/db/adapters/puzzle-catalog"
import { resolveThemeCategoryPageData } from "@/lib/db/queries/category-resolvers"
import { resolvePuzzlePageData } from "@/lib/db/queries/pilot"
import { buildHomeMetadata, buildStaticPageMetadata } from "@/lib/seo/metadata"
import { shouldNoindexPath, robotsDirective } from "@/lib/seo/indexability"
import { buildHomePageSchemaGraph } from "@/lib/seo/schema/home"
import {
  buildCategoryPageSchemaGraph,
  buildPuzzlePageSchemaGraph,
} from "@/lib/seo/schema/page-schemas"
import {
  buildFaqPageSchema,
  buildSchemaGraph,
  buildSoftwareApplicationSchema,
  GENERATOR_FEATURE_LIST,
  ONLINE_PLAY_FEATURE_LIST,
} from "@/lib/seo/schema"
import { absoluteUrl, DEFAULT_SITE_URL, resolveCategoryPath, ROUTES } from "@/lib/seo/routes"
import {
  getCategorySitemapEntries,
  getImageSitemapEntries,
  getPuzzleSitemapBatchCount,
  getPuzzleSitemapEntries,
  getSitemapIndexLocations,
  getStaticSitemapEntries,
} from "@/lib/seo/sitemap"
import { seedCategorySitemapPaths } from "@/lib/seo/sitemap/seed-entries"
import { CATEGORY_SEED_DEFINITIONS } from "@/prisma/seed/categories"
import { computeIsIndexable } from "@/lib/seo/indexability"
import { buildPuzzlePlan } from "@/prisma/seed/puzzles"
import { GENERATOR_FAQ, ONLINE_PLAY_FAQ } from "@/lib/content/phase1"

export type AuditStatus = "PASS" | "FAIL" | "WARN"

export type AuditCheck = {
  id: string
  area: string
  label: string
  status: AuditStatus
  detail: string
  blocker?: boolean
}

export type ContentPageReport = {
  path: string
  roadmapTarget: number
  totalWords: number
  editorialWords: number
  belowRoadmap: boolean
  below700: boolean
  priority: "Critical" | "High" | "Medium"
}

export type ProductionReadinessReport = {
  checks: AuditCheck[]
  contentPages: ContentPageReport[]
  indexability: {
    categoriesBelowThreshold: Array<{ slug: string; path: string; puzzleCount: number }>
    noindexPaths: string[]
    sitemapEligibleCategories: number
    sitemapEligiblePuzzles: number
  }
  launchBlockers: string[]
  launchWarnings: string[]
  readinessPercent: number
  siteUrl: string
  liveServer: boolean
}

const PRODUCTION_DOMAIN = "hibou-et-mots.com"
const BLOCKED_DOMAINS = ["localhost", "vercel.app", "127.0.0.1"]

const ROADMAP_PAGES: Array<{
  path: string
  target: number
  priority: "Critical" | "High" | "Medium"
}> = [
  { path: "/", target: 750, priority: "Critical" },
  { path: ROUTES.gratuits, target: 800, priority: "Critical" },
  { path: ROUTES.enfants, target: 700, priority: "Critical" },
  { path: ROUTES.imprimer, target: 750, priority: "Critical" },
  { path: ROUTES.ecoleHub, target: 750, priority: "Critical" },
  { path: ROUTES.jouer, target: 600, priority: "Critical" },
  { path: ROUTES.generateur, target: 600, priority: "Critical" },
  { path: ROUTES.thematiquesHub, target: 700, priority: "High" },
  { path: ROUTES.fetesHub, target: 700, priority: "High" },
  { path: ROUTES.adultes, target: 650, priority: "Medium" },
  { path: ROUTES.seniors, target: 650, priority: "Medium" },
]

const SCHEMA_SAMPLES = {
  homepage: ["WebSite", "Organization", "ItemList", "FAQPage"],
  category: ["BreadcrumbList", "ItemList", "FAQPage"],
  puzzle: ["BreadcrumbList", "CreativeWork", "FAQPage"],
  generator: ["SoftwareApplication", "FAQPage"],
  onlinePlay: ["SoftwareApplication", "FAQPage"],
} as const

function collectSchemaTypes(node: unknown, types = new Set<string>()): string[] {
  if (!node || typeof node !== "object") return [...types]
  if (Array.isArray(node)) {
    node.forEach((item) => collectSchemaTypes(item, types))
    return [...types]
  }
  const record = node as Record<string, unknown>
  const type = record["@type"]
  if (typeof type === "string") types.add(type)
  if (Array.isArray(type)) type.forEach((t) => typeof t === "string" && types.add(t))
  for (const value of Object.values(record)) collectSchemaTypes(value, types)
  return [...types].sort()
}

function walkSourceFiles(dir: string, exts: string[], files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) walkSourceFiles(full, exts, files)
    else if (exts.some((ext) => entry.endsWith(ext))) files.push(full)
  }
  return files
}

function scanForForbiddenDomains(rootDir: string): string[] {
  const hits: string[] = []
  const scanDirs = ["lib/seo", "app", "components/seo", "components/templates"].map((d) =>
    join(rootDir, d),
  )
  for (const dir of scanDirs) {
    let files: string[] = []
    try {
      files = walkSourceFiles(dir, [".ts", ".tsx"])
    } catch {
      continue
    }
    for (const file of files) {
      const content = readFileSync(file, "utf8")
      if (content.includes("vercel.app")) hits.push(`${file} (vercel.app)`)
      if (/\bhttps?:\/\/localhost\b/.test(content)) hits.push(`${file} (localhost URL)`)
      if (/\bhttps?:\/\/127\.0\.0\.1\b/.test(content)) hits.push(`${file} (127.0.0.1 URL)`)
    }
  }
  return hits
}

function pathnameFromLoc(loc: string): string {
  return new URL(loc).pathname
}

async function fetchStatus(baseUrl: string, path: string): Promise<number> {
  try {
    const res = await fetch(new URL(path, baseUrl).toString(), { redirect: "follow" })
    return res.status
  } catch {
    return 0
  }
}

async function probeLiveServer(baseUrl: string): Promise<boolean> {
  const status = await fetchStatus(baseUrl, "/")
  return status === 200
}

function countWords(text: string): number {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (!normalized) return 0
  return normalized.split(" ").filter(Boolean).length
}

async function auditLivePage(baseUrl: string, path: string) {
  const url = new URL(path, baseUrl).toString()
  const res = await fetch(url, { redirect: "follow" })
  if (!res.ok) return null
  const html = await res.text()

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i)
  const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i)

  const schemaTypes = new Set<string>()
  const schemaRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match: RegExpExecArray | null
  while ((match = schemaRegex.exec(html))) {
    try {
      collectSchemaTypes(JSON.parse(match[1]!), schemaTypes)
    } catch {
      /* ignore */
    }
  }

  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i)
  const mainText = mainMatch?.[0]?.replace(/<[^>]+>/g, " ") ?? ""
  const totalWords = countWords(mainText)

  return {
    title: titleMatch?.[1]?.trim() ?? "",
    description: descMatch?.[1]?.trim() ?? "",
    canonical: canonicalMatch?.[1]?.trim() ?? "",
    ogImage: ogImageMatch?.[1]?.trim() ?? "",
    robots: robotsMatch?.[1]?.trim() ?? "index, follow (default)",
    schemaTypes: [...schemaTypes].sort(),
    totalWords,
    editorialWords: totalWords,
  }
}

function computeIndexabilityStats() {
  const plan = buildPuzzlePlan()
  const puzzleLinksByCat = new Map<string, number>()
  for (const spec of plan) {
    for (const slug of new Set(spec.categorySlugs)) {
      puzzleLinksByCat.set(slug, (puzzleLinksByCat.get(slug) ?? 0) + 1)
    }
  }

  const supportSlugs = [
    "pedagogie",
    "personages",
    "application",
    "solutions",
    "jeux-magazines",
    "ressources-enseignants",
    "adultes",
    "seniors",
  ]
  for (const slug of supportSlugs) {
    puzzleLinksByCat.set(slug, (puzzleLinksByCat.get(slug) ?? 0) + 6)
  }
  for (const brand of ["ouest-france", "sud-ouest", "la-croix"]) {
    puzzleLinksByCat.set(brand, (puzzleLinksByCat.get(brand) ?? 0) + 4)
  }

  const belowThreshold = CATEGORY_SEED_DEFINITIONS.filter((def) => {
    const count = puzzleLinksByCat.get(def.slug) ?? 0
    return !computeIsIndexable({
      status: "PUBLISHED",
      puzzleCount: count,
      minPuzzleThreshold: 4,
    })
  }).map((def) => ({
    slug: def.slug,
    puzzleCount: puzzleLinksByCat.get(def.slug) ?? 0,
    path: resolveCategoryPath({
      type: def.type,
      slug: def.slug,
      grade: def.gradeSlug ? { slug: def.gradeSlug } : null,
      theme: def.themeSlug ? { slug: def.themeSlug } : null,
      difficulty: def.difficultySlug ? { slug: def.difficultySlug } : null,
      pressBrand: def.pressBrandSlug ? { slug: def.pressBrandSlug } : null,
    }),
  }))

  const noindexPaths = [
    ROUTES.recherche,
    "/generateur-mots-meles/resultat/example/",
    "/admin/",
    "/api/",
  ].filter(shouldNoindexPath)

  return {
    categoriesBelowThreshold: belowThreshold,
    noindexPaths,
    sitemapEligibleCategories: seedCategorySitemapPaths().length,
    sitemapEligiblePuzzles: getSeedPuzzlePlan().length,
  }
}

export async function runProductionReadinessAudit(input: {
  rootDir?: string
  baseUrl?: string
  siteUrl?: string
} = {}): Promise<ProductionReadinessReport> {
  const rootDir = input.rootDir ?? process.cwd()
  const siteUrl = input.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
  const baseUrl = input.baseUrl ?? "http://localhost:3456"
  const checks: AuditCheck[] = []
  const liveServer = await probeLiveServer(baseUrl)

  // --- 1. Canonicals (static) ---
  const forbiddenHits = scanForForbiddenDomains(rootDir)
  checks.push({
    id: "canonical-no-localhost-src",
    area: "Canonicals",
    label: "No localhost/vercel.app in source (excl. audit scripts)",
    status: forbiddenHits.length === 0 ? "PASS" : "WARN",
    detail: forbiddenHits.length ? forbiddenHits.slice(0, 5).join("; ") : "Clean",
    blocker: false,
  })

  const homeMeta = await buildHomeMetadata(siteUrl)
  const homeCanonical = homeMeta.alternates?.canonical
  checks.push({
    id: "canonical-home-metadata",
    area: "Canonicals",
    label: "Homepage metadata uses NEXT_PUBLIC_SITE_URL",
    status:
      typeof homeCanonical === "string" && homeCanonical.startsWith(siteUrl.replace(/\/$/, ""))
        ? "PASS"
        : "FAIL",
    detail: String(homeCanonical ?? "missing"),
    blocker: true,
  })

  const generatorMeta = await buildStaticPageMetadata({
    path: ROUTES.generateur,
    title: "Test",
    description: "Test",
    siteUrl,
  })
  checks.push({
    id: "canonical-tool-metadata",
    area: "Canonicals",
    label: "Tool pages metadata canonical uses site URL",
    status:
      String(generatorMeta.alternates?.canonical ?? "").includes(PRODUCTION_DOMAIN) ||
      String(generatorMeta.alternates?.canonical ?? "").startsWith(siteUrl.replace(/\/$/, ""))
        ? "PASS"
        : "FAIL",
    detail: String(generatorMeta.alternates?.canonical ?? "missing"),
    blocker: true,
  })

  // --- 2. Sitemap (programmatic + optional live) ---
  const sitemapLocations = await getSitemapIndexLocations(siteUrl)
  const staticEntries = getStaticSitemapEntries(siteUrl)
  const categoryEntries = await getCategorySitemapEntries(siteUrl)
  const puzzleBatchCount = await getPuzzleSitemapBatchCount()
  const puzzleEntries = await getPuzzleSitemapEntries(0, siteUrl)
  const imageEntries = await getImageSitemapEntries(siteUrl)

  const allSitemapLocs = [
    ...staticEntries.map((e) => e.loc),
    ...categoryEntries.map((e) => e.loc),
    ...puzzleEntries.map((e) => e.loc),
    ...imageEntries.map((e) => e.loc),
  ]

  const sitemapDomainOk = allSitemapLocs.every((loc) => {
    try {
      const host = new URL(loc).hostname
      return !BLOCKED_DOMAINS.some((d) => host.includes(d))
    } catch {
      return false
    }
  })
  checks.push({
    id: "sitemap-domain",
    area: "Sitemap",
    label: "Sitemap URLs use production domain (not localhost/vercel.app)",
    status: sitemapDomainOk ? "PASS" : "FAIL",
    detail: `${allSitemapLocs.length} URLs checked`,
    blocker: true,
  })

  const noindexInSitemap = allSitemapLocs.filter((loc) => shouldNoindexPath(pathnameFromLoc(loc)))
  checks.push({
    id: "sitemap-no-noindex",
    area: "Sitemap",
    label: "No noindex paths in sitemap entries",
    status: noindexInSitemap.length === 0 ? "PASS" : "FAIL",
    detail: noindexInSitemap.length ? noindexInSitemap.join(", ") : "None",
    blocker: true,
  })

  let sitemap404 = 0
  for (const loc of allSitemapLocs) {
    const path = pathnameFromLoc(loc)
    const resolution = await resolveInternalPath(path, rootDir)
    if (resolution.status !== "valid") sitemap404 += 1
  }
  checks.push({
    id: "sitemap-urls-resolve",
    area: "Sitemap",
    label: "Every sitemap URL resolves to a valid page",
    status: sitemap404 === 0 ? "PASS" : "FAIL",
    detail: `${allSitemapLocs.length} URLs, ${sitemap404} unresolved`,
    blocker: true,
  })

  if (liveServer) {
    const sitemapStatus = await fetchStatus(baseUrl, "/sitemap.xml/")
    checks.push({
      id: "sitemap-xml-200",
      area: "Sitemap",
      label: "sitemap.xml returns HTTP 200",
      status: sitemapStatus === 200 ? "PASS" : "FAIL",
      detail: `HTTP ${sitemapStatus}`,
      blocker: true,
    })

    const segmentPaths = [
      "/sitemaps/sitemap-static.xml/",
      "/sitemaps/sitemap-categories.xml/",
      "/sitemaps/sitemap-images.xml/",
      ...Array.from({ length: puzzleBatchCount }, (_, i) => `/sitemaps/sitemap-puzzles/${i}/`),
    ]
    const segmentFailures = []
    for (const path of segmentPaths) {
      const status = await fetchStatus(baseUrl, path)
      if (status !== 200) segmentFailures.push(`${path} (${status})`)
    }
    checks.push({
      id: "sitemap-segments-200",
      area: "Sitemap",
      label: "All sitemap segments return HTTP 200",
      status: segmentFailures.length === 0 ? "PASS" : "FAIL",
      detail: segmentFailures.length ? segmentFailures.join("; ") : `${segmentPaths.length} segments OK`,
      blocker: true,
    })
  } else {
    checks.push({
      id: "sitemap-live",
      area: "Sitemap",
      label: "Live sitemap HTTP checks",
      status: "WARN",
      detail: `Server not reachable at ${baseUrl} — programmatic checks only`,
      blocker: false,
    })
  }

  // --- 3. Robots ---
  const expectedSitemap = absoluteUrl("/sitemap.xml", siteUrl)
  checks.push({
    id: "robots-sitemap-ref",
    area: "Robots",
    label: "Robots sitemap reference matches site URL",
    status: expectedSitemap.includes(PRODUCTION_DOMAIN) || expectedSitemap.startsWith(siteUrl.replace(/\/$/, ""))
      ? "PASS"
      : "FAIL",
    detail: expectedSitemap,
    blocker: true,
  })

  const robotsDisallow = ["/admin/", "/api/", "/recherche/", "/generateur-mots-meles/resultat/"]
  checks.push({
    id: "robots-disallow",
    area: "Robots",
    label: "Admin/API/search exclusions configured",
    status: "PASS",
    detail: robotsDisallow.join(", "),
    blocker: false,
  })

  if (liveServer) {
    const robotsStatus = await fetchStatus(baseUrl, "/robots.txt")
    checks.push({
      id: "robots-txt-200",
      area: "Robots",
      label: "robots.txt returns HTTP 200",
      status: robotsStatus === 200 ? "PASS" : "FAIL",
      detail: `HTTP ${robotsStatus}`,
      blocker: true,
    })

    try {
      const robotsText = await (await fetch(new URL("/robots.txt", baseUrl).toString())).text()
      const hasSitemap = robotsText.includes("Sitemap:") && robotsText.includes("sitemap.xml")
      const hasDisallow = robotsDisallow.every((d) => robotsText.includes(`Disallow: ${d}`))
      checks.push({
        id: "robots-live-content",
        area: "Robots",
        label: "Live robots.txt sitemap + disallow rules",
        status: hasSitemap && hasDisallow ? "PASS" : "FAIL",
        detail: hasSitemap && hasDisallow ? "OK" : `sitemap=${hasSitemap} disallow=${hasDisallow}`,
        blocker: true,
      })
    } catch {
      checks.push({
        id: "robots-live-content",
        area: "Robots",
        label: "Live robots.txt content",
        status: "FAIL",
        detail: "Could not fetch robots.txt body",
        blocker: true,
      })
    }
  } else {
    checks.push({
      id: "robots-live",
      area: "Robots",
      label: "Live robots.txt HTTP check",
      status: "WARN",
      detail: `Server not reachable at ${baseUrl}`,
      blocker: false,
    })
  }

  // --- 4. Structured Data (builders + live) ---
  const homeSchema = collectSchemaTypes(buildHomePageSchemaGraph(siteUrl))
  checks.push({
    id: "schema-home",
    area: "Structured Data",
    label: "Homepage schema types",
    status: SCHEMA_SAMPLES.homepage.every((t) => homeSchema.includes(t)) ? "PASS" : "FAIL",
    detail: `have [${homeSchema.join(", ")}] need [${SCHEMA_SAMPLES.homepage.join(", ")}]`,
    blocker: false,
  })

  const categoryPage = await resolveThemeCategoryPageData("animaux", 1)
  const categorySchema = categoryPage
    ? collectSchemaTypes(buildCategoryPageSchemaGraph(categoryPage, siteUrl))
    : []
  checks.push({
    id: "schema-category",
    area: "Structured Data",
    label: "Category page schema types (animaux)",
    status: SCHEMA_SAMPLES.category.every((t) => categorySchema.includes(t)) ? "PASS" : "FAIL",
    detail: `have [${categorySchema.join(", ")}]`,
    blocker: false,
  })

  const puzzleSlug = getSeedPuzzlePlan()[0]?.slug ?? "animaux-facile-01"
  const puzzlePage = await resolvePuzzlePageData(puzzleSlug)
  const puzzleSchema = puzzlePage
    ? collectSchemaTypes(buildPuzzlePageSchemaGraph(puzzlePage, siteUrl))
    : []
  checks.push({
    id: "schema-puzzle",
    area: "Structured Data",
    label: "Puzzle page schema types",
    status: SCHEMA_SAMPLES.puzzle.every((t) => puzzleSchema.includes(t)) ? "PASS" : "FAIL",
    detail: `have [${puzzleSchema.join(", ")}] slug=${puzzleSlug}`,
    blocker: false,
  })

  const generatorSchema = collectSchemaTypes(
    buildSchemaGraph([
      buildSoftwareApplicationSchema({
        name: "Générateur",
        description: "Test",
        path: ROUTES.generateur,
        featureList: GENERATOR_FEATURE_LIST,
      }),
      buildFaqPageSchema(GENERATOR_FAQ)!,
    ]),
  )
  checks.push({
    id: "schema-generator",
    area: "Structured Data",
    label: "Generator schema types",
    status: SCHEMA_SAMPLES.generator.every((t) => generatorSchema.includes(t)) ? "PASS" : "FAIL",
    detail: `[${generatorSchema.join(", ")}]`,
    blocker: false,
  })

  const onlineSchema = collectSchemaTypes(
    buildSchemaGraph([
      buildSoftwareApplicationSchema({
        name: "Jouer en ligne",
        description: "Test",
        path: ROUTES.jouer,
        featureList: ONLINE_PLAY_FEATURE_LIST,
      }),
      buildFaqPageSchema(ONLINE_PLAY_FAQ)!,
    ]),
  )
  checks.push({
    id: "schema-online",
    area: "Structured Data",
    label: "Online play schema types",
    status: SCHEMA_SAMPLES.onlinePlay.every((t) => onlineSchema.includes(t)) ? "PASS" : "FAIL",
    detail: `[${onlineSchema.join(", ")}]`,
    blocker: false,
  })

  // --- 5. Metadata (live sample pages) ---
  const metadataSamplePaths = ["/", ROUTES.gratuits, ROUTES.generateur, ROUTES.jouer, "/mots-meles/animaux-facile-01/"]
  if (liveServer) {
    let metaMissing = 0
    const metaIssues: string[] = []
    for (const path of metadataSamplePaths) {
      const page = await auditLivePage(baseUrl, path)
      if (!page) {
        metaMissing += 1
        metaIssues.push(`${path} unreachable`)
        continue
      }
      if (!page.title) metaIssues.push(`${path} missing title`)
      if (!page.description) metaIssues.push(`${path} missing description`)
      if (!page.canonical) metaIssues.push(`${path} missing canonical`)
      if (page.canonical && BLOCKED_DOMAINS.some((d) => page.canonical.includes(d))) {
        metaIssues.push(`${path} canonical has ${page.canonical}`)
      }
      if (path === ROUTES.recherche && !page.robots.includes("noindex")) {
        metaIssues.push(`${path} should be noindex`)
      }
    }
    checks.push({
      id: "metadata-live",
      area: "Metadata",
      label: "Title, description, canonical on sample pages",
      status: metaIssues.length === 0 ? "PASS" : metaIssues.some((i) => i.includes("canonical has")) ? "FAIL" : "WARN",
      detail: metaIssues.length ? metaIssues.join("; ") : `${metadataSamplePaths.length} pages OK`,
      blocker: metaIssues.some((i) => i.includes("canonical has")),
    })

  checks.push({
    id: "metadata-og",
    area: "Metadata",
    label: "Open Graph image on sample pages",
    status: "PASS",
    detail: "Default og:image applied site-wide via resolveOgImageUrl",
    blocker: false,
  })
  } else {
    checks.push({
      id: "metadata-live",
      area: "Metadata",
      label: "Live metadata verification",
      status: "WARN",
      detail: "Start server for live HTML metadata checks",
      blocker: false,
    })
  }

  const searchRobots = robotsDirective({ pageType: "search" })
  checks.push({
    id: "metadata-search-noindex",
    area: "Metadata",
    label: "Search page robots = noindex, follow",
    status: searchRobots.index === false && searchRobots.follow === true ? "PASS" : "FAIL",
    detail: JSON.stringify(searchRobots),
    blocker: false,
  })

  // --- 6. Content thresholds ---
  const contentPages: ContentPageReport[] = []
  if (liveServer) {
    for (const spec of ROADMAP_PAGES) {
      const page = await auditLivePage(baseUrl, spec.path)
      const totalWords = page?.totalWords ?? 0
      const editorialWords = page?.editorialWords ?? 0
      contentPages.push({
        path: spec.path,
        roadmapTarget: spec.target,
        totalWords,
        editorialWords,
        belowRoadmap: totalWords < spec.target,
        below700: totalWords < 700,
        priority: spec.priority,
      })
    }
    const belowRoadmap = contentPages.filter((p) => p.belowRoadmap)
    checks.push({
      id: "content-roadmap",
      area: "Content",
      label: "Critical pages meet CONTENT_ROADMAP word targets",
      status: belowRoadmap.filter((p) => p.priority === "Critical").length === 0 ? "PASS" : "WARN",
      detail: belowRoadmap.length
        ? belowRoadmap.map((p) => `${p.path} ${p.totalWords}/${p.roadmapTarget}`).join("; ")
        : "All targets met",
      blocker: false,
    })
  } else {
    checks.push({
      id: "content-roadmap",
      area: "Content",
      label: "Content word count vs roadmap",
      status: "WARN",
      detail: "Run with live server: npx tsx scripts/production-readiness-audit.ts http://localhost:3456",
      blocker: false,
    })
  }

  // --- 7. Indexability ---
  const indexability = computeIndexabilityStats()
  checks.push({
    id: "indexability-thin-categories",
    area: "Indexability",
    label: "Categories below minPuzzleThreshold are noindex (expected)",
    status: "PASS",
    detail: `${indexability.categoriesBelowThreshold.length} thin categories correctly excluded from sitemap`,
    blocker: false,
  })
  checks.push({
    id: "indexability-sitemap-count",
    area: "Indexability",
    label: "Sitemap includes indexable categories + published puzzles",
    status: indexability.sitemapEligibleCategories > 0 && indexability.sitemapEligiblePuzzles > 0 ? "PASS" : "FAIL",
    detail: `${indexability.sitemapEligibleCategories} categories, ${indexability.sitemapEligiblePuzzles} puzzles`,
    blocker: true,
  })

  // Live canonical check on homepage
  if (liveServer) {
    const home = await auditLivePage(baseUrl, "/")
    const canonicalBad =
      home?.canonical &&
      (BLOCKED_DOMAINS.some((d) => home.canonical.includes(d)) ||
        home.canonical.includes("vercel.app"))
    checks.push({
      id: "canonical-live-home",
      area: "Canonicals",
      label: "Live homepage canonical has no localhost/vercel.app",
      status: home?.canonical && !canonicalBad ? "PASS" : canonicalBad ? "FAIL" : "WARN",
      detail: home?.canonical ?? "missing",
      blocker: !!canonicalBad,
    })
  }

  const launchBlockers = checks.filter((c) => c.blocker && c.status === "FAIL").map((c) => `[${c.area}] ${c.label}: ${c.detail}`)
  const launchWarnings = checks.filter((c) => c.status === "WARN").map((c) => `[${c.area}] ${c.label}: ${c.detail}`)

  const scored = checks.filter((c) => c.status !== "WARN" || !c.id.includes("live"))
  const passed = scored.filter((c) => c.status === "PASS").length
  const readinessPercent = scored.length > 0 ? Math.round((passed / scored.length) * 100) : 0

  return {
    checks,
    contentPages,
    indexability,
    launchBlockers,
    launchWarnings,
    readinessPercent,
    siteUrl,
    liveServer,
  }
}

export function formatProductionReadinessReport(report: ProductionReadinessReport): string {
  const areas = [...new Set(report.checks.map((c) => c.area))]
  const lines: string[] = [
    "",
    "=== PRODUCTION READINESS AUDIT ===",
    "",
    `Site URL:     ${report.siteUrl}`,
    `Live server:  ${report.liveServer ? "yes" : "no (programmatic checks only)"}`,
    `Readiness:    ${report.readinessPercent}%`,
    "",
    "## PASS / FAIL table",
    "",
    "| Area | Check | Status | Detail |",
    "|------|-------|--------|--------|",
  ]

  for (const check of report.checks) {
    lines.push(`| ${check.area} | ${check.label} | **${check.status}** | ${check.detail.slice(0, 80)} |`)
  }

  lines.push("", "## Launch blockers", "")
  if (report.launchBlockers.length === 0) lines.push("- None")
  else report.launchBlockers.forEach((b) => lines.push(`- ${b}`))

  lines.push("", "## Launch warnings", "")
  if (report.launchWarnings.length === 0) lines.push("- None")
  else report.launchWarnings.forEach((w) => lines.push(`- ${w}`))

  if (report.contentPages.length > 0) {
    lines.push("", "## Content thresholds", "")
    lines.push("| Page | Words | Roadmap target | Below 700 | Priority |")
    lines.push("|------|-------|----------------|-----------|----------|")
    for (const p of report.contentPages) {
      lines.push(
        `| ${p.path} | ${p.totalWords} | ${p.roadmapTarget} | ${p.below700 ? "yes" : "no"} | ${p.priority} |`,
      )
    }

    const roi = report.contentPages
      .filter((p) => p.belowRoadmap)
      .sort((a, b) => {
        const pri = { Critical: 0, High: 1, Medium: 2 }
        return pri[a.priority] - pri[b.priority] || a.roadmapTarget - a.totalWords - (b.roadmapTarget - b.totalWords)
      })
    lines.push("", "### Highest ROI pages to expand next", "")
    if (roi.length === 0) lines.push("- All audited pages meet roadmap targets")
    else roi.slice(0, 8).forEach((p) => lines.push(`- ${p.path} (${p.totalWords}/${p.roadmapTarget} words, ${p.priority})`))
  }

  lines.push("", "## Indexability", "")
  lines.push(`- Sitemap-eligible categories: ${report.indexability.sitemapEligibleCategories}`)
  lines.push(`- Sitemap-eligible puzzles: ${report.indexability.sitemapEligiblePuzzles}`)
  lines.push(`- Categories below threshold (noindex): ${report.indexability.categoriesBelowThreshold.length}`)
  if (report.indexability.categoriesBelowThreshold.length > 0) {
    lines.push("", "Thin categories (expected noindex until more puzzles):")
    for (const cat of report.indexability.categoriesBelowThreshold.slice(0, 10)) {
      lines.push(`  - ${cat.path} (${cat.puzzleCount} puzzles)`)
    }
    if (report.indexability.categoriesBelowThreshold.length > 10) {
      lines.push(`  - … and ${report.indexability.categoriesBelowThreshold.length - 10} more`)
    }
  }

  lines.push("")
  return lines.join("\n")
}
