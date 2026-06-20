import { beforeEach, describe, expect, it, vi } from "vitest"
import { mockAnimauxPuzzlePageData } from "@/lib/db/adapters/mock-pilot"
import { puzzleRecordToPdfInput } from "@/lib/pdf/map-record"
import { computePdfContentHash, buildPdfBlobPath } from "@/lib/pdf/content-hash"

const getPuzzleForPdf = vi.fn()
const persistPuzzlePdfUrl = vi.fn()
const recordPdfDownload = vi.fn()
const uploadPdfBuffer = vi.fn()
const renderPuzzlePdfToBuffer = vi.fn()

vi.mock("@/lib/db/queries/pdf", () => ({
  getPuzzleForPdf: (...args: unknown[]) => getPuzzleForPdf(...args),
  persistPuzzlePdfUrl: (...args: unknown[]) => persistPuzzlePdfUrl(...args),
  recordPdfDownload: (...args: unknown[]) => recordPdfDownload(...args),
}))

vi.mock("@/lib/pdf/storage", () => ({
  uploadPdfBuffer: (...args: unknown[]) => uploadPdfBuffer(...args),
  PdfStorageError: class PdfStorageError extends Error {},
}))

vi.mock("@/lib/pdf/render", () => ({
  renderPuzzlePdfToBuffer: (...args: unknown[]) => renderPuzzlePdfToBuffer(...args),
}))

import { PdfNotFoundError, resolvePuzzlePdfUrl } from "@/lib/pdf/service"

function mockDbPuzzle(overrides: Partial<ReturnType<typeof buildRecord>> = {}) {
  return buildRecord(overrides)
}

function buildRecord(overrides: Record<string, unknown> = {}) {
  const page = mockAnimauxPuzzlePageData()
  const hash = computePdfContentHash({
    gridData: page.grid,
    solutionData: page.solutionData,
    largePrint: page.largePrint,
    title: page.title,
  })

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    gridData: page.grid,
    wordList: page.wordList,
    solutionData: page.solutionData,
    size: page.size,
    largePrint: page.largePrint,
    pdfUrl: null as string | null,
    status: "PUBLISHED" as const,
    hash,
    ...overrides,
  }
}

describe("resolvePuzzlePdfUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    renderPuzzlePdfToBuffer.mockResolvedValue(Buffer.from("%PDF-mock"))
    uploadPdfBuffer.mockImplementation(async ({ slug, hash }: { slug: string; hash: string }) =>
      `https://blob.example/${buildPdfBlobPath(slug, hash)}`,
    )
    persistPuzzlePdfUrl.mockResolvedValue(undefined)
    recordPdfDownload.mockResolvedValue(undefined)
  })

  it("throws when puzzle is missing", async () => {
    getPuzzleForPdf.mockResolvedValue(null)
    await expect(resolvePuzzlePdfUrl("missing", "session-1")).rejects.toBeInstanceOf(
      PdfNotFoundError,
    )
  })

  it("returns cache hit when pdfUrl matches content hash", async () => {
    const record = mockDbPuzzle()
    const cachedUrl = `https://blob.example/${buildPdfBlobPath(record.slug, record.hash)}`
    getPuzzleForPdf.mockResolvedValue({ ...record, pdfUrl: cachedUrl })

    const result = await resolvePuzzlePdfUrl(record.id, "session-1")

    expect(result.cacheHit).toBe(true)
    expect(result.url).toBe(cachedUrl)
    expect(renderPuzzlePdfToBuffer).not.toHaveBeenCalled()
    expect(uploadPdfBuffer).not.toHaveBeenCalled()
    expect(persistPuzzlePdfUrl).not.toHaveBeenCalled()
    expect(recordPdfDownload).toHaveBeenCalledWith(record.id, "session-1")
  })

  it("generates, uploads, and persists on cache miss", async () => {
    const record = mockDbPuzzle({ pdfUrl: null })
    getPuzzleForPdf.mockResolvedValue(record)

    const result = await resolvePuzzlePdfUrl(record.id, "session-2")

    expect(result.cacheHit).toBe(false)
    expect(result.url).toContain(record.hash)
    expect(renderPuzzlePdfToBuffer).toHaveBeenCalledWith(puzzleRecordToPdfInput(record))
    expect(uploadPdfBuffer).toHaveBeenCalled()
    expect(persistPuzzlePdfUrl).toHaveBeenCalledWith(record.id, result.url)
    expect(recordPdfDownload).toHaveBeenCalledWith(record.id, "session-2")
  })

  it("regenerates when pdfUrl is stale (hash mismatch)", async () => {
    const record = mockDbPuzzle({
      pdfUrl: "https://blob.example/pdfs/animaux-facile-01/stalehash.pdf",
    })
    getPuzzleForPdf.mockResolvedValue(record)

    const result = await resolvePuzzlePdfUrl(record.id, "session-3")

    expect(result.cacheHit).toBe(false)
    expect(renderPuzzlePdfToBuffer).toHaveBeenCalled()
    expect(persistPuzzlePdfUrl).toHaveBeenCalled()
  })
})
