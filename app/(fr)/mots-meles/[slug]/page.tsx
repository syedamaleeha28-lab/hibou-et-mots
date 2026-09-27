import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PuzzleTemplate, buildPuzzleMetadata } from "@/components/templates/puzzle"
import { resolvePuzzlePageData } from "@/lib/db/queries/pilot"

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

export default async function PuzzlePage({ params }: PageProps) {
  const { slug } = await params
  const puzzle = await resolvePuzzlePageData(slug)

  if (!puzzle) notFound()

  return <PuzzleTemplate puzzle={puzzle} />
}
