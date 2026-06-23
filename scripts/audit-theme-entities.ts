/**
 * Audit thematic entity coverage on priority theme pages.
 * Usage: npm run audit:theme-entities
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { buildThemeEntityCoverageReport, formatThemeEntityCoverageReport } from "@/lib/seo/theme-entities"

function main() {
  const report = buildThemeEntityCoverageReport()

  const docsDir = join(process.cwd(), "docs")
  mkdirSync(docsDir, { recursive: true })

  const jsonPath = join(docsDir, "theme-entities.json")
  const mdPath = join(docsDir, "theme-entities-report.md")

  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8")
  writeFileSync(mdPath, `${formatThemeEntityCoverageReport(report)}\n`, "utf8")

  console.log(formatThemeEntityCoverageReport(report))
  console.log(`Wrote ${jsonPath}`)
  console.log(`Wrote ${mdPath}`)

  const hasGaps = report.themes.some(
    (theme) => theme.missingEntities.length > 0 || !theme.introWordCountOk || !theme.faqCountOk,
  )
  if (hasGaps || report.themesWithoutContent.length > 0) {
    process.exitCode = 1
  }
}

main()
