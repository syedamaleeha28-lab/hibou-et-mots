import {
  getPuzzleForPdf,
  persistPuzzlePdfUrl,
  recordPdfDownload,
} from "@/lib/db/queries/pdf"
import { computePdfContentHash, pdfUrlContainsHash } from "./content-hash"
import { puzzleRecordToPdfInput } from "./map-record"
import { renderPuzzlePdfToBuffer } from "./render"
import { uploadPdfBuffer } from "./storage"

export class PdfNotFoundError extends Error {
  constructor() {
    super("Puzzle not found")
    this.name = "PdfNotFoundError"
  }
}

export class PdfInvalidContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PdfInvalidContentError"
  }
}

export type ResolvePuzzlePdfResult = {
  url: string
  cacheHit: boolean
}

function validateSolutionData(
  solutionData: ReturnType<typeof puzzleRecordToPdfInput>["solutionData"],
  size: number,
) {
  if (solutionData.version !== 1) {
    throw new PdfInvalidContentError("Unsupported solutionData version")
  }
  if (solutionData.size !== size) {
    throw new PdfInvalidContentError("solutionData size mismatch")
  }
  for (const entry of solutionData.words) {
    for (const cell of entry.cells) {
      if (cell.row < 0 || cell.col < 0 || cell.row >= size || cell.col >= size) {
        throw new PdfInvalidContentError("solutionData cell out of bounds")
      }
    }
  }
}

export async function resolvePuzzlePdfUrl(
  puzzleId: string,
  sessionId: string,
): Promise<ResolvePuzzlePdfResult> {
  const puzzle = await getPuzzleForPdf(puzzleId)
  if (!puzzle) {
    throw new PdfNotFoundError()
  }

  const hash = computePdfContentHash({
    gridData: puzzle.gridData,
    solutionData: puzzle.solutionData,
    largePrint: puzzle.largePrint,
    title: puzzle.title,
  })

  if (puzzle.pdfUrl && pdfUrlContainsHash(puzzle.pdfUrl, hash)) {
    await recordPdfDownload(puzzle.id, sessionId)
    return { url: puzzle.pdfUrl, cacheHit: true }
  }

  const pdfInput = puzzleRecordToPdfInput(puzzle)
  validateSolutionData(pdfInput.solutionData, pdfInput.size)

  const buffer = await renderPuzzlePdfToBuffer(pdfInput)
  const url = await uploadPdfBuffer({ slug: puzzle.slug, hash, buffer })

  await persistPuzzlePdfUrl(puzzle.id, url)
  await recordPdfDownload(puzzle.id, sessionId)

  return { url, cacheHit: false }
}
