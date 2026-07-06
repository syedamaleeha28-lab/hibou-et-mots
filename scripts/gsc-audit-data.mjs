import { CATEGORY_SEED_DEFINITIONS } from "../prisma/seed/categories.ts"
import { getSeedPuzzlePlan } from "../lib/db/adapters/puzzle-catalog.ts"
import { computeIsIndexable } from "../lib/seo/indexability.ts"
import { categoryPathFromDefinition } from "../lib/seo/link-graph/paths.ts"
import { seedCategorySitemapPaths } from "../lib/seo/sitemap/seed-entries.ts"
import { getStaticSitemapEntries } from "../lib/seo/sitemap/static.ts"
import { collectInternalLinksForMap } from "../lib/audit/collect-internal-links.ts"
import { buildInternalLinkMap } from "../lib/seo/link-map/build-link-map.ts"
import { ROUTES, gradePath, themePath, seasonalPath, difficultyPath } from "../lib/seo/routes.ts"
import { countWords } from "../lib/content/phase1/intros.ts"
import { pedagogieEditorialPlainText } from "../lib/content/pedagogie.ts"
import { ressourcesEnseignantsEditorialPlainText } from "../lib/content/ressources-enseignants.ts"

const counts = new Map()
for (const spec of getSeedPuzzlePlan()) {
  for (const slug of spec.categorySlugs) {
    counts.set(slug, (counts.get(slug) ?? 0) + 1)
  }
}

const staticPaths = new Set(getStaticSitemapEntries().map((e) => new URL(e.loc).pathname))
const catPaths = new Set(seedCategorySitemapPaths())

const categories = CATEGORY_SEED_DEFINITIONS.map((def) => {
  const puzzles = counts.get(def.slug) ?? 0
  const path = categoryPathFromDefinition(def)
  return {
    slug: def.slug,
    type: def.type,
    path,
    puzzles,
    indexable: computeIsIndexable({
      status: "PUBLISHED",
      puzzleCount: puzzles,
      minPuzzleThreshold: 4,
    }),
    inCatSitemap: catPaths.has(path),
    inStaticSitemap: staticPaths.has(path),
    isStaticSupport: !!def.isStaticSupport,
    isHub: !!def.isHub,
  }
})

const linkReport = buildInternalLinkMap(await collectInternalLinksForMap())
const inbound = (path) =>
  linkReport.pages.find((p) => p.path === path)?.inboundCount ??
  linkReport.pillarSummary[path] ??
  0

const contentWords = {
  [ROUTES.pedagogie]: countWords(pedagogieEditorialPlainText()),
  [ROUTES.ressources]: countWords(ressourcesEnseignantsEditorialPlainText()),
}

console.log(
  JSON.stringify(
    {
      summary: {
        totalCategories: categories.length,
        categorySitemapUrls: catPaths.size,
        staticSitemapUrls: staticPaths.size,
        zeroPuzzle: categories.filter((c) => c.puzzles === 0).length,
        belowThreshold: categories.filter((c) => c.puzzles > 0 && c.puzzles < 4).length,
        eligible: categories.filter((c) => c.puzzles >= 4).length,
        orphans: linkReport.orphanPages.length,
      },
      zeroPuzzle: categories.filter((c) => c.puzzles === 0),
      belowThreshold: categories.filter((c) => c.puzzles > 0 && c.puzzles < 4),
      editorialWords: contentWords,
      cornerstoneInbound: [
        ROUTES.home,
        ROUTES.pedagogie,
        ROUTES.ressources,
        ROUTES.ecoleHub,
        ROUTES.enfants,
        ROUTES.gratuits,
        ROUTES.imprimer,
        ROUTES.generateur,
        ROUTES.jouer,
        ROUTES.solutions,
        ROUTES.personnages,
        ROUTES.application,
        ROUTES.jeuxMagazines,
      ].map((path) => ({ path, inbound: inbound(path) })),
      grades: ["maternelle", "cp", "ce1", "ce2", "cm1", "cm2", "6e"].map((g) => ({
        path: gradePath(g),
        puzzles: counts.get(g) ?? 0,
        inbound: inbound(gradePath(g)),
      })),
      topThemes: ["animaux", "vocabulaire", "noel", "halloween", "sport", "fruits"].map((t) => {
        const path = ["noel", "halloween"].includes(t)
          ? seasonalPath(t)
          : themePath(t)
        const slug = t
        return { path, slug, puzzles: counts.get(slug) ?? 0, inbound: inbound(path) }
      }),
      press: ["hub-presse", "ouest-france", "sud-ouest", "la-croix"].map((slug) => {
        const def = categories.find((c) => c.slug === slug)
        return { ...def, inbound: inbound(def?.path ?? "") }
      }),
    },
    null,
    2,
  ),
)
