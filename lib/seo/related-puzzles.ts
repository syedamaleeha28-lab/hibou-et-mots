import type { PuzzleCardData } from "@/lib/db/types/page-data"

export type RelatedPuzzleCandidate = PuzzleCardData & {
  themeId?: string | null
  gradeId?: string | null
  difficultyId?: string | null
}

export type RelatedPuzzleContext = {
  puzzleId: string
  themeId?: string | null
  gradeId?: string | null
  difficultyId?: string | null
}

/**
 * PRD §18 — related puzzle scoring.
 * score = 3×sameTheme + 2×sameGrade + 1×sameDifficulty + 0.5×log(viewCount+1)
 */
export function scoreRelatedPuzzle(
  candidate: RelatedPuzzleCandidate,
  context: RelatedPuzzleContext,
): number {
  if (candidate.id === context.puzzleId) return -1

  let score = 0
  if (context.themeId && candidate.themeId === context.themeId) score += 3
  if (context.gradeId && candidate.gradeId === context.gradeId) score += 2
  if (context.difficultyId && candidate.difficultyId === context.difficultyId) score += 1
  score += 0.5 * Math.log((candidate.viewCount ?? 0) + 1)

  return score
}

export function selectRelatedPuzzles(
  candidates: RelatedPuzzleCandidate[],
  context: RelatedPuzzleContext,
  limit = 6,
): PuzzleCardData[] {
  const scored = candidates
    .map((candidate) => ({
      candidate,
      score: scoreRelatedPuzzle(candidate, context),
    }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length >= limit) {
    return scored.slice(0, limit).map((entry) => entry.candidate)
  }

  const picked = new Set(scored.map((entry) => entry.candidate.id))
  const fallback = candidates
    .filter((c) => c.id !== context.puzzleId && !picked.has(c.id))
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))

  return [...scored.map((e) => e.candidate), ...fallback].slice(0, limit)
}
