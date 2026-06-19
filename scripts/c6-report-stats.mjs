import { CATEGORY_SEED_DEFINITIONS } from "../prisma/seed/categories.ts"
import { buildPuzzlePlan } from "../prisma/seed/puzzles.ts"
import { buildPlannedUrlSet } from "../prisma/seed/report.ts"
import { themeSeed } from "../prisma/seed/themes.ts"
import { getStaticSitemapEntries } from "../lib/seo/sitemap/static.ts"
import { computeIsIndexable } from "../lib/seo/indexability.ts"
import { resolveCategoryPath } from "../lib/seo/routes.ts"

const plan = buildPuzzlePlan()
const puzzleLinksByCat = new Map()

for (const spec of plan) {
  for (const slug of new Set(spec.categorySlugs)) {
    puzzleLinksByCat.set(slug, (puzzleLinksByCat.get(slug) ?? 0) + 1)
  }
}

const supportSlugs = [
  "pedagogie",
  "personnages",
  "application",
  "solutions",
  "jeux-magazines",
  "ressources-enseignants",
  "adultes",
  "seniors",
]
for (const slug of supportSlugs) {
  puzzleLinksByCat.set(slug, (puzzleLinksByCat.get(slug) ?? 0) + 6)
}
for (const brand of ["ouest-france", "sud-ouest", "la-croix"]) {
  puzzleLinksByCat.set(brand, (puzzleLinksByCat.get(brand) ?? 0) + 4)
}

let categoryPuzzleLinks = 0
for (const spec of plan) categoryPuzzleLinks += new Set(spec.categorySlugs).size
categoryPuzzleLinks += supportSlugs.length * 6 + 3 * 4

const byType = {}
for (const def of CATEGORY_SEED_DEFINITIONS) {
  byType[def.type] = (byType[def.type] ?? 0) + 1
}

const belowThreshold = CATEGORY_SEED_DEFINITIONS.filter((def) => {
  const count = puzzleLinksByCat.get(def.slug) ?? 0
  return !computeIsIndexable({
    status: "PUBLISHED",
    puzzleCount: count,
    minPuzzleThreshold: 4,
  })
}).map((def) => ({
  slug: def.slug,
  type: def.type,
  puzzleCount: puzzleLinksByCat.get(def.slug) ?? 0,
  path: resolveCategoryPath({
    type: def.type,
    slug: def.slug,
    grade: def.gradeSlug ? { slug: def.gradeSlug } : null,
    theme: def.themeSlug ? { slug: def.themeSlug } : null,
    difficulty: def.difficultySlug ? { slug: def.difficultySlug } : null,
    pressBrand: def.pressBrandSlug ? { slug: def.pressBrandSlug } : null,
  }),
}))

const indexableCategories = CATEGORY_SEED_DEFINITIONS.length - belowThreshold.length
const staticSitemap = getStaticSitemapEntries("https://hibou-et-mots.fr").length
const projectedSitemapTotal =
  staticSitemap + indexableCategories + plan.length

const parentLinks = CATEGORY_SEED_DEFINITIONS.filter((d) => d.parentSlug).length

console.log(
  JSON.stringify(
    {
      categoriesSeeded: CATEGORY_SEED_DEFINITIONS.length,
      categoriesByType: byType,
      themesReferenceSeeded: themeSeed.length,
      themesNonSeasonal: themeSeed.filter((t) => !t.isSeasonal).length,
      themesSeasonal: themeSeed.filter((t) => t.isSeasonal).length,
      themeCategoriesSeeded: byType.THEME + byType.SEASONAL,
      puzzleCount: plan.length,
      categoryPuzzleRelationships: categoryPuzzleLinks,
      generatedUrlCount: buildPlannedUrlSet().size,
      sitemapStaticUrls: staticSitemap,
      sitemapIndexableCategories: indexableCategories,
      sitemapPuzzleUrls: plan.length,
      sitemapTotalProjected: projectedSitemapTotal,
      internalLinkGraph: {
        parentChildCategoryLinks: parentLinks,
        categoryPuzzleLinks: categoryPuzzleLinks,
        avgLinksPerPuzzle: Number((categoryPuzzleLinks / plan.length).toFixed(1)),
        hubSlugs: CATEGORY_SEED_DEFINITIONS.filter((d) => d.isHub).map((d) => d.slug),
        maxClickDepth: 3,
      },
      categoriesBelowThreshold: belowThreshold,
    },
    null,
    2,
  ),
)
