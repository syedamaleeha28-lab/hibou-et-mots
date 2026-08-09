import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PuzzleTemplate, buildPuzzleMetadata } from "@/components/templates/puzzle"
import { resolvePuzzlePageData } from "@/lib/db/queries/pilot"

// Mirrors app/mots-meles/[slug]/page.tsx exactly. Puzzle.slug is globally
// unique (unchanged by the locale migration — only Grade/Theme/Difficulty/
// Category became locale-scoped), so this route resolves any puzzle by
// slug regardless of language. Duplicated as its own route (rather than
// reusing /mots-meles/[slug]/) so Portuguese puzzles live under a
// Portuguese URL prefix, matching the hrefs mapPuzzleToCardData now
// generates for puzzle.language === "pt-BR".
export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const puzzle = await resolvePuzzlePageData(slug)
  if (!puzzle) return {}
  return await buildPuzzleMetadata(puzzle)
}

export default async function CacaPalavrasPuzzlePage({ params }: PageProps) {
  const { slug } = await params
  const puzzle = await resolvePuzzlePageData(slug)

  if (!puzzle) notFound()

  return <PuzzleTemplate puzzle={puzzle} />
}
