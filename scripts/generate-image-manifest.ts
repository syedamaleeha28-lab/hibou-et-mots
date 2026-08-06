/**
 * Generates the complete site-wide image manifest (every hero + preview
 * illustration filename, alt text, caption, dimensions, and AI prompt).
 *
 * Run with: npx tsx scripts/generate-image-manifest.ts
 * Requires a working DATABASE_URL (same as the rest of the app).
 *
 * This deliberately reuses getCategoryIllustrations / getContentIllustration /
 * buildAiPrompt — the exact same functions the live pages call — so the
 * manifest can never drift out of sync with what actually renders.
 */
import { writeFileSync } from "node:fs"
import { prisma } from "@/lib/db/client"
import { resolveCategoryPath } from "@/lib/seo/routes"
import type { CategoryType } from "@/lib/db/types/page-data"
import {
  getCategoryIllustrations,
  getContentIllustration,
  buildAiPrompt,
  deriveDefaultSubject,
} from "@/lib/images/page-illustrations"

type ManifestRow = {
  page: string
  slot: "hero" | "preview"
  filename: string
  altText: string
  caption?: string
  dimensions: string
  aiPrompt: string
}

/**
 * The 6 content-page routes are a small, fixed set (not database rows) —
 * update this list if a new content page is added. See
 * components/templates/content/content-page-template.tsx consumers for
 * the authoritative list of routes.
 */
const CONTENT_PAGES: { canonicalPath: string; h1: string; subject: string }[] = [
  { canonicalPath: "/mots-meles-pedagogie/", h1: "Pédagogie des Mots Mêlés", subject: "a teacher and student reviewing an educational word-search worksheet together" },
  { canonicalPath: "/mots-meles-personnages/", h1: "Mots Mêlés par Personnages", subject: "friendly cartoon characters surrounding a word-search grid" },
  { canonicalPath: "/ressources-enseignants-mots-meles/", h1: "Ressources pour Enseignants", subject: "a teacher preparing printable word-search worksheets at a desk" },
  { canonicalPath: "/solutions-regles-mots-meles/", h1: "Règles et Solutions des Mots Mêlés", subject: "a magnifying glass tracing a solved word inside a word-search grid" },
  { canonicalPath: "/application-mots-meles/", h1: "Application Mots Mêlés", subject: "a hand holding a phone showing a word-search puzzle app" },
  { canonicalPath: "/jeux-magazines-mots-meles/", h1: "Mots Mêlés des Journaux et Magazines", subject: "a stack of puzzle magazines and newspapers with word-search grids" },
]

async function buildCategoryRows(): Promise<ManifestRow[]> {
  const categories = await prisma.category.findMany({
    where: { status: "PUBLISHED" },
    include: { grade: true, theme: true, difficulty: true, pressBrand: true },
  })

  const rows: ManifestRow[] = []
  for (const category of categories) {
    const canonicalPath = resolveCategoryPath({
      type: category.type as CategoryType,
      slug: category.slug,
      grade: category.grade ?? undefined,
      theme: category.theme ?? undefined,
      difficulty: category.difficulty ?? undefined,
    })
    const { hero, preview } = getCategoryIllustrations({ canonicalPath, h1: category.h1 })
    const subject = deriveDefaultSubject({
      h1: category.h1,
      audienceLabel: category.type === "AUDIENCE" ? category.h1 : undefined,
      theme: category.theme ?? undefined,
    })

    rows.push({
      page: canonicalPath,
      slot: "hero",
      filename: hero.src,
      altText: hero.alt,
      caption: hero.caption,
      dimensions: `${hero.width}x${hero.height}`,
      aiPrompt: buildAiPrompt("hero", subject),
    })
    rows.push({
      page: canonicalPath,
      slot: "preview",
      filename: preview.src,
      altText: preview.alt,
      caption: preview.caption,
      dimensions: `${preview.width}x${preview.height}`,
      aiPrompt: buildAiPrompt("preview", subject),
    })
  }
  return rows
}

function buildContentRows(): ManifestRow[] {
  return CONTENT_PAGES.map((page) => {
    const illustration = getContentIllustration({ ...page, illustration: undefined })
    return {
      page: page.canonicalPath,
      slot: "hero" as const,
      filename: illustration.src,
      altText: illustration.alt,
      caption: illustration.caption,
      dimensions: `${illustration.width}x${illustration.height}`,
      aiPrompt: buildAiPrompt("hero", page.subject),
    }
  })
}

function toCsv(rows: ManifestRow[]): string {
  const header = "page,slot,filename,altText,caption,dimensions,aiPrompt"
  const escape = (value: string) => `"${(value ?? "").replace(/"/g, '""')}"`
  const lines = rows.map((r) =>
    [r.page, r.slot, r.filename, r.altText, r.caption ?? "", r.dimensions, r.aiPrompt].map(escape).join(","),
  )
  return [header, ...lines].join("\n")
}

async function main() {
  const categoryRows = await buildCategoryRows()
  const contentRows = buildContentRows()
  const allRows = [...categoryRows, ...contentRows]

  writeFileSync("image-manifest.json", JSON.stringify(allRows, null, 2))
  writeFileSync("image-manifest.csv", toCsv(allRows))

  console.log(`Generated manifest for ${allRows.length} images across ${allRows.length / 2} pages.`)
  console.log("Wrote image-manifest.json and image-manifest.csv")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
