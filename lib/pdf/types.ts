import type { PuzzlePageData } from "@/lib/db/types/page-data"

/** Minimal puzzle shape required for PDF rendering (Step 7A spike). */
export type PdfPuzzleInput = Pick<
  PuzzlePageData,
  "title" | "grid" | "wordList" | "solutionData" | "size" | "largePrint"
> & {
  /**
   * PT-BR pack: drives which language's labels the PDF renders
   * ("Corrigé"/"Mots à trouver" vs "Gabarito"/"Palavras para encontrar").
   * Defaults to "fr" wherever consumed, so any existing caller that
   * doesn't set this keeps rendering French exactly as before.
   */
  language?: string
}
