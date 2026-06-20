import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/client"
import { mapPuzzleToCardData } from "@/lib/db/queries/mappers"
import type { CategoryType } from "@/lib/db/types/page-data"
import { resolveCategoryPath } from "@/lib/seo/routes"
import type { SearchCategoryHit, SearchFilters, SearchInput, SearchPagination } from "./types"
import { SEARCH_PAGE_SIZE } from "./types"

type PuzzleSearchRow = {
  id: string
  slug: string
  title: string
  size: number
  view_count: number
  thumbnail_url: string | null
  word_list: unknown
  difficulty_slug: string
  difficulty_name: string
  grade_slug: string | null
  grade_name: string | null
  theme_slug: string | null
  theme_name: string | null
  rank: number | null
}

type CategorySearchRow = {
  id: string
  slug: string
  h1: string
  type: string
  intro_text: string
  grade_slug: string | null
  theme_slug: string | null
  difficulty_slug: string | null
  press_brand_slug: string | null
}

function mapPuzzleRow(row: PuzzleSearchRow) {
  const wordList = Array.isArray(row.word_list) ? row.word_list : []
  return mapPuzzleToCardData({
    id: row.id,
    slug: row.slug,
    title: row.title,
    size: row.size,
    viewCount: row.view_count,
    thumbnailUrl: row.thumbnail_url,
    wordList,
    difficulty: { slug: row.difficulty_slug, name: row.difficulty_name },
    grade: row.grade_slug
      ? { slug: row.grade_slug, name: row.grade_name ?? row.grade_slug }
      : null,
    theme: row.theme_slug
      ? { slug: row.theme_slug, name: row.theme_name ?? row.theme_slug }
      : null,
  } as Parameters<typeof mapPuzzleToCardData>[0])
}

function mapCategoryRow(row: CategorySearchRow): SearchCategoryHit {
  return {
    id: row.id,
    slug: row.slug,
    label: row.h1,
    href: resolveCategoryPath({
      type: row.type as CategoryType,
      slug: row.slug,
      grade: row.grade_slug ? { slug: row.grade_slug } : null,
      theme: row.theme_slug ? { slug: row.theme_slug } : null,
      difficulty: row.difficulty_slug ? { slug: row.difficulty_slug } : null,
      pressBrand: row.press_brand_slug ? { slug: row.press_brand_slug } : null,
    }),
    type: row.type,
    description: row.intro_text?.slice(0, 120),
  }
}

function filterClause(filters: SearchFilters) {
  return Prisma.sql`
    AND (${filters.theme ?? null}::text IS NULL OR t.slug = ${filters.theme ?? null})
    AND (${filters.grade ?? null}::text IS NULL OR g.slug = ${filters.grade ?? null})
    AND (${filters.difficulty ?? null}::text IS NULL OR d.slug = ${filters.difficulty ?? null})
    AND (
      ${filters.category ?? null}::text IS NULL
      OR c.slug = ${filters.category ?? null}
      OR t.slug = ${filters.category ?? null}
      OR g.slug = ${filters.category ?? null}
      OR d.slug = ${filters.category ?? null}
    )
  `
}

function textMatchClause(query: string, pattern: string) {
  return Prisma.sql`
    (
      to_tsvector(
        'french',
        coalesce(p.title, '') || ' ' ||
        coalesce(t.name, '') || ' ' ||
        coalesce(g.name, '') || ' ' ||
        coalesce(d.name, '') || ' ' ||
        coalesce(c.h1, '') || ' ' ||
        coalesce(c.slug, '')
      ) @@ plainto_tsquery('french', ${query})
      OR p.title ILIKE ${pattern}
      OR t.name ILIKE ${pattern}
      OR g.name ILIKE ${pattern}
      OR d.name ILIKE ${pattern}
      OR c.h1 ILIKE ${pattern}
      OR c.slug ILIKE ${pattern}
    )
  `
}

