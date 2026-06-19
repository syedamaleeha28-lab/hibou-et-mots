import type { Metadata } from "next"
import { prisma } from "@/lib/db/client"
import type { CategoryPageData, PuzzlePageData } from "@/lib/db/types/page-data"
import { buildCanonicalPath, buildCanonicalUrl, normalizePath } from "./canonical"
import { robotsDirective, robotsMetaContent, type RobotsDirective } from "./indexability"

const SITE_NAME = "Hibou&Mots"

export type SeoOverride = {
  title?: string | null
  metaDescription?: string | null
  canonicalOverride?: string | null
  ogImage?: string | null
}

export async function lookupSeoMetaOverride(path: string): Promise<SeoOverride | null> {
  try {
    return await prisma.seoMetaOverride.findUnique({
      where: { path: normalizePath(path) },
      select: {
        title: true,
        metaDescription: true,
        canonicalOverride: true,
        ogImage: true,
      },
    })
  } catch {
    return null
  }
}

export function robotsMetadata(directive: RobotsDirective): Pick<Metadata, "robots"> {
  const content = robotsMetaContent(directive)
  return content ? { robots: content } : {}
}

export function openGraphMetadata(input: {
  title: string
  description: string
  canonicalPath: string
  siteUrl?: string
  type?: "website" | "article"
  image?: string | null
}): Metadata["openGraph"] {
  const url = buildCanonicalUrl({ path: input.canonicalPath, siteUrl: input.siteUrl })
  return {
    title: input.title,
    description: input.description,
    url,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: input.type ?? "website",
    ...(input.image ? { images: [{ url: input.image }] } : {}),
  }
}

export async function buildCategoryMetadata(
  category: CategoryPageData,
  page = 1,
  siteUrl?: string,
): Promise<Metadata> {
  const override = await lookupSeoMetaOverride(category.canonicalPath)
  const robots = robotsDirective({
    pageType: "category",
    isIndexable: category.isIndexable,
    page,
  })

  const title =
    override?.title ??
    (page > 1 ? `${category.seoTitle} — Page ${page}` : category.seoTitle)
  const description = override?.metaDescription ?? category.metaDescription
  const canonicalPath = buildCanonicalPath({
    path: category.canonicalPath,
    page,
    override: override?.canonicalOverride,
  })

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonicalUrl({
        path: category.canonicalPath,
        page,
        siteUrl,
        override: override?.canonicalOverride,
      }),
    },
    ...robotsMetadata(robots),
    openGraph: openGraphMetadata({
      title,
      description,
      canonicalPath,
      siteUrl,
      type: "website",
      image: override?.ogImage,
    }),
  }
}

export async function buildPuzzleMetadata(
  puzzle: PuzzlePageData,
  siteUrl?: string,
): Promise<Metadata> {
  const override = await lookupSeoMetaOverride(puzzle.canonicalPath)
  const robots = robotsDirective({
    pageType: "puzzle",
    isPublished: true,
  })

  const title = override?.title ?? puzzle.metaTitle ?? puzzle.title
  const description =
    override?.metaDescription ??
    puzzle.metaDescription ??
    `Jouez et imprimez ce mots mêlés gratuit : ${puzzle.title}. Grille ${puzzle.size}×${puzzle.size}, difficulté ${puzzle.difficulty.name}.`

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonicalUrl({
        path: puzzle.canonicalPath,
        siteUrl,
        override: override?.canonicalOverride,
      }),
    },
    ...robotsMetadata(robots),
    openGraph: openGraphMetadata({
      title,
      description,
      canonicalPath: puzzle.canonicalPath,
      siteUrl,
      type: "article",
      image: override?.ogImage,
    }),
  }
}

export async function buildHomeMetadata(siteUrl?: string): Promise<Metadata> {
  const path = "/"
  const override = await lookupSeoMetaOverride(path)
  const title = override?.title ?? "Hibou&Mots — Mots mêlés gratuits à imprimer et jouer en ligne"
  const description =
    override?.metaDescription ??
    "Des mots mêlés gratuits en français pour les enfants, les enseignants et toute la famille. Grilles à imprimer, thèmes variés et générateur en ligne."

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonicalUrl({ path, siteUrl, override: override?.canonicalOverride }),
    },
    openGraph: openGraphMetadata({
      title,
      description,
      canonicalPath: path,
      siteUrl,
      type: "website",
      image: override?.ogImage,
    }),
  }
}

export async function buildStaticPageMetadata(input: {
  path: string
  title: string
  description: string
  siteUrl?: string
}): Promise<Metadata> {
  const override = await lookupSeoMetaOverride(input.path)
  const title = override?.title ?? input.title
  const description = override?.metaDescription ?? input.description

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonicalUrl({
        path: input.path,
        siteUrl: input.siteUrl,
        override: override?.canonicalOverride,
      }),
    },
    ...robotsMetadata({ index: true, follow: true }),
    openGraph: openGraphMetadata({
      title,
      description,
      canonicalPath: input.path,
      siteUrl: input.siteUrl,
      type: "website",
      image: override?.ogImage,
    }),
  }
}
