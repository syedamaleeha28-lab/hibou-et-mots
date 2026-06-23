import type { EducationalPageCopy } from "./collect-page-copy"
import { collectEducationalPageCopies } from "./collect-page-copy"
import {
  detectEducationalEntities,
  EDUCATIONAL_ENTITIES,
  entityLabels,
  MIN_ENTITIES_GRADE_PAGES,
  MIN_ENTITIES_HUB_PAGES,
  MIN_ENTITIES_SNIPPET_PAGES,
  missingEntityIds,
  type EducationalEntityId,
} from "./terms"

export type EducationalEntityStatus = "complete" | "adequate" | "weak"

export type EducationalPageReport = {
  path: string
  slug: string
  pageType: EducationalPageCopy["pageType"]
  present: EducationalEntityId[]
  missing: EducationalEntityId[]
  entityCount: number
  status: EducationalEntityStatus
}

export type EducationalEntityReport = {
  generatedAt: string
  auditedPageCount: number
  entityTotals: Record<EducationalEntityId, number>
  corpusMissingEntities: EducationalEntityId[]
  pagesWithWeakCoverage: EducationalPageReport[]
  pages: EducationalPageReport[]
}

function requiredEntityCount(pageType: EducationalPageCopy["pageType"]): number {
  switch (pageType) {
    case "grade":
      return MIN_ENTITIES_GRADE_PAGES
    case "snippet":
      return MIN_ENTITIES_SNIPPET_PAGES
    default:
      return MIN_ENTITIES_HUB_PAGES
  }
}

export function scoreEducationalPage(page: EducationalPageCopy): EducationalPageReport {
  const present = detectEducationalEntities(page.text)
  const missing = missingEntityIds(present)
  const entityCount = present.length
  const required = requiredEntityCount(page.pageType)

  let status: EducationalEntityStatus = "complete"
  if (entityCount < required - 1) {
    status = "weak"
  } else if (entityCount < required) {
    status = "adequate"
  }

  return {
    path: page.path,
    slug: page.slug,
    pageType: page.pageType,
    present,
    missing,
    entityCount,
    status,
  }
}

export async function buildEducationalEntityReport(): Promise<EducationalEntityReport> {
  const copies = await collectEducationalPageCopies()
  const pages = copies.map(scoreEducationalPage)

  const entityTotals = Object.fromEntries(
    EDUCATIONAL_ENTITIES.map((term) => [term.id, 0]),
  ) as Record<EducationalEntityId, number>

  const corpusPresent = new Set<EducationalEntityId>()
  for (const page of pages) {
    for (const id of page.present) {
      entityTotals[id] += 1
      corpusPresent.add(id)
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    auditedPageCount: pages.length,
    entityTotals,
    corpusMissingEntities: missingEntityIds([...corpusPresent]),
    pagesWithWeakCoverage: pages.filter((page) => page.status === "weak"),
    pages,
  }
}

export function formatEducationalEntityReport(report: EducationalEntityReport): string {
  const lines: string[] = [
    "# Educational Entity Coverage Report — Hibou&Mots",
    "",
    `Generated: ${report.generatedAt}`,
    `Audited educational pages: ${report.auditedPageCount}`,
    "",
    "## Entity totals (educational pages containing term)",
    "",
  ]

  for (const term of EDUCATIONAL_ENTITIES) {
    lines.push(`- ${term.label}: ${report.entityTotals[term.id]}/${report.auditedPageCount}`)
  }

  lines.push("", "## Entities absent from the educational corpus", "")
  if (report.corpusMissingEntities.length === 0) {
    lines.push("_None — all seven entities appear on at least one educational page._")
  } else {
    lines.push(
      `- Missing globally: ${entityLabels(report.corpusMissingEntities).join(", ")}`,
    )
  }

  lines.push("", "## Pages with weak coverage", "")
  if (report.pagesWithWeakCoverage.length === 0) {
    lines.push("_None — all audited educational pages meet entity thresholds._")
  } else {
    for (const page of report.pagesWithWeakCoverage) {
      lines.push(
        `- \`${page.path}\` (${page.pageType}) — ${page.entityCount} entities; missing: ${entityLabels(page.missing).join(", ")}`,
      )
    }
  }

  lines.push("", "## Thresholds", "")
  lines.push(`- Hub / support pages: ≥${MIN_ENTITIES_HUB_PAGES} entities`)
  lines.push(`- Grade pages: ≥${MIN_ENTITIES_GRADE_PAGES} entities (cycle + skill term)`)
  lines.push(`- Homepage pedagogy snippet: ≥${MIN_ENTITIES_SNIPPET_PAGES} entities`)
  lines.push("", "## Scope", "")
  lines.push(
    "Educational entities are intentionally limited to school-facing pages (pédagogie, école, enfants, ressources enseignants, grades, homepage pedagogy) — not injected site-wide.",
  )

  return lines.join("\n")
}
