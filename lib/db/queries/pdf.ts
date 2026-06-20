import { prisma } from "@/lib/db/client"
import type { PuzzlePdfRecord } from "@/lib/pdf/map-record"

const puzzlePdfSelect = {
  id: true,
  slug: true,
  title: true,
  gridData: true,
  wordList: true,
  solutionData: true,
  size: true,
  largePrint: true,
  pdfUrl: true,
  status: true,
} as const

export async function getPuzzleForPdf(puzzleId: string): Promise<PuzzlePdfRecord | null> {
  const puzzle = await prisma.puzzle.findFirst({
    where: {
      id: puzzleId,
      status: "PUBLISHED",
    },
    select: puzzlePdfSelect,
  })

  return puzzle
}

export async function persistPuzzlePdfUrl(puzzleId: string, pdfUrl: string): Promise<void> {
  await prisma.puzzle.update({
    where: { id: puzzleId },
    data: { pdfUrl },
  })
}

export async function recordPdfDownload(puzzleId: string, sessionId: string): Promise<void> {
  await prisma.$transaction([
    prisma.puzzle.update({
      where: { id: puzzleId },
      data: { printCount: { increment: 1 } },
    }),
    prisma.analyticsEvent.create({
      data: {
        eventType: "download",
        puzzleId,
        sessionId,
      },
    }),
  ])
}
