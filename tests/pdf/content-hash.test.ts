import { describe, expect, it } from "vitest"
import {
  buildPdfBlobPath,
  computePdfContentHash,
  pdfUrlContainsHash,
} from "@/lib/pdf/content-hash"

describe("pdf content hash", () => {
  const base = {
    gridData: [["A", "B"]],
    solutionData: { version: 1, size: 1, words: [] },
    largePrint: false,
    title: "Test",
  }

  it("is stable for the same payload", () => {
    const a = computePdfContentHash(base)
    const b = computePdfContentHash(base)
    expect(a).toBe(b)
    expect(a).toHaveLength(16)
  })

  it("changes when gridData changes", () => {
    const a = computePdfContentHash(base)
    const b = computePdfContentHash({
      ...base,
      gridData: [["A", "C"]],
    })
    expect(a).not.toBe(b)
  })

  it("changes when largePrint or title changes", () => {
    const a = computePdfContentHash(base)
    expect(computePdfContentHash({ ...base, largePrint: true })).not.toBe(a)
    expect(computePdfContentHash({ ...base, title: "Autre titre" })).not.toBe(a)
  })

  it("builds blob path and matches urls", () => {
    const hash = "abc123def4567890"
    const path = buildPdfBlobPath("animaux-facile-01", hash)
    expect(path).toBe("pdfs/animaux-facile-01/abc123def4567890.pdf")
    expect(
      pdfUrlContainsHash(
        "https://example.blob.vercel-storage.com/pdfs/animaux-facile-01/abc123def4567890.pdf",
        hash,
      ),
    ).toBe(true)
    expect(pdfUrlContainsHash("https://example.com/old.pdf", hash)).toBe(false)
  })
})
