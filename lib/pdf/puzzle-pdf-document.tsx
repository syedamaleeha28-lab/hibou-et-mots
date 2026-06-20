import { Document, Page, Text, View } from "@react-pdf/renderer"
import { PdfGrid } from "./components/pdf-grid"
import { PdfWordList } from "./components/pdf-word-list"
import { buildSolutionCellSet } from "./solution-cells"
import { getPdfCellMetrics, pdfBaseStyles } from "./styles"
import type { PdfPuzzleInput } from "./types"

type PuzzlePdfDocumentProps = {
  puzzle: PdfPuzzleInput
}

export function PuzzlePdfDocument({ puzzle }: PuzzlePdfDocumentProps) {
  const words = puzzle.wordList.map((entry) => entry.word)
  const { cellSize, fontSize, titleSize } = getPdfCellMetrics(
    puzzle.size,
    puzzle.largePrint,
    words.length,
  )
  const highlightCells = buildSolutionCellSet(puzzle.solutionData)
  const compactWordList = puzzle.size > 14

  return (
    <Document title={puzzle.title} author="Hibou & Mots">
      <Page size="A4" style={pdfBaseStyles.page}>
        <Text style={[pdfBaseStyles.title, { fontSize: titleSize }]}>{puzzle.title}</Text>
        <PdfGrid grid={puzzle.grid} cellSize={cellSize} fontSize={fontSize} />
        <PdfWordList words={words} compact={compactWordList} />
        <Text style={pdfBaseStyles.footer} fixed>
          Hibou & Mots — Page 1 — Grille
        </Text>
      </Page>

      <Page size="A4" style={pdfBaseStyles.page}>
        <Text style={[pdfBaseStyles.title, { fontSize: titleSize }]}>
          Corrigé — {puzzle.title}
        </Text>
        <PdfGrid
          grid={puzzle.grid}
          cellSize={cellSize}
          fontSize={fontSize}
          highlightCells={highlightCells}
        />
        <Text style={pdfBaseStyles.footer} fixed>
          Hibou & Mots — Page 2 — Corrigé
        </Text>
      </Page>
    </Document>
  )
}
