import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { clearContentSeed } from "@/prisma/seed/categories"
import {
  getFrPuzzlePlanLength,
  getPtPuzzlePlanLength,
  loadCategoryIdBySlug,
  seedCategoriesAll,
  seedPuzzlesFrBatch,
  seedPuzzlesFrBonusLinks,
  seedPuzzlesPtAll,
  seedReferenceDataAll,
} from "@/prisma/seed/run-all"

// TEMPORARY — remove this route once the production seed is confirmed
// complete (see README-PROD-SEED.md for the removal step). Protected by
// ADMIN_SEED_SECRET (set in Vercel's Production env vars first).
//
// Split into steps, called one at a time in order, because:
// (a) production's DATABASE_URL can't be read locally (Vercel marks it
//     "Sensitive" — write-only by design), so this can only run on
//     Vercel itself, and
// (b) puzzle generation is slow enough that the Hobby plan's function
//     time limit may not fit the whole thing in one call.
//
// Valid ?step= values, run in this order:
//   reference   — grades/difficulties/themes/words (fr + pt-BR)
//   categories  — press brands + all categories (fr + pt-BR)
//   puzzles-fr  — ONE BATCH of French puzzles (needs offset/limit,
//                 repeat with increasing offset until done=true)
//   puzzles-fr-bonus-links — run once, after ALL fr batches are done
//   puzzles-pt  — all 12 Portuguese puzzles (small enough for one call)
//
// Optional: ?reset=1 on the "categories" step wipes existing category/
// puzzle content first (mirrors SEED_RESET_CONTENT=1 locally). DO NOT
// pass this unless you specifically intend to wipe production content —
// there is no confirmation step, it deletes immediately.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

function isAuthorized(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret")
  return Boolean(secret) && secret === process.env.ADMIN_SEED_SECRET
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const step = url.searchParams.get("step")
  const logs: string[] = []
  const log = (message: string) => logs.push(message)

  try {
    switch (step) {
      case "reference": {
        await seedReferenceDataAll(prisma, log)
        return NextResponse.json({ ok: true, step, logs })
      }

      case "categories": {
        if (url.searchParams.get("reset") === "1") {
          log("Resetting existing content (categories, puzzles, links)…")
          await clearContentSeed(prisma)
        }
        const categoryIdBySlug = await seedCategoriesAll(prisma, log)
        return NextResponse.json({ ok: true, step, categoryCount: categoryIdBySlug.size, logs })
      }

      case "puzzles-fr": {
        const offset = Number(url.searchParams.get("offset") ?? "0")
        const limit = Number(url.searchParams.get("limit") ?? "15")
        const categoryIdBySlug = await loadCategoryIdBySlug(prisma)
        const result = await seedPuzzlesFrBatch(prisma, categoryIdBySlug, offset, limit, log)
        const done = offset + result.processedInBatch >= result.totalPlanned
        return NextResponse.json({
          ok: true,
          step,
          offset,
          limit,
          processedInBatch: result.processedInBatch,
          totalPlanned: result.totalPlanned,
          nextOffset: done ? null : offset + limit,
          done,
          logs,
        })
      }

      case "puzzles-fr-bonus-links": {
        const categoryIdBySlug = await loadCategoryIdBySlug(prisma)
        const result = await seedPuzzlesFrBonusLinks(prisma, categoryIdBySlug, log)
        return NextResponse.json({ ok: true, step, linkCount: result.linkCount, logs })
      }

      case "puzzles-pt": {
        const categoryIdBySlug = await loadCategoryIdBySlug(prisma)
        const result = await seedPuzzlesPtAll(prisma, categoryIdBySlug, log)
        return NextResponse.json({ ok: true, step, ...result, logs })
      }

      default:
        return NextResponse.json(
          {
            ok: false,
            error: `Unknown or missing step. Use one of: reference, categories, puzzles-fr, puzzles-fr-bonus-links, puzzles-pt`,
            frPuzzlePlanLength: getFrPuzzlePlanLength(),
            ptPuzzlePlanLength: getPtPuzzlePlanLength(),
          },
          { status: 400 },
        )
    }
  } catch (error) {
    return NextResponse.json(
      { ok: false, step, error: error instanceof Error ? error.message : String(error), logs },
      { status: 500 },
    )
  }
}
