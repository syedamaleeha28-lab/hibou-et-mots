/** A4 dimensions in PDF points (1 pt = 1/72 inch). */
export const A4_WIDTH_PT = 595.28
export const A4_HEIGHT_PT = 841.89
export const PDF_PAGE_PADDING = 36

export const PDF_USABLE_WIDTH = A4_WIDTH_PT - PDF_PAGE_PADDING * 2
export const PDF_USABLE_HEIGHT = A4_HEIGHT_PT - PDF_PAGE_PADDING * 2

/** Reserved vertical space on page 1 for title, word list, and spacing. */
export function page1Overhead(size: number, wordCount: number): number {
  const wordRows = Math.ceil(wordCount / (size > 14 ? 5 : 4))
  return 90 + wordRows * 14 + (size > 14 ? 24 : 12)
}

export function page2Overhead(): number {
  return 72
}
