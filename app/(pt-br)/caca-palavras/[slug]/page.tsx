import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { PuzzleTemplate, buildPuzzleMetadata } from "@/components/templates/puzzle"
import { resolvePuzzlePageData } from "@/lib/db/queries/pilot"
import { puzzlePathForLanguage } from "@/lib/seo/routes"

export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

function redirectIfNotPortuguese(puzzle: { language?: string | null; slug: string }) {
  if (puzzle.language === "pt-BR") return
  permanentRedirect(puzzlePathForLanguage(puzzle.slug, puzzle.language))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const puzzle = await resolvePuzzlePageData(slug)
  if (!puzzle) return {}
  redirectIfNotPortuguese(puzzle)
  return await buildPuzzleMetadata(puzzle)
}

export default async function CacaPalavrasPuzzlePage({ params }: PageProps) {
  const { slug } = await params
  const puzzle = await resolvePuzzlePageData(slug)

  if (!puzzle) notFound()
  redirectIfNotPortuguese(puzzle)

  return <PuzzleTemplate puzzle={puzzle} />
}
