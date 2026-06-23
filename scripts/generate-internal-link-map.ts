/**
 * Crawl internal links and write the link map report.
 * Usage: npm run generate:link-map
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { collectInternalLinksForMap } from "@/lib/audit/collect-internal-links"
import {
  buildInternalLinkMap,
  formatInternalLinkMapReport,
} from "@/lib/seo/link-map"

async function main() {
  const links = await collectInternalLinksForMap()
  const report = buildInternalLinkMap(links)

  const docsDir = join(process.cwd(), "docs")
  mkdirSync(docsDir, { recursive: true })

  const jsonPath = join(docsDir, "internal-link-map.json")
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8")

  console.log(formatInternalLinkMapReport(report))
  console.log(`Wrote ${jsonPath}`)

  if (report.orphanPages.length > 0 || report.belowMinimum.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
