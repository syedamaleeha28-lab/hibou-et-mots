/**
 * Audit educational entity usage on school-facing pages.
 * Usage: npm run audit:educational-entities
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import {
  buildEducationalEntityReport,
  formatEducationalEntityReport,
} from "@/lib/seo/educational-entities"

async function main() {
  const report = await buildEducationalEntityReport()

  const docsDir = join(process.cwd(), "docs")
  mkdirSync(docsDir, { recursive: true })

  const jsonPath = join(docsDir, "educational-entities.json")
  const mdPath = join(docsDir, "educational-entities-report.md")

  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8")
  writeFileSync(mdPath, `${formatEducationalEntityReport(report)}\n`, "utf8")

  console.log(formatEducationalEntityReport(report))
  console.log(`Wrote ${jsonPath}`)
  console.log(`Wrote ${mdPath}`)

  if (report.corpusMissingEntities.length > 0 || report.pagesWithWeakCoverage.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
