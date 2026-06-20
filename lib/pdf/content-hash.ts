import { createHash } from "node:crypto"

export type PdfContentHashInput = {
  gridData: unknown
  solutionData: unknown
  largePrint: boolean
  title: string
}

export function computePdfContentHash(input: PdfContentHashInput): string {
  const payload = JSON.stringify({
    gridData: input.gridData,
    solutionData: input.solutionData,
    largePrint: input.largePrint,
    title: input.title,
  })

  return createHash("sha256").update(payload).digest("hex").slice(0, 16)
}

export function buildPdfBlobPath(slug: string, hash: string): string {
  return `pdfs/${slug}/${hash}.pdf`
}

export function pdfUrlContainsHash(pdfUrl: string | null | undefined, hash: string): boolean {
  if (!pdfUrl) return false
  return pdfUrl.includes(`/${hash}.pdf`) || pdfUrl.includes(`/${hash}`)
}
