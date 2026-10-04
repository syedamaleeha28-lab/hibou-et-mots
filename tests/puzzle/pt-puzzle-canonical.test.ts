import { beforeEach, describe, expect, it, vi } from "vitest"
import { mockDifficultyRecord } from "@/lib/db/adapters/mock-utils"
import { mapPuzzleToPageData } from "@/lib/db/queries/mappers"
import { buildPuzzleMetadata } from "@/lib/seo/metadata"
import { DEFAULT_SITE_URL } from "@/lib/seo/routes"
import { buildPuzzlePageSchemaGraph } from "@/lib/seo/schema/page-schemas"

const resolvePuzzlePageData = vi.hoisted(() => vi.fn())
const permanentRedirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`REDIRECT ${url}`)
  }),
)
const notFound = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error("NOT_FOUND")
  }),
)

vi.mock("next/navigation", () => ({
  permanentRedirect,
  notFound,
}))

vi.mock("@/lib/db/queries/pilot", () => ({
  resolvePuzzlePageData,
}))

vi.mock("@/components/templates/puzzle", () => ({
  PuzzleTemplate: () => null,
  buildPuzzleMetadata: vi.fn(async () => ({ title: "fr" })),
}))

import PuzzlePage, { generateMetadata } from "@/app/(fr)/mots-meles/[slug]/page"

function puzzleRecord(slug: string, language: "fr" | "pt-BR") {
  return {
    id: `puzzle-${slug}`,
    slug,
    title: slug,
    gridData: [["A"]],
    wordList: [],
    solutionData: { words: [] },
    size: 1,
    difficultyId: "diff",
    gradeId: null,
    themeId: null,
    language,
    status: "PUBLISHED" as const,
    largePrint: false,
    pdfUrl: null,
    thumbnailUrl: null,
    viewCount: 0,
    printCount: 0,
    metaTitle: slug,
    metaDescription: slug,
    createdAt: new Date(),
    updatedAt: new Date(),
    difficulty: mockDifficultyRecord({ slug: "facile", name: "Facile" }),
    grade: null,
    theme: null,
    categories: [],
  }
}

describe("puzzle canonical by language", () => {
  it("uses /caca-palavras/{slug}/ for a pt-BR puzzle", async () => {
    const slug = "animais-facil-01-pt"
    const page = mapPuzzleToPageData(puzzleRecord(slug, "pt-BR"), [])
    const path = `/caca-palavras/${slug}/`
    const absolute = `${DEFAULT_SITE_URL}${path}`

    expect(page.canonicalPath).toBe(path)
    expect(page.breadcrumbs.at(-1)?.href).toBe(path)
    expect(page.schema.creativeWork.url).toBe(absolute)

    const graph = JSON.stringify(buildPuzzlePageSchemaGraph(page, DEFAULT_SITE_URL))
    expect(graph).toContain(absolute)
    expect(graph).not.toContain(`${DEFAULT_SITE_URL}/mots-meles/${slug}/`)

    const metadata = await buildPuzzleMetadata(page, DEFAULT_SITE_URL)
    expect(metadata.alternates?.canonical).toBe(absolute)
    expect(metadata.openGraph?.url).toBe(absolute)
  })

  it("keeps /mots-meles/{slug}/ for a French puzzle", async () => {
    const slug = "animaux-facile-01"
    const page = mapPuzzleToPageData(puzzleRecord(slug, "fr"), [])
    const path = `/mots-meles/${slug}/`
    const absolute = `${DEFAULT_SITE_URL}${path}`

    expect(page.canonicalPath).toBe(path)
    expect(page.breadcrumbs.at(-1)?.href).toBe(path)
    expect(page.schema.creativeWork.url).toBe(absolute)

    const metadata = await buildPuzzleMetadata(page, DEFAULT_SITE_URL)
    expect(metadata.alternates?.canonical).toBe(absolute)
    expect(metadata.openGraph?.url).toBe(absolute)
  })
})

describe("French puzzle route redirect", () => {
  beforeEach(() => {
    resolvePuzzlePageData.mockReset()
    permanentRedirect.mockClear()
  })

  it("permanently redirects only pt-BR puzzles", async () => {
    const slug = "animais-facil-01-pt"
    resolvePuzzlePageData.mockResolvedValue({ language: "pt-BR", slug })

    await expect(PuzzlePage({ params: Promise.resolve({ slug }) })).rejects.toThrow(
      `REDIRECT /caca-palavras/${slug}/`,
    )
    await expect(generateMetadata({ params: Promise.resolve({ slug }) })).rejects.toThrow(
      `REDIRECT /caca-palavras/${slug}/`,
    )

    permanentRedirect.mockClear()
    resolvePuzzlePageData.mockResolvedValue({ language: "fr", slug: "animaux-facile-01" })
    await expect(
      PuzzlePage({ params: Promise.resolve({ slug: "animaux-facile-01" }) }),
    ).resolves.toBeTruthy()
    await expect(
      generateMetadata({ params: Promise.resolve({ slug: "animaux-facile-01" }) }),
    ).resolves.toMatchObject({ title: "fr" })
    expect(permanentRedirect).not.toHaveBeenCalled()
  })
})
