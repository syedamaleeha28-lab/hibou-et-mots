import { StyleSheet } from "@react-pdf/renderer"
import { page1Overhead, page2Overhead, PDF_USABLE_HEIGHT, PDF_USABLE_WIDTH } from "./layout"

export function getPdfCellMetrics(
  size: number,
  largePrint: boolean,
  wordCount = 8,
) {
  const widthCell = Math.floor((PDF_USABLE_WIDTH / size) * 0.98)
  const page1HeightCell = Math.floor(
    ((PDF_USABLE_HEIGHT - page1Overhead(size, wordCount)) / size) * 0.98,
  )
  const page2HeightCell = Math.floor(
    ((PDF_USABLE_HEIGHT - page2Overhead()) / size) * 0.98,
  )

  let cellSize = Math.max(8, Math.min(widthCell, page1HeightCell, page2HeightCell))

  if (largePrint) {
    const boosted = Math.floor(cellSize * 1.2)
    cellSize = Math.max(
      8,
      Math.min(boosted, widthCell, page1HeightCell, page2HeightCell),
    )
  }

  const fontSize = Math.max(6, Math.min(largePrint ? 11 : 9, Math.floor(cellSize * 0.52)))
  const titleSize = largePrint ? 16 : size > 14 ? 12 : 14

  return { cellSize, fontSize, titleSize }
}

export function gridFitsA4(
  size: number,
  largePrint: boolean,
  wordCount: number,
): { fitsWidth: boolean; fitsPage1Height: boolean; fitsPage2Height: boolean } {
  const { cellSize } = getPdfCellMetrics(size, largePrint, wordCount)
  const gridHeight = cellSize * size
  return {
    fitsWidth: cellSize * size <= PDF_USABLE_WIDTH,
    fitsPage1Height: gridHeight <= PDF_USABLE_HEIGHT - page1Overhead(size, wordCount),
    fitsPage2Height: gridHeight <= PDF_USABLE_HEIGHT - page2Overhead(),
  }
}

export const pdfBaseStyles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  wordList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  wordChip: {
    fontSize: 9,
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
  },
  wordChipCompact: {
    fontSize: 7,
    paddingVertical: 1,
    paddingHorizontal: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
  },
  gridRow: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 0.5,
    borderColor: "#cccccc",
    alignItems: "center",
    justifyContent: "center",
  },
  cellLetter: {
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  cellHighlight: {
    backgroundColor: "#d4d4d4",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    fontSize: 8,
    color: "#666666",
    textAlign: "center",
  },
})
