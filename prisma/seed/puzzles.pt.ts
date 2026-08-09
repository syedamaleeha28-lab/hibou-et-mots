import type { PrismaClient } from "@prisma/client"
import type { DifficultySlug, PuzzleResult } from "@/lib/puzzle-engine"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import { themeSeedPt } from "./themes.pt"
import { difficultySeedPt } from "./difficulties.pt"
import type { PuzzleSeedSpec } from "./puzzles"

/**
 * PT-BR puzzles are generated with the SAME engine presets (grid size,
 * word count, directions, time budget) as the French difficulty levels —
 * those numbers aren't language-specific. This maps our Portuguese DB
 * difficulty slugs to the engine's (French-keyed) DifficultySlug type
 * purely to select which preset bucket to use. The Portuguese slug
 * ("facil") is still what gets stored on the Puzzle/Category rows and
 * shown to users — this mapping is generator-internal only.
 */
const PT_TO_ENGINE_DIFFICULTY: Record<string, DifficultySlug> = {
  facil: "facile",
  medio: "moyen",
  dificil: "difficile",
}

const DIFFICULTY_ROTATION_PT = difficultySeedPt.map((d) => d.slug)

/** v1 scope: 2 puzzles per difficulty per theme = 6 puzzles per theme, 12 total. */
const PUZZLES_PER_DIFFICULTY = 2

function categorySlugsForSpecPt(themeSlug: string, difficultySlugPt: string): string[] {
  return [
    HUB_CATEGORY_SLUGS.imprimer,
    themeSlug,
    difficultySlugPt,
    HUB_CATEGORY_SLUGS.difficulte,
    HUB_CATEGORY_SLUGS.thematiques,
  ]
}

/**
 * PuzzleSeedSpec.difficulty is typed as the engine's (French) DifficultySlug
 * — that's fine, since `difficulty` there means "which engine preset", not
 * "what to display". We separately pass the Portuguese difficulty slug via
 * categorySlugs (which drives category linking + DB difficultyId lookup
 * done inside seedLocalizedPuzzles). To keep seedLocalizedPuzzles fully
 * reusable without a PT-specific branch, we store the PT difficulty slug
 * as `spec.difficulty` directly and instead pre-resolve the engine preset
 * at generation time via a parallel map, rather than threading a second
 * field through the shared function. See buildPtPuzzlePlan below.
 */
export function buildPtPuzzlePlan(): PuzzleSeedSpec[] {
  const specs: PuzzleSeedSpec[] = []
  let seedBase = 90_000

  for (const theme of themeSeedPt) {
    let counter = 0
    for (const difficultySlugPt of DIFFICULTY_ROTATION_PT) {
      for (let index = 0; index < PUZZLES_PER_DIFFICULTY; index++) {
        counter += 1
        const nn = String(counter).padStart(2, "0")
        const slug = `${theme.slug}-${difficultySlugPt}-${nn}-pt`

        specs.push({
          id: `pt-theme-${theme.slug}-${difficultySlugPt}-${nn}`,
          slug,
          title: `Caça-Palavras ${theme.name} — ${nn}`,
          themeSlug: theme.slug,
          gradeSlug: undefined,
          // NOTE: this is the PT-BR difficulty slug ("facil"), not the
          // engine's DifficultySlug type — see resolvePtGenerateOptions
          // below, which maps it before calling the engine.
          difficulty: difficultySlugPt as unknown as PuzzleSeedSpec["difficulty"],
          seed: seedBase++,
          categorySlugs: categorySlugsForSpecPt(theme.slug, difficultySlugPt),
          viewCount: 100 - counter * 3,
        })
      }
    }
  }

  return specs
}

/**
 * Thin locale-specific seeding entrypoint. Delegates to the shared
 * seedLocalizedPuzzles — but that function calls resolveGenerateOptions
 * with spec.difficulty directly, which for our PT specs holds a Portuguese
 * slug rather than an engine DifficultySlug. To keep the shared function
 * simple and not special-case locale internally, we translate the specs'
 * difficulty field to the engine preset key right before generation, and
 * translate back for DB storage via a second specs array that keeps the
 * Portuguese slug for category/difficultyId lookups.
 *
 * In practice: pass ENGINE-KEYED specs into seedLocalizedPuzzles for grid
 * generation correctness, but that function also uses spec.difficulty to
 * look up `difficultyIdBySlug.get(spec.difficulty)` for the DB foreign
 * key — which must be the PT slug ("facil"), not "facile". These two
 * needs conflict on a single field, so seedPtPuzzles below does NOT reuse
 * seedLocalizedPuzzles directly; instead it duplicates the small amount of
 * DB-write logic needed, calling the engine directly. This avoids a
 * confusing dual-meaning field in the shared function.
 */
