import { renderToBuffer } from "@react-pdf/renderer"
import { PuzzlePdfDocument } from "./puzzle-pdf-document"
import type { PdfPuzzleInput } from "./types"

export async function renderPuzzlePdfToBuffer(puzzle: PdfPuzzleInput): Promise<Buffer> {
  const buffer = await renderToBuffer(<PuzzlePdfDocument puzzle={puzzle} />)
  return Buffer.from(buffer)
}
