import { Text, View } from "@react-pdf/renderer"
import { pdfBaseStyles } from "../styles"

type PdfWordListProps = {
  words: string[]
  compact?: boolean
}

export function PdfWordList({ words, compact = false }: PdfWordListProps) {
  const sorted = [...words].sort((a, b) => a.localeCompare(b, "fr"))

  return (
    <View>
      <Text style={pdfBaseStyles.sectionLabel}>Mots à trouver</Text>
      <View style={pdfBaseStyles.wordList}>
        {sorted.map((word) => (
          <Text
            key={word}
            style={compact ? pdfBaseStyles.wordChipCompact : pdfBaseStyles.wordChip}
          >
            {word}
          </Text>
        ))}
      </View>
    </View>
  )
}
