/**
 * Full production readiness audit.
 * Usage: npx tsx scripts/production-readiness-audit.ts [baseUrl]
 *
 * For live HTTP checks, start production server first:
 *   npm run build && npx next start -p 3456
 */
import {
  formatProductionReadinessReport,
  runProductionReadinessAudit,
} from "@/lib/audit/production-readiness"
import { prisma } from "@/lib/db/client"

async function main() {
  const baseUrl = process.argv[2] ?? "http://localhost:3456"
  const report = await runProductionReadinessAudit({ baseUrl })
  console.log(formatProductionReadinessReport(report))

  try {
    await prisma.$disconnect()
  } catch {
    /* DB optional */
  }

  if (report.launchBlockers.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