async function searchPuzzleRows(
  input: SearchInput,
  pattern: string,
): Promise<{ rows: PuzzleSearchRow[]; totalCount: number }> {
  const offset = (input.page - 1) * SEARCH_PAGE_SIZE
  const filters = filterClause(input.filters)

  const countRows = input.query
    ? await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(DISTINCT p.id)::bigint AS count
        FROM puzzles p
        INNER JOIN difficulties d ON p.difficulty_id = d.id
        LEFT JOIN grades g ON p.grade_id = g.id
        LEFT JOIN themes t ON p.theme_id = t.id
        LEFT JOIN category_puzzles cp ON cp.puzzle_id = p.id
        LEFT JOIN categories c ON cp.category_id = c.id
        WHERE p.status = 'PUBLISHED'
        AND ${textMatchClause(input.query, pattern)}
        ${filters}
      `
    : await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(DISTINCT p.id)::bigint AS count
        FROM puzzles p
        INNER JOIN difficulties d ON p.difficulty_id = d.id
        LEFT JOIN grades g ON p.grade_id = g.id
        LEFT JOIN themes t ON p.theme_id = t.id
        LEFT JOIN category_puzzles cp ON cp.puzzle_id = p.id
        LEFT JOIN categories c ON cp.category_id = c.id
        WHERE p.status = 'PUBLISHED'
        ${filters}
      `

  const totalCount = Number(countRows[0]?.count ?? 0)

  const rows = input.query
    ? await prisma.$queryRaw<PuzzleSearchRow[]>`
        WITH matched AS (
          SELECT
            p.id,
            MAX(
              ts_rank(
                to_tsvector(
                  'french',
                  coalesce(p.title, '') || ' ' ||
                  coalesce(t.name, '') || ' ' ||
                  coalesce(g.name, '') || ' ' ||
                  coalesce(d.name, '') || ' ' ||
                  coalesce(c.h1, '') || ' ' ||
                  coalesce(c.slug, '')
                ),
                plainto_tsquery('french', ${input.query})
              )
            ) AS rank
          FROM puzzles p
          INNER JOIN difficulties d ON p.difficulty_id = d.id
          LEFT JOIN grades g ON p.grade_id = g.id
          LEFT JOIN themes t ON p.theme_id = t.id
          LEFT JOIN category_puzzles cp ON cp.puzzle_id = p.id
          LEFT JOIN categories c ON cp.category_id = c.id
          WHERE p.status = 'PUBLISHED'
          AND ${textMatchClause(input.query, pattern)}
          ${filters}
          GROUP BY p.id
        )
        SELECT
          p.id,
          p.slug,
          p.title,
          p.size,
          p.view_count,
          p.thumbnail_url,
          p.word_list,
          d.slug AS difficulty_slug,
          d.name AS difficulty_name,
          g.slug AS grade_slug,
          g.name AS grade_name,
          t.slug AS theme_slug,
          t.name AS theme_name,
          m.rank
        FROM matched m
        INNER JOIN puzzles p ON p.id = m.id
        INNER JOIN difficulties d ON p.difficulty_id = d.id
        LEFT JOIN grades g ON p.grade_id = g.id
        LEFT JOIN themes t ON p.theme_id = t.id
        ORDER BY m.rank DESC NULLS LAST, p.view_count DESC, p.title ASC
        LIMIT ${SEARCH_PAGE_SIZE}
        OFFSET ${offset}
      `
    : await prisma.$queryRaw<PuzzleSearchRow[]>`
        SELECT DISTINCT ON (p.id)
          p.id,
          p.slug,
          p.title,
          p.size,
          p.view_count,
          p.thumbnail_url,
          p.word_list,
          d.slug AS difficulty_slug,
          d.name AS difficulty_name,
          g.slug AS grade_slug,
          g.name AS grade_name,
          t.slug AS theme_slug,
          t.name AS theme_name,
          NULL::float8 AS rank
        FROM puzzles p
        INNER JOIN difficulties d ON p.difficulty_id = d.id
        LEFT JOIN grades g ON p.grade_id = g.id
        LEFT JOIN themes t ON p.theme_id = t.id
        LEFT JOIN category_puzzles cp ON cp.puzzle_id = p.id
        LEFT JOIN categories c ON cp.category_id = c.id
        WHERE p.status = 'PUBLISHED'
        ${filters}
        ORDER BY p.id, p.view_count DESC
        LIMIT ${SEARCH_PAGE_SIZE}
        OFFSET ${offset}
      `

  const orderedRows = input.query
    ? rows
    : [...rows].sort((a, b) => b.view_count - a.view_count || a.title.localeCompare(b.title))

  return { rows: orderedRows, totalCount }
}

async function searchCategoryRows(query: string, pattern: string): Promise<SearchCategoryHit[]> {
  if (!query) return []

  const rows = await prisma.$queryRaw<CategorySearchRow[]>`
    SELECT DISTINCT ON (c.id)
      c.id,
      c.slug,
      c.h1,
      c.type::text AS type,
      c.intro_text,
      g.slug AS grade_slug,
      t.slug AS theme_slug,
      d.slug AS difficulty_slug,
      pb.slug AS press_brand_slug
    FROM categories c
    LEFT JOIN grades g ON c.grade_id = g.id
    LEFT JOIN themes t ON c.theme_id = t.id
    LEFT JOIN difficulties d ON c.difficulty_id = d.id
    LEFT JOIN press_brands pb ON c.press_brand_id = pb.id
    WHERE c.status = 'PUBLISHED'
    AND (
      to_tsvector(
        'french',
        coalesce(c.h1, '') || ' ' ||
        coalesce(c.seo_title, '') || ' ' ||
        coalesce(c.slug, '') || ' ' ||
        coalesce(t.name, '') || ' ' ||
        coalesce(g.name, '')
      ) @@ plainto_tsquery('french', ${query})
      OR c.h1 ILIKE ${pattern}
      OR c.slug ILIKE ${pattern}
      OR t.name ILIKE ${pattern}
      OR g.name ILIKE ${pattern}
    )
    ORDER BY c.id
    LIMIT 8
  `

  return rows.map(mapCategoryRow)
}

export async function searchWithDatabase(
  input: SearchInput,
): Promise<{ puzzles: SearchPagination; categories: SearchCategoryHit[] } | null> {
  if (process.env.VITEST === "true" || process.env.PILOT_USE_MOCK_ONLY === "true") {
    return null
  }

  try {
    const pattern = `%${input.query}%`
    const { rows, totalCount } = await searchPuzzleRows(input, pattern)
    const categories = await searchCategoryRows(input.query, pattern)

    const totalPages = totalCount === 0 ? 0 : Math.max(1, Math.ceil(totalCount / SEARCH_PAGE_SIZE))

    return {
      puzzles: {
        items: rows.map(mapPuzzleRow),
        page: totalPages === 0 ? 1 : Math.min(input.page, totalPages),
        pageSize: SEARCH_PAGE_SIZE,
        totalCount,
        totalPages,
      },
      categories,
    }
  } catch (error) {
    console.error("PostgreSQL search failed", error)
    return null
  }
}
