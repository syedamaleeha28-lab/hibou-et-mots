/**
 * Splits a block of text into shorter paragraph-sized chunks, grouping by
 * sentence boundaries. This never changes, removes, or rewords any content —
 * it only decides where paragraph breaks go, so long DB-authored intro text
 * reads as several short paragraphs (~3-4 lines each) instead of one dense
 * block, without anyone having to re-edit the underlying copy.
 */
export function splitIntoParagraphChunks(text: string, sentencesPerChunk = 1): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  // Split into sentences, keeping the terminal punctuation attached.
  const sentences = trimmed.match(/[^.!?]+[.!?]+(\s+|$)/g)
  if (!sentences || sentences.length === 0) return [trimmed]

  const chunks: string[] = []
  for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
    const chunk = sentences.slice(i, i + sentencesPerChunk).join("").trim()
    if (chunk) chunks.push(chunk)
  }
  return chunks.length > 0 ? chunks : [trimmed]
}

/**
 * Applies splitIntoParagraphChunks across one or more source paragraphs
 * (e.g. already split on "\n\n"), flattening the result into a single
 * ordered list of short paragraphs.
 */
export function splitParagraphsIntoChunks(paragraphs: string[], sentencesPerChunk = 1): string[] {
  return paragraphs.flatMap((paragraph) => splitIntoParagraphChunks(paragraph, sentencesPerChunk))
}
