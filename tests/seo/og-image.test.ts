import { describe, expect, it, vi } from "vitest"
import {
  DEFAULT_OG_IMAGE_PATH,
  resolveOgImageUrl,
} from "@/lib/seo/og-image"
import {
  buildCategoryMetadata,
  buildHomeMetadata,
  buildPuzzleMetadata,
  buildStaticPageMetadata,
  openGraphMetadata,
} from "@/lib/seo/metadata"
import type { CategoryPageData, PuzzlePageData } from "@/lib/db/types/page-data"
import { ROUTES } from "@/lib/seo/routes"

vi.mock("@/lib/db/client", () => ({
  prisma: {
    seoMetaOverride: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
  },
}))

const SITE = "https://example.test"

const baseCategory: CategoryPageData = {
  id: "cat-1",
  type: "THEME",
  slug: "animaux",
  h1: "Mots mêlés Animaux",
  introText: "Intro",
  faqJson: [],
  seoTitle: "Mots mêlés Animaux gratuits",
  metaDescription: "Description animaux",
  canonicalPath: "/mots-meles-thematiques/animaux/",
  isIndexable: true,
  puzzleCount: 8,
  minPuzzleThreshold: 4,
  breadcrumbs: [],
  subCategories: [],
  puzzles: {
    items: [],
    page: 1,
    pageSize: 24,
    totalCount: 0,
    totalPages: 1,
  },
  relatedCategories: [],
  schema: {
    itemList: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "x",
      numberOfItems: 0,
      itemListElement: [],
    },
  },
}

const basePuzzle: PuzzlePageData = {
  id: "p-1",
  slug: "animaux-facile-01",
  title: "Animaux facile 01",
  grid: [],
  wordList: [],
  solutionData: { version: 1, size: 10, words: [] },
  size: 10,
  largePrint: false,
  difficulty: { slug: "facile", name: "Facile" },
  canonicalPath: "/mots-meles/animaux-facile-01/",
  breadcrumbs: [],
  relatedPuzzles: [],
  parentCategories: [],
  faqJson: [],
  schema: {
    creativeWork: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Animaux facile 01",
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [],
    },
  },
}

function firstOgImageUrl(metadata: { openGraph?: { images?: unknown } }) {
  const images = metadata.openGraph?.images
  if (!images) return undefined
  if (Array.isArray(images)) {
    const first = images[0]
    if (typeof first === "string") return first
    if (first && typeof first === "object" && "url" in first) {
      return String((first as { url: string }).url)
    }
  }
  return undefined
}

describe("resolveOgImageUrl", () => {
  it("returns absolute default OG image URL when no override", () => {
    expect(resolveOgImageUrl({ siteUrl: SITE })).toBe(`${SITE}${DEFAULT_OG_IMAGE_PATH}`)
  })

  it("returns absolute URL for relative override paths", () => {
    expect(resolveOgImageUrl({ override: "/custom-share.png", siteUrl: SITE })).toBe(
      `${SITE}/custom-share.png`,
    )
  })

  it("passes through absolute override URLs unchanged", () => {
    const custom = "https://cdn.example.test/puzzles/noel.png"
    expect(resolveOgImageUrl({ override: custom, siteUrl: SITE })).toBe(custom)
  })
})

describe("openGraphMetadata", () => {
  it("always includes default og:image when no override image is passed", () => {
    const og = openGraphMetadata({
      title: "Test",
      description: "Desc",
      canonicalPath: "/",
      siteUrl: SITE,
    })

    expect(firstOgImageUrl({ openGraph: og })).toBe(`${SITE}${DEFAULT_OG_IMAGE_PATH}`)
    expect(og?.images?.[0]).toMatchObject({
      width: 1200,
      height: 630,
      alt: "Hibou&Mots",
    })
  })

  it("uses override image when provided", () => {
    const custom = "https://cdn.example.test/override.png"
    const og = openGraphMetadata({
      title: "Test",
      description: "Desc",
      canonicalPath: "/",
      siteUrl: SITE,
      image: custom,
    })

    expect(firstOgImageUrl({ openGraph: og })).toBe(custom)
  })
})

describe("page metadata og:image fallback", () => {
  it("homepage emits default og:image", async () => {
    const metadata = await buildHomeMetadata(SITE)
    expect(firstOgImageUrl(metadata)).toBe(`${SITE}${DEFAULT_OG_IMAGE_PATH}`)
  })

  it("category page emits default og:image", async () => {
    const metadata = await buildCategoryMetadata(baseCategory, 1, SITE)
    expect(firstOgImageUrl(metadata)).toBe(`${SITE}${DEFAULT_OG_IMAGE_PATH}`)
  })

  it("puzzle page emits default og:image", async () => {
    const metadata = await buildPuzzleMetadata(basePuzzle, SITE)
    expect(firstOgImageUrl(metadata)).toBe(`${SITE}${DEFAULT_OG_IMAGE_PATH}`)
  })

  it("generator page emits default og:image", async () => {
    const metadata = await buildStaticPageMetadata({
      path: ROUTES.generateur,
      title: "Générateur",
      description: "Créer une grille",
      siteUrl: SITE,
    })
    expect(firstOgImageUrl(metadata)).toBe(`${SITE}${DEFAULT_OG_IMAGE_PATH}`)
  })

  it("online play page emits default og:image", async () => {
    const metadata = await buildStaticPageMetadata({
      path: ROUTES.jouer,
      title: "Jouer en ligne",
      description: "Jouer aux mots mêlés",
      siteUrl: SITE,
    })
    expect(firstOgImageUrl(metadata)).toBe(`${SITE}${DEFAULT_OG_IMAGE_PATH}`)
  })
})

describe("page metadata og:image override", () => {
  it("uses SeoMetaOverride.ogImage when set", async () => {
    const { prisma } = await import("@/lib/db/client")
    const custom = "https://cdn.example.test/custom-og.png"
    vi.mocked(prisma.seoMetaOverride.findUnique).mockResolvedValueOnce({
      title: null,
      metaDescription: null,
      canonicalOverride: null,
      ogImage: custom,
    })

    const metadata = await buildHomeMetadata(SITE)
    expect(firstOgImageUrl(metadata)).toBe(custom)
  })

  it("supports relative SeoMetaOverride.ogImage paths", async () => {
    const { prisma } = await import("@/lib/db/client")
    vi.mocked(prisma.seoMetaOverride.findUnique).mockResolvedValueOnce({
      title: null,
      metaDescription: null,
      canonicalOverride: null,
      ogImage: "/uploads/special-og.png",
    })

    const metadata = await buildCategoryMetadata(baseCategory, 1, SITE)
    expect(firstOgImageUrl(metadata)).toBe(`${SITE}/uploads/special-og.png`)
  })
})
