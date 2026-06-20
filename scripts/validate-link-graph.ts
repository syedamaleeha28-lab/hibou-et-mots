import { validateLinkGraph } from "@/lib/seo/link-graph/validate"

async function main() {
  const report = await validateLinkGraph()
  console.log(JSON.stringify(report, null, 2))

  if (!report.ok) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
