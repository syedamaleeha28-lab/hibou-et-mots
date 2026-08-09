import { Text, View } from "@react-pdf/renderer"
import { pdfBaseStyles } from "../styles"

type PdfWordListProps = {
  words: string[]
  compact?: boolean
  /** PT-BR pack: defaults to "fr" so existing French callers are unaffected. */
  language?: string
}

const WORDS_TO_FIND_LABEL: Record<string, string> = {
  fr: "Mots à trouver",
  "pt-BR": "Palavras para encontrar",
}

export function PdfWordList({ words, compact = false, language = "fr" }: PdfWordListProps) {
  // localeCompare accepts BCP-47 tags directly — "pt-BR" works as-is,
  // no mapping needed.
  const sorted = [...words].sort((a, b) => a.localeCompare(b, language))
  const label = WORDS_TO_FIND_LABEL[language] ?? WORDS_TO_FIND_LABEL.fr

  return (
    <View>
      <Text style={pdfBaseStyles.sectionLabel}>{label}</Text>
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
