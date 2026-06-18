# Database Architecture — Hibou & Mots

**Phase:** A (foundations)  
**ORM:** Prisma 6 · **Database:** PostgreSQL 16  
**Source of truth:** `PRD_Mots_Meles.md` Section 24 · `IMPLEMENTATION_BLUEPRINT.md` Section 2

---

## Overview

The data layer separates **reference entities** (grades, themes, difficulties) from **publishable pages** (`Category`) and **puzzle content** (`Puzzle`). A puzzle can appear in multiple categories via `CategoryPuzzle` without duplicating URLs.

```
grades ─────────────┐
themes ─────────────┼──► puzzles ◄────► categories (many-to-many)
difficulties ───────┘         │
                              └── theme_words (generation input)
press_brands ──► categories (1:1 optional)
```

---

## Models (12 tables)

| Prisma model | SQL table | Role |
|--------------|-----------|------|
| `Grade` | `grades` | School level reference (7 rows seeded) |
| `Theme` | `themes` | Theme/season reference (15 MVP themes seeded) |
| `ThemeWord` | `theme_words` | Word bank per theme for puzzle generation |
| `Difficulty` | `difficulties` | Facile → Géant presets (4 rows seeded) |
| `PressBrand` | `press_brands` | Press brand reference (empty at seed) |
| `Category` | `categories` | **Publishable page** (grade, theme, combo, etc.) |
| `Puzzle` | `puzzles` | Grid content + metadata |
| `CategoryPuzzle` | `category_puzzles` | M:N join — puzzle listed on multiple categories |
| `Redirect` | `redirects` | 301 slug history |
| `SeoMetaOverride` | `seo_meta_overrides` | Per-path SEO overrides |
| `AnalyticsEvent` | `analytics_events` | Internal product events |
| `AdminUser` | `admin_users` | Editorial accounts (no seed — Phase F) |

### Enums

- `CategoryType`: `GRADE`, `THEME`, `SEASONAL`, `DIFFICULTY`, `AUDIENCE`, `PRESS_BRAND`, `COMBO`
- `ContentStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `AdminRole`: `ADMIN`, `EDITOR`

---

## Key design decisions

### Category ≠ Theme / Grade

A `Theme` or `Grade` can exist without a live page. `Category` carries SEO fields, `status`, and `minPuzzleThreshold` (default **4**). Publication logic (Phase C) will set `noindex` when puzzle count is below threshold.

### Flat puzzle namespace

Puzzles use unique `slug` at `/mots-meles/{slug}/`. Many-to-many via `CategoryPuzzle` avoids canonical duplication.

### `Puzzle.largePrint`

Boolean (default `false`) — Blueprint addition for seniors high-legibility mode, independent of difficulty.

### JSON puzzle fields

| Field | Purpose |
|-------|---------|
| `gridData` | Letter matrix |
| `wordList` | `[{ word, row, col, direction }]` per PRD |
| `solutionData` | Coordinates for solution reveal + PDF page 2 |

---

## Indexes

Declared in `prisma/schema.prisma`:

- `puzzles`: `slug`, `theme_id`, `grade_id`, `difficulty_id`, `status`
- `categories`: `slug` (unique), `type`, `status`
- `category_puzzles`: composite PK + indexes on both FKs
- `theme_words`: `theme_id`
- `redirects`: `from_path` (unique)
- `analytics_events`: `puzzle_id`, `event_type`

**Phase E (search):** add PostgreSQL `pg_trgm` / `tsvector` indexes via raw migration when search ships.

---

## Client usage

```typescript
import { prisma } from "@/lib/db"

const themes = await prisma.theme.findMany({ where: { isSeasonal: true } })
```

Singleton pattern in `lib/db/client.ts` prevents connection exhaustion in Next.js dev.

---

## Migrations & seed

```bash
# Start local PostgreSQL
docker compose up -d

# Copy env and run migrations
cp .env.example .env
pnpm install
pnpm db:migrate        # creates tables (dev)
pnpm db:seed           # reference data

# Production deploy
pnpm db:migrate:deploy
pnpm db:seed
```

### Seed contents (Phase A)

| Dataset | Count | File |
|---------|-------|------|
| Grades | 7 | `prisma/seed/grades.ts` |
| Difficulties | 4 | `prisma/seed/difficulties.ts` |
| Themes | 15 | `prisma/seed/themes.ts` |
| Theme words | 225 (15/theme) | `prisma/seed/theme-words.ts` |

Seed is **idempotent** (`upsert` for reference tables; theme words replaced per theme on re-run).

**Not seeded in Phase A:** categories, puzzles, press brands, admin users, redirects, SEO overrides, analytics events.

---

## Folder layout (data layer)

```
prisma/
├── schema.prisma          # Full schema
├── seed.ts                # Entry point
├── seed/
│   ├── grades.ts
│   ├── difficulties.ts
│   ├── themes.ts
│   └── theme-words.ts
└── migrations/            # Versioned SQL

lib/db/
├── client.ts              # Prisma singleton
└── index.ts               # Public export
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |

---

## Next phases (not in scope)

| Phase | Database work |
|-------|----------------|
| C | Seed categories + puzzles; publication threshold queries |
| E | `pg_trgm` search indexes; sitemap queries |
| F | AdminUser seed; AnalyticsEvent writes |
| H | PressBrand seed (5 brands); combo category bulk insert |

---

*See also: `IMPLEMENTATION_BLUEPRINT.md` Section 2, `PRD_Mots_Meles.md` Section 24.*
