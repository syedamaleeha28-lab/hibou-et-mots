/**
 * Live content audit against local Next.js build.
 * Usage: npx tsx scripts/live-content-audit.ts [baseUrl]
 */

import * as cheerio from "cheerio"

const BASE_URL = process.argv[2] ?? "http://localhost:3456"

type PageSpec = {
  path: string
  wordTarget: number
  faqTarget: number
  internalLinkTarget: number
  schemaTarget: string[]
  phase1Markers: string[]
  phase2Markers: string[]
}

const PAGES: PageSpec[] = [
  {
    path: "/",
    wordTarget: 750,
    faqTarget: 4,
    internalLinkTarget: 7,
    schemaTarget: ["WebSite", "Organization", "ItemList", "FAQPage"],
    phase1Markers: [
      "Pourquoi les mots mêlés aident à apprendre",
      "Comment choisir la bonne grille",
    ],
    phase2Markers: [],
  },
  {
    path: "/mots-meles-gratuits/",
    wordTarget: 800,
    faqTarget: 4,
    internalLinkTarget: 5,
    schemaTarget: ["BreadcrumbList", "ItemList", "FAQPage"],
    phase1Markers: ["Trois façons d'utiliser Hibou&Mots gratuitement"],
    phase2Markers: ["Pourquoi choisir des mots mêlés gratuits"],
  },
  {
    path: "/mots-meles-enfants/",
    wordTarget: 700,
    faqTarget: 3,
    internalLinkTarget: 3,
    schemaTarget: ["BreadcrumbList", "ItemList", "FAQPage"],
    phase1Markers: ["Quelle grille pour quel âge"],
    phase2Markers: ["Les bienfaits des mots mêlés pour l'apprentissage"],
  },
  {
    path: "/mots-meles-a-imprimer/",
    wordTarget: 750,
    faqTarget: 3,
    internalLinkTarget: 3,
    schemaTarget: ["BreadcrumbList", "ItemList", "FAQPage"],
    phase1Markers: ["Imprimer par thème ou par niveau"],
    phase2Markers: ["Cahiers de mots mêlés thématiques à imprimer"],
  },
  {
    path: "/mots-meles-ecole/",
    wordTarget: 750,
    faqTarget: 3,
    internalLinkTarget: 9,
    schemaTarget: ["BreadcrumbList", "ItemList", "FAQPage"],
    phase1Markers: ["Les 7 niveaux en un coup d'œil"],
    phase2Markers: ["Des grilles alignées sur les cycles scolaires"],
  },
  {
    path: "/generateur-mots-meles/",
    wordTarget: 600,
    faqTarget: 3,
    internalLinkTarget: 3,
    schemaTarget: ["FAQPage"],
    phase1Markers: ["Pour qui est fait ce générateur", "Conseils pour une bonne grille"],
    phase2Markers: [],
  },
  {
    path: "/jouer-mots-meles-en-ligne/",
    wordTarget: 600,
    faqTarget: 3,
    internalLinkTarget: 3,
    schemaTarget: ["FAQPage"],
    phase1Markers: ["Comment jouer en 3 étapes", "En ligne ou à imprimer"],
    phase2Markers: [],
  },
]

const EDITORIAL_EXCLUDE_HEADINGS = [
  "Mots mêlés à jouer et imprimer",
  "Questions fréquentes",
  "Comment jouer aux mots mêlés",
  "Choisir un niveau scolaire",
  "Sous-catégories",
  "Catégories associées",
  "Les puzzles les plus populaires",
  "Explore nos catégories",
  "Un niveau pour chaque enfant",
  "PDF prêts à imprimer",
  "Générateur de mots mêlés",
  "Créer une grille",
]

