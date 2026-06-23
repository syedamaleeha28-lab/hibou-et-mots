import type { SynonymPageCopy } from "./collect-page-copy"
import { collectSynonymPageCopies } from "./collect-page-copy"
import {
  detectSynonymsInText,
  MIN_SECONDARY_SYNONYMS_DEFAULT,
  MIN_SECONDARY_SYNONYMS_IMPORTANT,
  missingSynonymIds,
  SECONDARY_SYNONYM_IDS,
  synonymLabels,
  type SynonymId,
  WORD_SEARCH_SYNONYMS,
} from "./terms"

export type SynonymCoverageStatus = "complete" | "adequate" | "weak" | "missing"

export type SynonymPageReport = {
  path: string
  slug: string
  isImportant: boolean
  present: SynonymId[]
  missing: SynonymId[]
  secondaryCount: number
  status: SynonymCoverageStatus
}

export type SynonymCoverageReport = {
  generatedAt: string
  auditedPageCount: number
  synonymTotals: Record<SynonymId, number>
  pagesMissingSynonyms: SynonymPageReport[]
  pagesWithWeakCoverage: SynonymPageReport[]
  pages: SynonymPageReport[]
}

function requiredSecondaryCount(isImportant: boolean): number {
  return isImportant ? MIN_SECONDARY_SYNONYMS_IMPORTANT : MIN_SECONDARY_SYNONYMS_DEFAULT
}

export function scoreSynonymCoverage(page: SynonymPageCopy): SynonymPageReport {
  const present = detectSynonymsInText(page.text)
  const missing = missingSynonymIds(present)
  const secondaryCount = present.filter((id) => id !== "mots-meles").length
  const hasPrimary = present.includes("mots-meles")
  const requiredSecondary = requiredSecondaryCount(page.isImportant)

  let status: SynonymCoverageStatus = "complete"
  if (!hasPrimary || secondaryCount === 0) {
    status = "missing"
  } else if (secondaryCount < requiredSecondary - 1) {
    status = "weak"
  } else if (secondaryCount < requiredSecondary) {
    status = "adequate"
  }

  return {
    path: page.path,
    slug: page.slug,
    isImportant: page.isImportant,
    present,
    missing,
    secondaryCount,
    status,
  }
}

export async function buildSynonymCoverageReport(): Promise<SynonymCoverageReport> {
  const copies = await collectSynonymPageCopies()
  const pages = copies.map(scoreSynonymCoverage)

  const synonymTotals = Object.fromEntries(
    WORD_SEARCH_SYNONYMS.map((term) => [term.id, 0]),
  ) as Record<SynonymId, number>

  for (const page of pages) {
    for (const id of page.present) {
      synonymTotals[id] += 1
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    auditedPageCount: pages.length,
    synonymTotals,
    pagesMissingSynonyms: pages.filter((page) => page.status === "missing"),
    pagesWithWeakCoverage: pages.filter((page) => page.status === "weak"),
    pages,
  }
}

export function formatSynonymCoverageReport(report: SynonymCoverageReport): string {
  const lines: string[] = [
    "# Synonym Coverage Report — Hibou&Mots",
    "",
    `Generated: ${report.generatedAt}`,
    `Audited pages: ${report.auditedPageCount}`,
    "",
    "## Synonym totals (pages containing term)",
    "",
  ]

  for (const term of WORD_SEARCH_SYNONYMS) {
    lines.push(`- ${term.label}: ${report.synonymTotals[term.id]}/${report.auditedPageCount}`)
  }

  lines.push("", "## Pages missing synonyms", "")
  if (report.pagesMissingSynonyms.length === 0) {
    lines.push("_None — all audited pages include the primary term and at least one secondary synonym._")
  } else {
    for (const page of report.pagesMissingSynonyms) {
      lines.push(
        `- \`${page.path}\` — missing: ${synonymLabels(page.missing).join(", ")} (${page.secondaryCount} secondary)`,
      )
    }
  }

  lines.push("", "## Pages with weak coverage", "")
  if (report.pagesWithWeakCoverage.length === 0) {
    lines.push("_None — all pages meet secondary synonym thresholds._")
  } else {
    for (const page of report.pagesWithWeakCoverage) {
      lines.push(
        `- \`${page.path}\` — present: ${synonymLabels(page.present).join(", ")}; missing: ${synonymLabels(page.missing).join(", ")}`,
      )
    }
  }

  lines.push("", "## Thresholds", "")
  lines.push(
    `- Important pages: primary + ≥${MIN_SECONDARY_SYNONYMS_IMPORTANT} secondary synonyms (${synonymLabels(SECONDARY_SYNONYM_IDS).join(", ")})`,
  )
  lines.push(
    `- Other category pages: primary + ≥${MIN_SECONDARY_SYNONYMS_DEFAULT} secondary synonyms`,
  )

  return lines.join("\n")
}
