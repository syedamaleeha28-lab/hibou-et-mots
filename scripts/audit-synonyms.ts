/**
 * Audit synonym usage and write the coverage report.
 * Usage: npm run audit:synonyms
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import {
  buildSynonymCoverageReport,
  formatSynonymCoverageReport,
} from "@/lib/seo/synonyms"

async function main() {
  const report = await buildSynonymCoverageReport()

  const docsDir = join(process.cwd(), "docs")
  mkdirSync(docsDir, { recursive: true })

  const jsonPath = join(docsDir, "synonym-coverage.json")
  const mdPath = join(docsDir, "synonym-coverage-report.md")

  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8")
  writeFileSync(mdPath, `${formatSynonymCoverageReport(report)}\n`, "utf8")

  console.log(formatSynonymCoverageReport(report))
  console.log(`Wrote ${jsonPath}`)
  console.log(`Wrote ${mdPath}`)

  if (report.pagesMissingSynonyms.length > 0 || report.pagesWithWeakCoverage.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
