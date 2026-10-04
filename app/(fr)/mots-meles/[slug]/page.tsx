import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { PuzzleTemplate, buildPuzzleMetadata } from "@/components/templates/puzzle"
import { resolvePuzzlePageData } from "@/lib/db/queries/pilot"
import { ptPuzzlePath } from "@/lib/seo/routes"

export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

function redirectIfPortuguese(puzzle: { language?: string | null; slug: string }) {
  if (puzzle.language === "pt-BR") permanentRedirect(ptPuzzlePath(puzzle.slug))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const puzzle = await resolvePuzzlePageData(slug)
  if (!puzzle) return {}
  redirectIfPortuguese(puzzle)
  return await buildPuzzleMetadata(puzzle)
}

export default async function PuzzlePage({ params }: PageProps) {
  const { slug } = await params
  const puzzle = await resolvePuzzlePageData(slug)

  if (!puzzle) notFound()
  redirectIfPortuguese(puzzle)

  return <PuzzleTemplate puzzle={puzzle} />
}