function normalizeText(text: string): string {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function countWords(text: string): number {
  const normalized = normalizeText(text)
  if (!normalized) return 0
  return normalized.split(" ").filter(Boolean).length
}

function collectSchemaTypes(schemas: unknown[]): string[] {
  const types = new Set<string>()

  function walk(node: unknown) {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    const record = node as Record<string, unknown>
    const type = record["@type"]
    if (typeof type === "string") types.add(type)
    if (Array.isArray(type)) type.forEach((t) => typeof t === "string" && types.add(t))
    for (const value of Object.values(record)) walk(value)
  }

  schemas.forEach(walk)
  return [...types].sort()
}

function sectionHeading($section: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string {
  const heading = $section.find("h1, h2, h3").first().text()
  return normalizeText(heading)
}

function isExcludedSection(heading: string): boolean {
  return EDITORIAL_EXCLUDE_HEADINGS.some((needle) =>
    heading.toLowerCase().includes(needle.toLowerCase()),
  )
}

function extractVisibleText($: cheerio.CheerioAPI, root: cheerio.Cheerio<cheerio.Element>): string {
  const clone = root.clone()
  clone.find("script, style, noscript, svg").remove()
  return normalizeText(clone.text())
}

function analyzeMain($: cheerio.CheerioAPI) {
  const main = $("main").first()
  if (!main.length) throw new Error("<main> not found")

  main.find('nav[aria-label="Fil d\'Ariane"]').remove()

  const totalWords = countWords(extractVisibleText($, main))

  const editorialRoot = main.clone()
  editorialRoot.find('nav[aria-label="Fil d\'Ariane"]').remove()
  editorialRoot.find("section").each((_, el) => {
    const $section = $(el)
    if (isExcludedSection(sectionHeading($section, $))) {
      $section.remove()
    }
  })
  const editorialWords = countWords(extractVisibleText($, editorialRoot))

  const faqCount = main.find('section:has(h2:contains("Questions fréquentes")) details').length

  const internalLinks = new Set<string>()
  main.find('a[href^="/"]').each((_, el) => {
    const href = $(el).attr("href")
    if (!href || href.startsWith("//")) return
    const pathOnly = href.split("#")[0]?.split("?")[0] ?? href
    if (pathOnly && pathOnly.startsWith("/")) internalLinks.add(pathOnly.endsWith("/") ? pathOnly : `${pathOnly}/`)
  })

  return { totalWords, editorialWords, faqCount, internalLinks: [...internalLinks].sort() }
}

function markerStatus(mainText: string, markers: string[]): string {
  if (markers.length === 0) return "n/a"
  const hits = markers.filter((marker) => mainText.includes(marker))
  if (hits.length === markers.length) return "yes"
  if (hits.length === 0) return "no"
  return `partial (${hits.length}/${markers.length})`
}

async function checkLink(baseUrl: string, path: string): Promise<number> {
  const url = new URL(path, baseUrl).toString()
  try {
    const res = await fetch(url, { redirect: "follow" })
    return res.status
  } catch {
    return 0
  }
}

async function auditPage(spec: PageSpec) {
  const url = new URL(spec.path, BASE_URL).toString()
  const res = await fetch(url, { redirect: "follow" })
  if (!res.ok) {
    return {
      ...spec,
      status: res.status,
      error: `HTTP ${res.status}`,
    }
  }

  const html = await res.text()
  const $ = cheerio.load(html)
  const { totalWords, editorialWords, faqCount, internalLinks } = analyzeMain($)

  const mainText = normalizeText($("main").first().text())
  const phase1 = markerStatus(mainText, spec.phase1Markers)
  const phase2 = markerStatus(mainText, spec.phase2Markers)

  const schemaBlocks: unknown[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).html()?.trim()
    if (!raw) return
    try {
      schemaBlocks.push(JSON.parse(raw))
    } catch {
      /* ignore malformed blocks */
    }
  })
  const schemaTypes = collectSchemaTypes(schemaBlocks)

  const brokenLinks: string[] = []
  for (const href of internalLinks) {
    const status = await checkLink(BASE_URL, href)
    if (status >= 400 || status === 0) brokenLinks.push(`${href} (${status || "ERR"})`)
  }

  return {
    path: spec.path,
    status: res.status,
    totalWords,
    editorialWords,
    faqCount,
    internalLinkCount: internalLinks.length,
    phase1,
    phase2,
    schemaTypes,
    brokenLinks,
    wordTarget: spec.wordTarget,
    faqTarget: spec.faqTarget,
    internalLinkTarget: spec.internalLinkTarget,
    schemaTarget: spec.schemaTarget,
  }
}

function formatDelta(actual: number, target: number): string {
  const delta = actual - target
  if (delta >= 0) return `+${delta}`
  return `${delta}`
}

function pad(value: string | number, width: number): string {
  return String(value).padEnd(width)
}

async function main() {
  console.log(`Live content audit — ${BASE_URL}\n`)

  const results = []
  for (const spec of PAGES) {
    results.push(await auditPage(spec))
  }

  const failedFetch = results.filter((r) => "error" in r)
  if (failedFetch.length === PAGES.length) {
    console.error(`Could not reach ${BASE_URL}. Start the dev server first (npm run dev -- -p 3456).`)
    process.exit(1)
  }

  console.log("## Summary table (target vs actual)\n")
  console.log(
    "| Page | Words (actual/target Δ) | Editorial | FAQ | Links | Phase 1 | Phase 2 | Schema | Broken links |",
  )
  console.log("|------|-------------------------|-----------|-----|-------|---------|---------|--------|--------------|")

  for (const r of results) {
    if ("error" in r) {
      console.log(`| ${r.path} | ERROR ${r.error} | — | — | — | — | — | — | — |`)
      continue
    }

    const wordsCell = `${r.totalWords}/${r.wordTarget} (${formatDelta(r.totalWords, r.wordTarget)})`
    const editorialCell = `${r.editorialWords}/${r.wordTarget}`
    const faqCell = `${r.faqCount}/${r.faqTarget}`
    const linksCell = `${r.internalLinkCount}/${r.internalLinkTarget}`
    const schemaCell = `${r.schemaTypes.join(", ") || "—"}`
    const brokenCell = r.brokenLinks.length ? r.brokenLinks.join("; ") : "none"

    console.log(
      `| ${r.path} | ${wordsCell} | ${editorialCell} | ${faqCell} | ${linksCell} | ${r.phase1} | ${r.phase2} | ${schemaCell} | ${brokenCell} |`,
    )
  }

  console.log("\n## Schema coverage vs roadmap targets\n")
  for (const r of results) {
    if ("error" in r) continue
    const missing = r.schemaTarget.filter((t) => !r.schemaTypes.includes(t))
    const extra = r.schemaTypes.filter((t) => !r.schemaTarget.includes(t))
    console.log(
      `${r.path} — expected: [${r.schemaTarget.join(", ")}] · missing: [${missing.join(", ") || "none"}] · extra: [${extra.join(", ") || "none"}]`,
    )
  }

  console.log("\n## Notes")
  console.log("- Total words = all visible text inside <main>.")
  console.log("- Editorial = <main> minus puzzle grids, FAQ block, subcategory/related nav, hero widgets, how-to boilerplate.")
  console.log("- Targets from CONTENT_ROADMAP.md (Critical Sprint 1 pages).")
  console.log("- Phase markers detected by distinctive Phase 1/2 section headings in rendered HTML.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
