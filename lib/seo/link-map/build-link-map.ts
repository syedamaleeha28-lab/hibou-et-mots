import type { InternalLinkRef } from "@/lib/audit/collect-internal-links"
import { normalizeInternalHref } from "@/lib/audit/resolve-internal-path"
import { IMPORTANT_PAGE_PATHS, MIN_INBOUND_LINKS } from "./important-pages"

export type InternalLinkMapPage = {
  path: string
  inboundCount: number
  inboundSources: string[]
  isImportant: boolean
  meetsMinimum: boolean
}

export type InternalLinkMapReport = {
  generatedAt: string
  totalTargets: number
  importantPageCount: number
  orphanPages: string[]
  belowMinimum: InternalLinkMapPage[]
  pages: InternalLinkMapPage[]
  pillarSummary: Record<string, number>
}

const PILLAR_PATHS = [
  "/",
  "/generateur-mots-meles/",
  "/jouer-mots-meles-en-ligne/",
  "/mots-meles-gratuits/",
  "/mots-meles-a-imprimer/",
  "/mots-meles-thematiques/",
  "/mots-meles-enfants/",
  "/mots-meles-adultes/",
  "/mots-meles-seniors/",
] as const

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort()
}

/** Build inbound link map from collected internal link refs (excludes sitemap). */
export function buildInternalLinkMap(links: InternalLinkRef[]): InternalLinkMapReport {
  const inbound = new Map<string, { count: number; sources: string[] }>()

  for (const ref of links) {
    if (ref.section === "sitemap") continue

    const entry = inbound.get(ref.path) ?? { count: 0, sources: [] }
    entry.count += 1
    entry.sources.push(ref.source)
    inbound.set(ref.path, entry)
  }

  const importantSet = new Set(IMPORTANT_PAGE_PATHS.map(normalizeInternalHref))
  const pages: InternalLinkMapPage[] = [...inbound.entries()]
    .map(([path, entry]) => ({
      path,
      inboundCount: entry.count,
      inboundSources: uniqueSorted(entry.sources),
      isImportant: importantSet.has(path),
      meetsMinimum: !importantSet.has(path) || entry.count >= MIN_INBOUND_LINKS,
    }))
    .sort((a, b) => a.path.localeCompare(b.path))

  for (const path of IMPORTANT_PAGE_PATHS) {
    const normalized = normalizeInternalHref(path)
    if (!inbound.has(normalized)) {
      pages.push({
        path: normalized,
        inboundCount: 0,
        inboundSources: [],
        isImportant: true,
        meetsMinimum: false,
      })
    }
  }

  pages.sort((a, b) => a.path.localeCompare(b.path))

  const orphanPages = pages
    .filter((page) => page.inboundCount === 0 && page.path !== "/")
    .map((page) => page.path)

  const belowMinimum = pages.filter((page) => page.isImportant && !page.meetsMinimum)

  const pillarSummary: Record<string, number> = {}
  for (const path of PILLAR_PATHS) {
    const normalized = normalizeInternalHref(path)
    pillarSummary[normalized] = inbound.get(normalized)?.count ?? 0
  }

  return {
    generatedAt: new Date().toISOString(),
    totalTargets: pages.length,
    importantPageCount: IMPORTANT_PAGE_PATHS.length,
    orphanPages,
    belowMinimum,
    pages: pages.filter((page) => page.isImportant || page.inboundCount > 0),
    pillarSummary,
  }
}

export function formatInternalLinkMapReport(report: InternalLinkMapReport): string {
  const lines = [
    "",
    "=== INTERNAL LINK MAP ===",
    "",
    `Generated:          ${report.generatedAt}`,
    `Targets tracked:    ${report.totalTargets}`,
    `Important pages:    ${report.importantPageCount} (min ${MIN_INBOUND_LINKS} inbound each)`,
    `Orphan pages:       ${report.orphanPages.length}`,
    `Below minimum:      ${report.belowMinimum.length}`,
    "",
    "--- Pillar inbound counts ---",
  ]

  for (const [path, count] of Object.entries(report.pillarSummary)) {
    lines.push(`  ${path}  inbound=${count}`)
  }

  if (report.belowMinimum.length > 0) {
    lines.push("", "--- Important pages below minimum ---")
    for (const page of report.belowMinimum) {
      lines.push(`  ${page.path}  inbound=${page.inboundCount}`)
    }
  }

  if (report.orphanPages.length > 0) {
    lines.push("", "--- Orphan pages ---")
    for (const path of report.orphanPages) {
      lines.push(`  ${path}`)
    }
  }

  lines.push("")
  return lines.join("\n")
}
