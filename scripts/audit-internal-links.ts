/**
 * Full internal-link integrity audit (navigation, pages, sitemap).
 * Usage: npx tsx scripts/audit-internal-links.ts
 */
import { formatInternalLinkAuditReport, runInternalLinkAudit } from "@/lib/audit/internal-link-audit"
import { prisma } from "@/lib/db/client"

async function main() {
  const report = await runInternalLinkAudit()
  console.log(formatInternalLinkAuditReport(report))

  try {
    await prisma.$disconnect()
  } catch {
    // ignore when DB is unavailable
  }

  if (!report.ok) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
