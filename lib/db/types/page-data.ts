import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs"
import type { CategorySchemaPayload, PuzzleSchemaPayload } from "@/lib/seo/schema"

export type CategoryType =
  | "GRADE"
  | "THEME"
  | "SEASONAL"
  | "DIFFICULTY"
  | "AUDIENCE"
  | "PRESS_BRAND"
  | "COMBO"

export type FaqItem = {
  question: string
  answer: string
}

export type SubCategoryLink = {
  id: string
  label: string
  href: string
  description?: string
  puzzleCount?: number
  badge?: string
}

export type RelatedCategoryLink = {
  id: string
  label: string
  href: string
  description?: string
  puzzleCount?: number
}

export type ComboParentLink = {
  label: string
  href: string
  description: string
}

export type PuzzleCardData = {
  id: string
  slug: string
  title: string
  href: string
  difficulty: { slug: string; name: string }
  grade?: { slug: string; name: string }
  theme?: { slug: string; name: string }
  size: number
  wordCount: number
  viewCount?: number
  thumbnailUrl?: string
}

export type PaginatedPuzzles = {
  items: PuzzleCardData[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type CategorySummary = {
  id: string
  type: CategoryType
  slug: string
  label: string
  href: string
}

export type CategoryPageData = {
  id: string
  type: CategoryType
  slug: string
  h1: string
  introText: string
  faqJson: FaqItem[]
  seoTitle: string
  metaDescription: string
  canonicalPath: string
  isIndexable: boolean
  puzzleCount: number
  minPuzzleThreshold: number
  breadcrumbs: BreadcrumbItem[]
  subCategories: SubCategoryLink[]
  puzzles: PaginatedPuzzles
  relatedCategories: RelatedCategoryLink[]
  comboParentLinks?: ComboParentLink[]
  grade?: { slug: string; name: string }
  theme?: { slug: string; name: string }
  difficulty?: { slug: string; name: string }
  pressBrand?: { slug: string; name: string }
  audienceLabel?: string
  schema: CategorySchemaPayload
}

export type PuzzlePageData = {
  id: string
  slug: string
  title: string
  grid: string[][]
  wordList: Array<{
    word: string
    row: number
    col: number
    direction: string
  }>
  solutionData: {
    version: 1
    size: number
    words: Array<{
      word: string
      cells: Array<{ row: number; col: number }>
    }>
  }
  size: number
  largePrint: boolean
  difficulty: { slug: string; name: string }
  grade?: { slug: string; name: string }
  theme?: { slug: string; name: string }
  pdfUrl?: string
  thumbnailUrl?: string
  metaTitle?: string
  metaDescription?: string
  canonicalPath: string
  breadcrumbs: BreadcrumbItem[]
  relatedPuzzles: PuzzleCardData[]
  parentCategories: CategorySummary[]
  faqJson: FaqItem[]
  schema: PuzzleSchemaPayload
}
