import { collectAllInternalLinks, type InternalLinkRef, type InternalLinkSection } from "@/lib/audit/collect-internal-links"
import { auditRenderedPuzzleLinks } from "@/lib/audit/puzzle-links"
import {
  normalizeInternalHref,
  resolveInternalPath,
  type InternalLinkStatus,
} from "@/lib/audit/resolve-internal-path"
import { validateLinkGraph, type LinkGraphReport } from "@/lib/seo/link-graph/validate"

export type BrokenInternalLink = InternalLinkRef & {
  status: InternalLinkStatus
}

export type SectionLinkStats = {
  total: number
  valid: number
  redirect: number
  notFound: number
}

export type InternalLinkAuditReport = {
  totalChecked: number
  uniquePaths: number
  valid: number
  redirects: number
  notFound: number
  brokenLinks: BrokenInternalLink[]
  bySection: Record<InternalLinkSection, SectionLinkStats>
  puzzleLinks: {
    total: number
    unresolved: number
    missingSeed: number
  }
  sitemapLinks: {
    total: number
    notFound: number
  }
  graph: LinkGraphReport
  ok: boolean
}

function emptySectionStats(): Record<InternalLinkSection, SectionLinkStats> {
  return {
    navigation: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    footer: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    homepage: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    "category-hub": { total: 0, valid: 0, redirect: 0, notFound: 0 },
    grade: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    theme: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    seasonal: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    difficulty: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    combo: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    press: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    audience: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    "static-support": { total: 0, valid: 0, redirect: 0, notFound: 0 },
    puzzle: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    tool: { total: 0, valid: 0, redirect: 0, notFound: 0 },
    sitemap: { total: 0, valid: 0, redirect: 0, notFound: 0 },
  }
}

export async function runInternalLinkAudit(
  rootDir = process.cwd(),
): Promise<InternalLinkAuditReport> {
  const [links, puzzleAudit, graph] = await Promise.all([
    collectAllInternalLinks(),
    auditRenderedPuzzleLinks(),
    validateLinkGraph(),
  ])

  const bySection = emptySectionStats()
  const brokenLinks: BrokenInternalLink[] = []
  const pathStatuses = new Map<string, InternalLinkStatus>()
  let valid = 0
  let redirects = 0
  let notFound = 0

  for (const ref of links) {
    let status = pathStatuses.get(ref.path)
    if (!status) {
      const resolution = await resolveInternalPath(ref.href, rootDir)
      status = resolution.status
      pathStatuses.set(ref.path, status)
    }

    const sectionStats = bySection[ref.section]
    sectionStats.total += 1

    if (status === "valid") {
      valid += 1
      sectionStats.valid += 1
    } else if (status === "redirect") {
      redirects += 1
      sectionStats.redirect += 1
    } else {
      notFound += 1
      sectionStats.notFound += 1
      brokenLinks.push({ ...ref, status })
    }
  }

  const sitemapLinks = links.filter((link) => link.section === "sitemap")
  const uniquePaths = new Set(links.map((link) => link.path)).size

  const report: InternalLinkAuditReport = {
    totalChecked: links.length,
    uniquePaths,
    valid,
    redirects,
    notFound,
    brokenLinks,
    bySection,
    puzzleLinks: {
      total: puzzleAudit.records.length,
      unresolved: puzzleAudit.unresolved.length,
      missingSeed: puzzleAudit.missingSeed.length,
    },
    sitemapLinks: {
      total: sitemapLinks.length,
      notFound: brokenLinks.filter((link) => link.section === "sitemap").length,
    },
    graph,
    ok:
      notFound === 0 &&
      graph.orphanCount === 0 &&
      puzzleAudit.unresolved.length === 0 &&
      puzzleAudit.missingSeed.length === 0,
  }

  return report
}

export function formatInternalLinkAuditReport(report: InternalLinkAuditReport): string {
  const lines: string[] = [
    "",
    "=== INTERNAL LINK INTEGRITY AUDIT ===",
    "",
    `Total links checked: ${report.totalChecked}`,
    `Unique paths:        ${report.uniquePaths}`,
    `Valid:               ${report.valid}`,
    `Redirects:           ${report.redirects}`,
    `404 / not found:     ${report.notFound}`,
    `Orphan pages:        ${report.graph.orphanCount}`,
    "",
    "--- Puzzle links ---",
    `Rendered puzzle links: ${report.puzzleLinks.total}`,
    `Unresolved puzzles:    ${report.puzzleLinks.unresolved}`,
    `Missing seed slugs:    ${report.puzzleLinks.missingSeed}`,
    "",
    "--- Sitemap URLs ---",
    `Sitemap links checked: ${report.sitemapLinks.total}`,
    `Sitemap 404s:          ${report.sitemapLinks.notFound}`,
    "",
    "--- By section ---",
  ]

  for (const [section, stats] of Object.entries(report.bySection)) {
    if (stats.total === 0) continue
    lines.push(
      `  ${section.padEnd(16)} total=${stats.total} valid=${stats.valid} 404=${stats.notFound}`,
    )
  }

  if (report.brokenLinks.length > 0) {
    lines.push("", "--- Broken links ---")
    for (const link of report.brokenLinks) {
      lines.push(`  404  ${normalizeInternalHref(link.href)}  <- ${link.source}`)
    }
  }

  if (report.graph.orphans.length > 0) {
    lines.push("", "--- Orphan pages ---")
    for (const orphan of report.graph.orphans) {
      lines.push(`  orphan  ${orphan.path}`)
    }
  }

  lines.push("", report.ok ? "RESULT: PASS" : "RESULT: FAIL", "")
  return lines.join("\n")
}
