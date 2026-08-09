import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfGrid } from "./components/pdf-grid"
import { PdfWordList } from "./components/pdf-word-list"
import { buildSolutionCellSet } from "./solution-cells"
import { getPdfCellMetrics, pdfBaseStyles } from "./styles"
import type { PdfPuzzleInput } from "./types"

type PuzzlePdfDocumentProps = {
  puzzle: PdfPuzzleInput
}

// PT-BR pack: was hardcoded French throughout this file — "Corrigé",
// the footer branding text, even the PDF author metadata name. Puzzle
// grids/words themselves were already correct for Portuguese puzzles
// (they come from puzzle.grid/wordList, generated correctly since the
// seeding pack), but every printed label around them was still French.
const LABELS: Record<string, { solution: string; footerGrid: string; footerSolution: string; author: string }> = {
  fr: {
    solution: "Corrigé",
    footerGrid: "Hibou & Mots — Page 1 — Grille",
    footerSolution: "Hibou & Mots — Page 2 — Corrigé",
    author: "Sophie Martin",
  },
  "pt-BR": {
    solution: "Gabarito",
    footerGrid: "Hibou & Mots — Página 1 — Grade",
    footerSolution: "Hibou & Mots — Página 2 — Gabarito",
    author: "Sophie Martin",
  },
}

export function PuzzlePdfDocument({ puzzle }: PuzzlePdfDocumentProps) {
  const language = puzzle.language ?? "fr"
  const labels = LABELS[language] ?? LABELS.fr

  const words = puzzle.wordList.map((entry) => entry.word)
  const { cellSize, fontSize, titleSize } = getPdfCellMetrics(
    puzzle.size,
    puzzle.largePrint,
    words.length,
  )
  const highlightCells = buildSolutionCellSet(puzzle.solutionData)
  const compactWordList = puzzle.size > 14

  return (
    <Document title={puzzle.title} author={labels.author}>
      <Page size="A4" style={pdfBaseStyles.page}>
        <Text style={[pdfBaseStyles.title, { fontSize: titleSize }]}>{puzzle.title}</Text>
        <PdfGrid grid={puzzle.grid} cellSize={cellSize} fontSize={fontSize} />
        <PdfWordList words={words} compact={compactWordList} language={language} />
        <Text style={pdfBaseStyles.footer} fixed>
          {labels.footerGrid}
        </Text>
      </Page>

      <Page size="A4" style={pdfBaseStyles.page}>
        <Text style={[pdfBaseStyles.title, { fontSize: titleSize }]}>
          {labels.solution} — {puzzle.title}
        </Text>
        <PdfGrid
          grid={puzzle.grid}
          cellSize={cellSize}
          fontSize={fontSize}
          highlightCells={highlightCells}
        />
        <Text style={pdfBaseStyles.footer} fixed>
          {labels.footerSolution}
        </Text>
      </Page>
    </Document>
  )
}
