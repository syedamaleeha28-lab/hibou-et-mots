/** PDF generation — Step 7 (@react-pdf/renderer + Vercel Blob). */
export type { PdfPuzzleInput } from "./types"
export { renderPuzzlePdfToBuffer } from "./render"
export {
  mockSpikePuzzleInput,
  mockFrenchAccentPuzzleInput,
  mockLargePrintPuzzleInput,
  generateLargeGridPuzzleInput,
  toPdfInput,
} from "./fixtures"
export { buildSolutionCellSet } from "./solution-cells"
export { PuzzlePdfDocument } from "./puzzle-pdf-document"
export {
  computePdfContentHash,
  buildPdfBlobPath,
  pdfUrlContainsHash,
  type PdfContentHashInput,
} from "./content-hash"
export { uploadPdfBuffer, PdfStorageError } from "./storage"
export { puzzleRecordToPdfInput, type PuzzlePdfRecord } from "./map-record"
export {
  resolvePuzzlePdfUrl,
  PdfNotFoundError,
  PdfInvalidContentError,
  type ResolvePuzzlePdfResult,
} from "./service"
export { getPdfCellMetrics, gridFitsA4 } from "./styles"
export { PDF_USABLE_WIDTH, PDF_USABLE_HEIGHT } from "./layout"