export async function seedPtPuzzles(
  prisma: PrismaClient,
  categoryIdBySlug: Map<string, string>,
): Promise<{ puzzleCount: number; linkCount: number }> {
  const {
    generatePuzzleBatch,
    resolveGenerateOptions,
    selectWordsFromBank,
    toPrismaPuzzlePayload,
  } = await import("@/lib/puzzle-engine")

  const specs = buildPtPuzzlePlan()

  const wordRows = await prisma.themeWord.findMany({
    where: { theme: { locale: "pt-BR" } },
    include: { theme: { select: { slug: true } } },
  })
  const wordBanks = new Map<string, { word: string; length: number; minGradeOrder: number }[]>()
  for (const row of wordRows) {
    const list = wordBanks.get(row.theme.slug) ?? []
    list.push({ word: row.word, length: row.length, minGradeOrder: row.minGradeOrder })
    wordBanks.set(row.theme.slug, list)
  }

  const difficultyIdBySlug = new Map(
    (await prisma.difficulty.findMany({ where: { locale: "pt-BR" } })).map((d) => [d.slug, d.id]),
  )
  const themeIdBySlug = new Map(
    (await prisma.theme.findMany({ where: { locale: "pt-BR" } })).map((t) => [t.slug, t.id]),
  )
  const themeNameBySlug = new Map<string, string>(themeSeedPt.map((t) => [t.slug, t.name]))

  // Same fallback ladder as French seedLocalizedPuzzles: PT banks are
  // intentionally small (15 words/theme), and grade-order length bounds
  // leave <12 eligible words for "dificil" — without this, seeding throws.
  function selectWordsWithFallback(
    bank: { word: string; length: number; minGradeOrder: number }[],
    difficulty: DifficultySlug,
    seed: number,
  ): string[] {
    const attempts: DifficultySlug[] =
      difficulty === "difficile"
        ? ["difficile", "moyen", "facile"]
        : difficulty === "moyen"
          ? ["moyen", "facile"]
          : ["facile"]
    const gradeOrders = [4, 5, 6, 0]
    let lastError: unknown
    for (const order of gradeOrders) {
      for (const level of attempts) {
        try {
          return selectWordsFromBank(bank, order, level, seed)
        } catch (error) {
          lastError = error
        }
      }
    }
    throw lastError
  }

  const batchRequests = specs.map((spec) => {
    const ptSlug = spec.difficulty as unknown as string
    const enginePreset = PT_TO_ENGINE_DIFFICULTY[ptSlug]
    if (!enginePreset) {
      throw new Error(`No engine preset mapping for PT difficulty slug "${ptSlug}"`)
    }
    const bank = wordBanks.get(spec.themeSlug) ?? []
    // v1 scope has no PT grades, so grade order starts at the "default
    // adult" bucket (4) — same as gradeOrderForSlug(undefined) in puzzles.ts.
    const words = selectWordsWithFallback(bank, enginePreset, spec.seed)
    const options = resolveGenerateOptions({
      difficulty: enginePreset,
      words,
      seed: spec.seed,
      simplifyAccents: true,
    })
    return { id: spec.id, options }
  })

  const batch = generatePuzzleBatch(batchRequests, { seedBase: 91_000, globalTimeBudgetMs: 120_000 })
  if (batch.failures.length > 0) {
    const summary = batch.failures
      .slice(0, 5)
      .map((f: { id: string; message: string }) => `${f.id}: ${f.message}`)
      .join("; ")
    throw new Error(`[pt-BR] Puzzle generation failed for ${batch.failures.length} specs. ${summary}`)
  }

  const resultById = new Map(batch.successes.map((entry: { id: string; result: unknown }) => [entry.id, entry.result]))
  let linkCount = 0

  for (const spec of specs) {
    const result = resultById.get(spec.id) as PuzzleResult | undefined
    if (!result) continue

    const ptSlug = spec.difficulty as unknown as string
    const themeName = themeNameBySlug.get(spec.themeSlug) ?? spec.themeSlug
    const payload = toPrismaPuzzlePayload(result, {
      slug: spec.slug,
      title: spec.title,
      difficultyId: difficultyIdBySlug.get(ptSlug)!,
      themeId: themeIdBySlug.get(spec.themeSlug),
    })

    const metaTitle = `${themeName} — ${spec.title}`
    const metaDescription = `Jogue e imprima este caça-palavras grátis sobre ${themeName}. Grade ${result.size}×${result.size}, nível ${ptSlug}.`

    const puzzle = await prisma.puzzle.upsert({
      where: { slug: spec.slug },
      create: {
        ...payload,
        language: "pt-BR",
        status: "PUBLISHED",
        viewCount: spec.viewCount,
        metaTitle,
        metaDescription,
      },
      update: {
        title: payload.title,
        gridData: payload.gridData,
        wordList: payload.wordList,
        solutionData: payload.solutionData,
        size: payload.size,
        difficultyId: payload.difficultyId,
        themeId: payload.themeId ?? null,
        language: "pt-BR",
        status: "PUBLISHED",
        viewCount: spec.viewCount,
        metaTitle,
        metaDescription,
      },
    })

    for (const categorySlug of new Set(spec.categorySlugs)) {
      const categoryId = categoryIdBySlug.get(`pt-BR:${categorySlug}`)
      if (!categoryId) continue
      await prisma.categoryPuzzle.upsert({
        where: { categoryId_puzzleId: { categoryId, puzzleId: puzzle.id } },
        create: { categoryId, puzzleId: puzzle.id },
        update: {},
      })
      linkCount += 1
    }
  }

  return { puzzleCount: specs.length, linkCount }
}
