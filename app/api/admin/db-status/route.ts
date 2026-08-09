import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"

// TEMPORARY — remove this route once the production seed is confirmed
// complete. Protected by ADMIN_SEED_SECRET (set this in Vercel's
// Production env vars before deploying — anything long/random).
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

function isAuthorized(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret")
  return Boolean(secret) && secret === process.env.ADMIN_SEED_SECRET
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [
      categoryCount,
      frCategoryCount,
      ptCategoryCount,
      puzzleCount,
      frPuzzleCount,
      ptPuzzleCount,
      gradeCount,
      themeCount,
      difficultyCount,
    ] = await Promise.all([
      prisma.category.count(),
      prisma.category.count({ where: { locale: "fr" } }),
      prisma.category.count({ where: { locale: "pt-BR" } }),
      prisma.puzzle.count(),
      prisma.puzzle.count({ where: { language: "fr" } }),
      prisma.puzzle.count({ where: { language: "pt-BR" } }),
      prisma.grade.count(),
      prisma.theme.count(),
      prisma.difficulty.count(),
    ])

    return NextResponse.json({
      ok: true,
      migrationLikelyApplied: true, // reaching this line without throwing means the `locale` column exists
      categoryCount,
      frCategoryCount,
      ptCategoryCount,
      puzzleCount,
      frPuzzleCount,
      ptPuzzleCount,
      gradeCount,
      themeCount,
      difficultyCount,
    })
  } catch (error) {
    // If the locale column doesn't exist yet (migration not applied),
    // these queries throw — surfacing that clearly rather than a generic 500.
    return NextResponse.json(
      {
        ok: false,
        migrationLikelyApplied: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
