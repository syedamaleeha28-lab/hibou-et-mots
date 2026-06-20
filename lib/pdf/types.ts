import type { PuzzlePageData } from "@/lib/db/types/page-data"

/** Minimal puzzle shape required for PDF rendering (Step 7A spike). */
export type PdfPuzzleInput = Pick<
  PuzzlePageData,
  "title" | "grid" | "wordList" | "solutionData" | "size" | "largePrint"
>
