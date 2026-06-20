import { Text, View } from "@react-pdf/renderer"
import { pdfBaseStyles } from "../styles"

type PdfGridProps = {
  grid: string[][]
  cellSize: number
  fontSize: number
  highlightCells?: Set<string>
}

export function PdfGrid({ grid, cellSize, fontSize, highlightCells }: PdfGridProps) {
  return (
    <View>
      {grid.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={pdfBaseStyles.gridRow}>
          {row.map((letter, colIndex) => {
            const key = `${rowIndex},${colIndex}`
            const highlighted = highlightCells?.has(key) ?? false
            return (
              <View
                key={key}
                style={[
                  pdfBaseStyles.cell,
                  { width: cellSize, height: cellSize },
                  highlighted ? pdfBaseStyles.cellHighlight : undefined,
                ]}
              >
                <Text style={[pdfBaseStyles.cellLetter, { fontSize }]}>{letter}</Text>
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}
