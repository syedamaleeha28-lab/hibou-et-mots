# Phase B — Puzzle Engine Plan

**Status:** Approved — implementation in progress  
**Scope:** PRD Section 25 · Blueprint `lib/puzzle-engine/` · Build Order step 3  
**Reference docs:** `PRD_Mots_Meles.md`, `IMPLEMENTATION_BLUEPRINT.md`, `style-guide.html`

---

## Executive summary

Phase A delivered the database schema (including `Puzzle.largePrint` and seeded `Difficulty`/`Grade` reference data) and a **prototype** puzzle generator used on the homepage. Phase B must replace that prototype with a production-grade engine: PRD-compliant generation, validation, DB-ready output shapes, French letter frequency, difficulty/grade presets, and Vitest coverage — **before** puzzle pages, admin CRUD, or PDF export depend on it.

The current engine is ~155 lines in a single file. It proves the UI concept but fails several PRD 25.1/25.5 requirements and is not wired to the database model.

The roadmap targets **100+ MVP puzzles** and eventually **thousands of programmatic pages** — bulk generation performance and predictable resource use are first-class requirements, not a Phase 2 afterthought.

---

## Performance requirement

The puzzle engine must support **bulk generation of at least 1,000 puzzles** without memory leaks or exponential slowdown. This applies to admin batch jobs (Phase C/F) and future programmatic SEO pipelines.

### Benchmark strategy

| Benchmark | Target | How |
|-----------|--------|-----|
| **Bulk throughput** | 1,000 puzzles in ≤ 5 min on a typical dev machine (Node 20+, facile/moyen mix) | `tests/puzzle-engine/benchmark.test.ts` — runs 1,000 `generatePuzzle()` calls sequentially; asserts wall-clock &lt; 300 s and heap growth &lt; 50 MB |
| **Single puzzle latency** | Facile 8×8 ≤ 50 ms p95; Géant 20×20 ≤ 2 s p95 | Micro-benchmark with 100 iterations per difficulty; p95 tracked in test (loose CI bounds) |
| **Batch API** | `generatePuzzleBatch(1000 requests)` completes with full failure report | Integration test with themed word fixtures |
| **Regression gate** | `pnpm test` includes benchmark suite tagged `@benchmark` — skippable locally via `vitest --exclude benchmark` | CI runs full suite on merge |

Benchmarks use **deterministic seeds** so results are reproducible across machines. Heap snapshots taken via `process.memoryUsage().heapUsed` before/after batch.

### Time complexity notes

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Single placement attempt | **O(L)** | L = word length; constant cell checks |
| Per-word placement (capped) | **O(A × D × L)** | A = `maxAttemptsPerWord` (default 100); D = allowed directions (2–8) |
| Per puzzle (W words, grid S×S) | **O(R × W × A × D × L + S²)** | R = resize restarts (bounded by `maxSize − initialSize`); fill is O(S²) |
| Validation | **O(W × L + P²)** | P = placements; crossing check O(P²) intersections — small in practice |
| **Bulk N puzzles** | **O(N × puzzle cost)** | Linear in N when puzzles are independent; **no shared mutable module state** |

**Anti-patterns avoided:** unbounded shuffle of all S² start positions per attempt (old prototype); unbounded retry without resize cap; accumulating global caches across batch items.

Worst-case Géant (20×20, 25 words, 8 directions) is bounded by `timeBudgetMs` (default 5 s, 15 s for géant) — returns `PLACEMENT_FAILED` or `TIME_BUDGET_EXCEEDED` instead of hanging.

### Bulk generation safeguards

1. **`generatePuzzleBatch()`** — sequential by default (concurrency = 1); no worker pool in Phase B.
2. **`maxBatchSize`** — default 2,000; throws if exceeded.
3. **`globalTimeBudgetMs`** — default 300,000 (5 min); stops batch with partial results + failures.
4. **`perPuzzleTimeBudgetMs`** — inherited from `GenerateOptions.timeBudgetMs`.
5. **No module-level mutable state** — each call allocates local grids; results returned, not cached internally.
6. **Explicit `null` release** — batch loop does not retain references to succeeded puzzles beyond the returned array (caller persists).
7. **Progress-free design** — Phase B returns full `BatchResult` at end; streaming callbacks deferred to Phase F admin UI.

### Deterministic seed support

| Context | Seed behaviour |
|---------|----------------|
| Single `generatePuzzle({ seed: 42 })` | Identical grid on every run (mulberry32 PRNG) |
| Batch with `seedBase: 1000` | Request *i* uses `seed: 1000 + i` unless request overrides |
| SSR demo (hero) | Fixed seed via compat `generateGrid(..., seed)` |
| Production single generation | Omit `seed` → `randomSeed()` from `crypto.getRandomValues` (Node/browser) |

Seeds affect: placement order, random position/direction picks, and frequency-weighted fill. Tests always pass explicit seeds.

### Failure reporting for batch generation

```typescript
type BatchResult = {
  successes: Array<{ id: string; result: PuzzleResult; elapsedMs: number }>
  failures: Array<{
    id: string
    code: PuzzleErrorCode
    message: string
    elapsedMs: number
    options: GenerateOptions  // snapshot for retry
  }>
  stats: { requested: number; succeeded: number; failed: number; aborted: boolean }
  totalElapsedMs: number
}
```

- Each failure records **error code**, **elapsed time**, and **original options** for admin retry.
- `aborted: true` when `globalTimeBudgetMs` exceeded mid-batch.
- Batch never throws on individual failures (unless `stopOnFirstFailure: true`).
- Summary log-friendly: `stats` + first 10 failure codes for cron jobs.

### New file

```
lib/puzzle-engine/batch.ts   # generatePuzzleBatch()
tests/puzzle-engine/benchmark.test.ts
tests/puzzle-engine/batch.test.ts
```

---

## 1. Current engine capabilities

### 1.1 `lib/puzzle-engine/`

| File | Role |
|------|------|
| `generate.ts` | Core algorithm + utilities |
| `index.ts` | Re-exports `generateGrid`, `normalizeWord`, `lineBetween`, `cellsEqual`, types |

**What works today:**

| Capability | Implementation | Notes |
|------------|----------------|-------|
| Word normalization | `normalizeWord()` — NFD accent strip, uppercase, letters only | Always strips accents; no `simplifyAccents` toggle per grade |
| Word deduplication | `Set` before placement | ✓ |
| Sort by length descending | `.sort((a,b) => b.length - a.length)` | ✓ PRD 25.1 step 1 |
| Grid initialization | `size × size` nullable matrix | ✓ |
| Word placement with crossings | Case-by-case letter compatibility | ✓ PRD 25.1 step 3 |
| 8 direction vectors | `DIRECTIONS` array (`dr`/`dc`) | Present but not mapped to PRD enum strings |
| Diagonal toggle | `allowDiagonals` boolean | Coarse — not aligned with `Difficulty.directions[]` |
| Deterministic output | `mulberry32` seed | Useful for SSR/tests; not documented in public API |
| Empty cell fill | Uniform random A–Z | **Not** French frequency weighted |
| Selection helpers | `lineBetween`, `cellsEqual` | Used by `WordGrid` for gameplay |
| Output type | `Grid { letters, placements, size }` | `Placement { word, cells[] }` — not DB shape |

**Placement algorithm (actual behaviour):**

1. Iterate words (longest first).
2. Shuffle all start positions, then all directions, until a valid placement is found.
3. **No per-word attempt cap** — worst case scans entire position × direction space.
4. **No grid auto-resize** on failure — unplaced words are silently dropped.
5. Fill remaining cells with uniform random letters.

### 1.2 `lib/word-search.ts`

**Does not exist.** The user query and some codebases use this name as a facade; the blueprint specifies `lib/puzzle-engine/` as the canonical location. Phase B will add a thin `lib/word-search.ts` re-export only if needed for API ergonomics — not a second implementation.

### 1.3 Puzzle-related components

| Component | Location | State |
|-----------|----------|-------|
| `WordGrid` | `components/puzzle/word-grid.tsx` | Client-only (`"use client"`). Interactive selection via click start/end. No server variant. No `largePrint` prop. Cell size `text-[10px]` → `md:text-base`. |
| `PuzzleGenerator` | `components/templates/home/puzzle-generator.tsx` | Calls `generateGrid` directly. Hardcoded sizes 8/11/14. Boolean diagonal toggle. No difficulty preset. No large-print toggle. |
| `Hero` demo | `components/templates/home/hero.tsx` | Static `generateGrid(HERO_WORDS, 8, true, 7)`. |
| Blueprint components | `PuzzleGridServer`, `PuzzleGridClient`, `WordListPanel`, etc. | **Not created** — placeholders in `components/cards/index.ts`, `components/forms/index.ts` |

**Gap vs blueprint:** Blueprint mandates a single `PuzzleGrid` with server + client variants. Current code has one client `WordGrid` only. Renaming/splitting is Phase B scope only where it affects engine contracts (types, solution data); full `PuzzleGridServer` refactor aligns with Phase C/D UI work but types must be stable after Phase B.

### 1.4 Existing tests

| Area | Status |
|------|--------|
| `tests/puzzle-engine/` | **Missing** — directory does not exist |
| Vitest | **Not installed** — `package.json` has no `vitest` script or dependency |
| Playwright e2e | **Missing** |
| CI test gate | **None** |

### 1.5 Database / seed alignment (Phase A — inputs to engine)

Already available and correct for Phase B consumption:

- `Difficulty` seed (`prisma/seed/difficulties.ts`) — 4 levels with `gridSizeMin/Max`, `wordCountMin/Max`, `directions[]` matching PRD 25.2 enum strings.
- `Grade` seed (`prisma/seed/grades.ts`) — 7 levels with `defaultGridSize`, `order`.
- `ThemeWord` seed — 225 words with `length`, `minGradeOrder` for programmatic generation (Phase B exposes selection API; bulk puzzle seeding is Phase C).
- `Puzzle.largePrint` — column exists in schema, unused by code.

---

## 2. Missing features (gap analysis vs PRD §25 & Blueprint)

### 2.1 Generation algorithm (PRD 25.1)

| Requirement | Current | Gap |
|-------------|---------|-----|
| 100 placement attempts per word, then increase `size` by 1 and restart | Unlimited shuffle; no resize | **Critical** |
| Fail cleanly on impossible input (no infinite loop) | Silent drop of words | **Critical** |
| French letter frequency fill | Uniform A–Z | **Missing** |
| `simplifyAccents: true` for maternelle/cp/ce1 | Always strips accents in grid | **Missing** |
| Directions from `Direction[]` param (8 PRD enums) | Boolean `allowDiagonals` + fixed slices | **Wrong abstraction** |
| Facile = H + V normal only | `allowDiagonals=false` still allows reverse H/V | **Bug** |
| Return `{ grid, placements: [{word, row, col, direction}] }` | Returns `cells[]` only | **Wrong shape** |

### 2.2 Difficulty system (PRD 25.2)

| Requirement | Current | Gap |
|-------------|---------|-----|
| Facile 8×8, 6–8 words, H+V | Generator offers 8×8 but no word-count enforcement | **Missing** |
| Moyen 10×10, 8–10 words, + diagonals normal | Generator uses 11×11 | **Mismatch** |
| Difficile 12×12–15×15, 12–15 words, all 8 directions | Generator 14×14; all dirs when diagonals on | **Partial** |
| Géant 18×20, 18–25 words | Not exposed in UI; engine untested at size | **Missing** |
| Integration with `Difficulty` DB rows | None | **Missing** |

### 2.3 Validation (PRD 25.5)

| Check | Current | Gap |
|-------|---------|-----|
| Unique words | Partial (dedupe at input) | No substring ambiguity warning |
| All words placed in grid | None | **Missing** |
| Crossing letter consistency | Implicit at generation only | No post-hoc validator |
| `solutionData` ↔ `gridData` consistency | No `solutionData` produced | **Missing** |
| Grade/difficulty word-length adequacy | None | **Missing** |
| Mandatory Vitest cases (long word, empty list, impossible set) | No tests | **Missing** |

### 2.4 Large print (PRD 25.2, Blueprint §2)

| Requirement | Current | Gap |
|-------------|---------|-----|
| `Puzzle.largePrint` persisted | Schema only | **Missing** |
| Cell size ×1.4, enhanced contrast | Not in `WordGrid` | **Missing** (component prop in Phase B plan; full seniors UX in Phase 2) |
| Independent from difficulty | N/A | **Missing** |

### 2.5 Solution data model (PRD §24, §25.5)

| Field | PRD shape | Current |
|-------|-----------|---------|
| `gridData` | `string[][]` | `Grid.letters` — compatible |
| `wordList` | `[{ word, row, col, direction }]` | `Placement.cells[]` — incompatible |
| `solutionData` | Coordinates for reveal + PDF page 2 | **Not produced** |

### 2.6 Infrastructure

- No `validatePuzzle()` export for admin publish gate (Phase F).
- No `generateFromTheme()` / `generateFromDifficulty()` orchestrators.
- No global time budget for Géant batch generation (Blueprint risk #4).
- `lib/pdf/index.ts` stub — depends on `solutionData` (Phase D).

---

## 3. Proposed architecture

### 3.1 Design principles

1. **Pure functions** — no Prisma inside core engine; DB adapters live in a thin `lib/puzzle-engine/adapters/` layer.
2. **Single source of truth for directions** — enum strings match `Difficulty.directions[]` seed and PRD.
3. **Generate → validate → serialize** — three explicit stages; publish path must call validate.
4. **Deterministic optional** — seed injected for tests and SSR demos; default random for production generation.
5. **Fail loud** — typed errors (`PuzzleGenerationError`, `PuzzleValidationError`) with codes, not silent word drops.

### 3.2 Module diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Public API (index.ts)                    │
│  generatePuzzle() · validatePuzzle() · toDbPayload()        │
└────────────┬───────────────────────────────┬────────────────┘
             │                               │
    ┌────────▼────────┐              ┌───────▼────────┐
    │   generate.ts   │              │  validate.ts   │
    │  (orchestrator) │              │  (PRD 25.5)    │
    └────────┬────────┘              └────────────────┘
             │
   ┌─────────┼─────────┬────────────┬──────────────┐
   │         │         │            │              │
   ▼         ▼         ▼            ▼              ▼
place.ts  fill.ts  directions.ts  alphabet.ts  normalize.ts
             │
             ▼
      difficulty.ts ──► maps DifficultySlug + GradeSlug → GenerateOptions
             │
             ▼
      solution.ts ──► builds wordList + solutionData from placements
             │
             ▼
      adapters/prisma.ts ──► Puzzle create input (Phase C admin)
```

### 3.3 Core types (new)

```typescript
// Direction — matches prisma seed strings
type Direction =
  | "HORIZONTAL" | "HORIZONTAL_INVERSE"
  | "VERTICAL" | "VERTICAL_INVERSE"
  | "DIAGONAL_DESCENDANTE" | "DIAGONAL_DESCENDANTE_INVERSE"
  | "DIAGONAL_MONTANTE" | "DIAGONAL_MONTANTE_INVERSE"

type Placement = {
  word: string           // grid letters (may be accent-stripped)
  displayWord: string    // original spelling for word list UI
  row: number
  col: number
  direction: Direction
  cells: Cell[]          // derived — kept for gameplay components
}

type PuzzleResult = {
  grid: string[][]
  size: number
  placements: Placement[]
  wordList: WordListEntry[]
  solutionData: SolutionData
  warnings: ValidationWarning[]  // non-blocking, e.g. substring pairs
}

type GenerateOptions = {
  words: string[]
  size?: number                    // default from difficulty
  directions: Direction[]
  maxAttemptsPerWord?: number      // default 100
  maxSize?: number                 // cap auto-grow (e.g. 25)
  simplifyAccents?: boolean
  seed?: number
  timeBudgetMs?: number            // default 5000; 15000 for geant
}
```

### 3.4 Generation flow (PRD 25.1 compliant)

```
generatePuzzle(options):
  1. normalize + dedupe words; reject if empty → throw EMPTY_WORD_LIST
  2. resolve size (explicit or difficulty default)
  3. LOOP (size ≤ maxSize):
       a. sort words by length desc
       b. clear grid
       c. FOR each word:
            attempts = 0
            WHILE not placed AND attempts < 100:
              pick random (position, direction) from allowed set
              if compatible → place; break
              attempts++
            IF not placed → size++; RESTART outer loop
       d. IF all placed → fill empty cells with weighted French letters → BREAK
  4. IF size > maxSize → throw PLACEMENT_FAILED
  5. build wordList + solutionData
  6. run validatePuzzle (throw if invalid — should not happen)
  7. return PuzzleResult
```

### 3.5 Backward compatibility

- Keep `generateGrid()` as a **deprecated wrapper** around `generatePuzzle()` for homepage until Phase C migrates call sites.
- Map new `Placement` to old `{ word, cells }` in wrapper so `WordGrid` keeps working during transition.

---

## 4. File structure changes

### 4.1 New files

```
lib/puzzle-engine/
├── index.ts                 # public exports
├── types.ts                 # Direction, Placement, PuzzleResult, errors
├── directions.ts            # enum ↔ delta; pickRandomDirection()
├── alphabet.ts              # FRENCH_LETTER_WEIGHTS + weightedRandomLetter()
├── normalize.ts             # normalizeWord, simplifyAccents, display vs grid word
├── place.ts                 # tryPlaceWord, placement compatibility
├── fill.ts                  # fillEmptyCells with frequency weights
├── generate.ts              # generatePuzzle orchestrator (replaces current logic)
├── solution.ts              # buildWordList, buildSolutionData
├── difficulty.ts            # DIFFICULTY_PRESETS, resolveGenerateOptions()
├── validate.ts              # validatePuzzle — PRD 25.5
├── errors.ts                # PuzzleGenerationError, codes
└── adapters/
    └── prisma.ts            # toPrismaPuzzlePayload(result, metadata)

lib/word-search.ts           # optional thin re-export: export * from "./puzzle-engine"

tests/
├── puzzle-engine/
│   ├── generate.test.ts
│   ├── validate.test.ts
│   ├── directions.test.ts
│   ├── alphabet.test.ts
│   ├── difficulty.test.ts
│   ├── solution.test.ts
│   └── fixtures/
│       └── words.ts
└── vitest.config.ts

vitest.config.ts             # root config (or tests/vitest.config.ts)
```

### 4.2 Modified files (Phase B implementation)

| File | Change |
|------|--------|
| `package.json` | Add `vitest`, `@vitest/coverage-v8`; scripts `test`, `test:watch` |
| `components/puzzle/word-grid.tsx` | Add `largePrint?: boolean` prop (cell scale ×1.4, contrast classes per style-guide) |
| `components/templates/home/puzzle-generator.tsx` | Wire to `resolveGenerateOptions` + difficulty selector (minimal — full ToolGeneratorTemplate is Phase D) |

### 4.3 Unchanged in Phase B

- `prisma/schema.prisma` — already has required fields.
- `lib/pdf/` — Phase D.
- Full `PuzzleGridServer` / `PuzzleGridClient` split — Phase C/D (types ready after B).

---

## 5. Validation strategy

### 5.1 `validatePuzzle(result, context?)` — PRD 25.5

Returns `{ valid: boolean, errors: ValidationError[], warnings: ValidationWarning[] }`.

| # | Rule | Severity | Implementation |
|---|------|----------|----------------|
| 1 | No duplicate words in `wordList` | Error | Set size check |
| 2 | Substring ambiguity (CHAT / CHATON) | Warning | O(n²) substring check on display words |
| 3 | Every input word has a placement | Error | Compare normalized sets |
| 4 | Each placement fits in grid bounds | Error | Bounds check on cells |
| 5 | Grid letters match placement letters | Error | Cell-by-cell |
| 6 | Shared cells have identical letters | Error | Cross-placement intersection |
| 7 | `solutionData` traces match `gridData` | Error | Reconstruct paths from solutionData |
| 8 | Word length vs grade bounds | Warning/Error | Configurable per `grade.order` |
| 9 | Word count vs difficulty range | Warning | When context.difficulty provided |
| 10 | No empty grid / no words | Error | Guard |

### 5.2 Publish gate (future — Phase F)

```typescript
const { valid, errors } = validatePuzzle(result, { grade, difficulty })
if (!valid) throw new Error(`Cannot publish: ${errors.map(e => e.code).join(", ")}`)
```

Phase B delivers the function; admin wiring is Phase F.

### 5.3 Runtime assertions

- `generatePuzzle` calls `validatePuzzle` internally in development/test (`NODE_ENV !== "production"`).
- Production: validate on publish only (performance).

---

## 6. French letter frequency implementation

### 6.1 Source

Use standard French letter frequency distribution (crossword/filler convention), normalized to the **26-letter Latin alphabet** used in grids after accent simplification:

| Letter | Weight (×1000) | Letter | Weight |
|--------|----------------|--------|--------|
| E | 174 | N | 71 |
| A | 82 | R | 66 |
| I | 75 | T | 63 |
| S | 79 | O | 50 |
| … | (full table in `alphabet.ts`) | K, W, X, Y | 1–2 each |

Letters J, H, Q, Z, K, W, X, Y receive low weights — grids remain scannable but not trivial.

### 6.2 API

```typescript
// alphabet.ts
export const FRENCH_LETTER_WEIGHTS: Readonly<Record<string, number>>
export function weightedRandomLetter(rng: () => number): string
export function fillEmptyCells(grid: (string|null)[][], rng): string[][]
```

### 6.3 Tests

- Chi-squared loose bound over 10 000 fills (E appears more often than K).
- Deterministic with seeded RNG.

### 6.4 Accent handling interaction

- **Grid letters:** `simplifyAccents: true` → É→E, Ç→C, etc. before placement and fill.
- **Display word list:** always original spelling from input / `ThemeWord.word`.
- Fill alphabet excludes accented characters — consistent with PRD maternelle/cp/ce1 UX.

---

## 7. Difficulty system implementation

### 7.1 Preset map (`difficulty.ts`)

Mirror `prisma/seed/difficulties.ts` exactly (single source — import seed constants or duplicate with test asserting parity):

```typescript
export const DIFFICULTY_PRESETS: Record<DifficultySlug, {
  gridSizeMin: number
  gridSizeMax: number
  wordCountMin: number
  wordCountMax: number
  directions: Direction[]
}>

export function resolveGenerateOptions(input: {
  difficulty: DifficultySlug
  grade?: GradeSlug
  words?: string[]
  size?: number
  largePrint?: boolean
  seed?: number
}): GenerateOptions
```

### 7.2 Size selection

- Default size: `gridSizeMin` for facile/moyen (fixed); random in `[min,max]` for difficile/geant OR pick `grade.defaultGridSize` clamped to difficulty range when grade provided.
- Generator UI (homepage): replace 8/11/14 with Facile/Moyen/Difficile (+ Géant behind flag for MVP).

### 7.3 Word count

`selectWordsFromBank(themeWords, grade, difficulty)`:

1. Filter `minGradeOrder <= grade.order`.
2. Filter by length bounds per grade (PRD §7 table).
3. Shuffle (seeded).
4. Take random int in `[wordCountMin, wordCountMax]`.

Exposed for Phase C batch seed; unit-tested in Phase B with fixture word bank.

### 7.4 Grade → `simplifyAccents`

| Grade slugs | `simplifyAccents` |
|-------------|-------------------|
| maternelle, cp, ce1 | `true` |
| ce2, cm1, cm2, 6e | `false` (accents in grid if words contain them) |

### 7.5 Direction sets (PRD 25.2)

| Difficulty | Directions |
|------------|------------|
| facile | HORIZONTAL, VERTICAL |
| moyen | + DIAGONAL_DESCENDANTE, DIAGONAL_MONTANTE |
| difficile, geant | all 8 |

---

## 8. LargePrint support

### 8.1 Data layer

- `Puzzle.largePrint` already in schema — no migration needed.
- `generatePuzzle` accepts `largePrint` in metadata only; **does not affect generation algorithm** (PRD: independent axis).

### 8.2 Component layer (minimal Phase B)

Extend `WordGrid` props:

```typescript
type WordGridProps = {
  grid: Grid
  largePrint?: boolean   // default false
  // ...
}
```

When `largePrint={true}` (per style-guide + PRD 25.2):

| Token | Standard | Large print |
|-------|----------|-------------|
| Cell min width | `min-w-[18px]` | `min-w-[26px]` (~×1.44) |
| Font | `text-[10px]` → `md:text-base` | `text-sm` → `lg:text-xl` |
| Gap | `gap-0.5` / `sm:gap-1` | `gap-1` / `sm:gap-1.5` |
| Contrast | default muted | `bg-parchment-0` cells, `text-ink-900`, stronger border |

Use existing Tailwind tokens from `style-guide.html` / `globals.css` (Atkinson Hyperlegible already loaded).

### 8.3 Generator toggle

Add switch in `PuzzleGenerator`: "Grand format / haute lisibilité" — passes `largePrint` to `WordGrid` only (persistence when saving puzzle = Phase C).

### 8.4 PDF / print (Phase D)

`largePrint` flag passed to PDF renderer for font scaling — document in adapter, implement in Phase D.

---

## 9. Solution data model

### 9.1 `wordList` (JSON column)

```typescript
type WordListEntry = {
  word: string          // display spelling (with accents)
  row: number           // 0-indexed start row
  col: number           // 0-indexed start col
  direction: Direction
}
```

### 9.2 `solutionData` (JSON column)

Supports "Voir la solution" highlight and PDF page 2 corrigé:

```typescript
type SolutionData = {
  version: 1
  size: number
  words: Array<{
    word: string
    cells: Array<{ row: number; col: number }>  // inclusive path start→end
  }>
}
```

**Alternative considered:** store only `wordList` and derive cells — rejected because direction inverse words need explicit cell paths for highlight animation.

### 9.3 `gridData`

```typescript
type GridData = string[][]  // size × size, uppercase
```

### 9.4 Builder (`solution.ts`)

```typescript
function buildWordList(placements: Placement[]): WordListEntry[]
function buildSolutionData(placements: Placement[], size: number): SolutionData
function placementsFromWordList(grid: string[][], wordList: WordListEntry[]): Placement[]
```

### 9.5 Prisma adapter

```typescript
function toPrismaPuzzlePayload(
  result: PuzzleResult,
  meta: { slug, title, difficultyId, gradeId?, themeId?, largePrint? }
): Prisma.PuzzleCreateInput
```

---

## 10. Testing strategy

### 10.1 Tooling

```json
// package.json scripts
"test": "vitest run",
"test:watch": "vitest"
```

Dev dependencies: `vitest`, `@vitest/coverage-v8` (optional coverage gate ≥90% on `lib/puzzle-engine`).

### 10.2 Mandatory cases (PRD 25.5 §6)

| Test | Assertion |
|------|-----------|
| Word longer than initial grid | Auto-increases size; all words placed; `validatePuzzle` passes |
| Empty word list | Throws `EMPTY_WORD_LIST` |
| Impossible word set (e.g. 50 long words in 8×8) | Throws `PLACEMENT_FAILED` within time budget; no hang |
| 100% placement verification | Every word in `wordList` reconstructable from `gridData` |
| Crossing consistency | Validator catches deliberately corrupted grid |
| `solutionData` ↔ `gridData` | Full path letters spell `word` (forward along direction) |
| Facile directions | Never HORIZONTAL_INVERSE etc. |
| French fill distribution | Statistical smoke test (seeded) |
| `simplifyAccents` | ÉCOLE → ECOLE in grid, ÉCOLE in display word |
| Deterministic seed | Same seed → identical grid |

### 10.3 Fixture words

`tests/puzzle-engine/fixtures/words.ts` — animals, long words, accented words, impossible set.

### 10.4 CI

Add `pnpm test` to Vercel/CI pipeline before build (Blueprint Build Order step 3 gate).

### 10.5 Out of scope Phase B

- Playwright e2e for grid interaction (Phase C/D).
- Component unit tests for `WordGrid` (optional snapshot tests later).

---

## 11. Risks and edge cases

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Silent word drop (current bug)** | Published puzzles missing words; SEO/trust damage | Fail generation; never return partial grids for publish path |
| **Géant 20×20 + 25 words timeout** | Serverless batch jobs fail (Blueprint #4) | `timeBudgetMs`; precompute max attempts; cap at 15s for geant |
| **Infinite resize loop** | CPU hang | `maxSize` cap (25); throw `PLACEMENT_FAILED` |
| **Substring false positives** | CHAT/CHATON warning noise | Warning only, not blocking |
| **Accent display vs grid mismatch** | User confusion finding É in E grid | Clear display word; tooltip in Phase D |
| **Direction enum drift** | DB seed ≠ engine | Single `Direction` type; test parity with `difficultySeed` |
| **WordGrid / engine type split** | Refactor churn | Keep `cells[]` on Placement; adapters for DB |
| **Theme word bank too small** | Repetitive programmatic puzzles | `selectWordsFromBank` throws if `< wordCountMin` (Blueprint #9) |
| **Seeded vs random in production** | Predictable puzzles | Seed only for tests/demo; crypto random default |
| **Homogeneous words (AAAA, AAA)** | Trivial placements | Validator warning; allow |
| **Duplicate letters at crossing** | Already handled | Explicit validator test |
| **Mobile touch selection** | Poor UX on large grids | `touch-action: none` — Phase C component work |
| **MVP Géant scope** | PRD says Géant Phase 2 | Engine supports it; UI flag optional in MVP |

### Edge cases checklist

- [ ] Single-character words → reject (min length 2).
- [ ] Word equals grid size exactly at border in all 8 directions.
- [ ] All words palindromes / same prefix cluster.
- [ ] Grid full after placement (no empty cells) — rare but valid.
- [ ] Unicode normalization (é vs e + combining acute).
- [ ] Hyphenated words in input (strip or reject — document: strip non-letters).

---

## 12. Detailed implementation order

Execute in sequence; each step should leave tests green before proceeding.

### Step 1 — Test infrastructure (0.5 day)

1. Install Vitest + config.
2. Add `package.json` scripts.
3. Smoke test importing existing `generateGrid`.

### Step 2 — Types & directions (0.5 day)

1. Create `types.ts`, `errors.ts`, `directions.ts`.
2. Map all 8 PRD directions to `{ dr, dc }`.
3. Tests: delta correctness, inverse pairs.

### Step 3 — Normalize & alphabet (0.5 day)

1. Extract `normalize.ts` with `simplifyAccents` option.
2. Implement `alphabet.ts` with French weights.
3. Tests: accent handling, weighted distribution.

### Step 4 — Placement core (1 day)

1. `place.ts` — single-word placement attempt.
2. Refactor loop with **100-attempt cap** and **size auto-grow**.
3. Tests: long word resize, impossible set failure.

### Step 5 — Fill & orchestrator (0.5 day)

1. `fill.ts` — frequency-weighted fill.
2. New `generate.ts` — `generatePuzzle()`.
3. Deprecate wrapper `generateGrid()` for backward compat.
4. Tests: full generation PRD cases.

### Step 6 — Solution builder (0.5 day)

1. `solution.ts` — `wordList` + `solutionData`.
2. Tests: round-trip grid ↔ solution.

### Step 7 — Validation (1 day)

1. `validate.ts` — all PRD 25.5 rules.
2. Comprehensive validator tests including corrupted grids.

### Step 8 — Difficulty & grade presets (0.5 day)

1. `difficulty.ts` — presets + `resolveGenerateOptions`.
2. `selectWordsFromBank()` for theme words.
3. Tests: parity with seed data, grade accent rules.

### Step 9 — Prisma adapter (0.25 day)

1. `adapters/prisma.ts` — `toPrismaPuzzlePayload`.
2. Test with mock metadata (no DB required).

### Step 10 — Component integration (0.5 day)

1. `WordGrid` — `largePrint` prop + styles.
2. `PuzzleGenerator` — difficulty presets, large-print toggle, use new API.
3. Verify homepage hero still works via compat wrapper.

### Step 11 — Public API cleanup (0.25 day)

1. Update `index.ts` exports.
2. Optional `lib/word-search.ts` re-export.
3. JSDoc on public functions.

### Step 12 — Batch & benchmarks (0.5 day)

1. `batch.ts` — `generatePuzzleBatch()` with safeguards + failure reporting.
2. `benchmark.test.ts` — 1,000 puzzle throughput + heap growth check.
3. `batch.test.ts` — partial failure, time budget abort, deterministic seeds.

### Step 13 — CI & documentation (0.25 day)

1. Add `pnpm test` to CI.
2. Update `docs/DATABASE.md` Phase B note (engine produces JSON shapes).
3. Mark Phase B complete in project tracking.

**Estimated total:** ~5.5–6.5 dev days.

---

## Acceptance criteria (Phase B done)

- [ ] `pnpm test` passes all PRD 25.5 mandatory cases.
- [ ] `generatePuzzle()` produces `gridData`-compatible output + `wordList` + `solutionData`.
- [ ] `validatePuzzle()` implements all 6 PRD validation rules (+ warnings).
- [ ] French letter frequency fill implemented and tested.
- [ ] Difficulty presets match `prisma/seed/difficulties.ts`.
- [ ] Grade `simplifyAccents` rule implemented.
- [ ] `largePrint` prop on `WordGrid`; toggle in generator.
- [ ] No silent word drops — errors are explicit.
- [ ] Backward-compatible `generateGrid` wrapper for existing homepage code.
- [ ] **No puzzle DB seeding yet** — that's Phase C.
- [ ] `generatePuzzleBatch()` generates 1,000 puzzles without memory leak (heap growth &lt; 50 MB in benchmark).
- [ ] Bulk failures reported per-item with code, message, and retry options.
- [ ] Deterministic seeds work for single and batch generation.

---

## Appendix A — Current vs target API

| Current | Target |
|---------|--------|
| `generateGrid(words, size, allowDiagonals?, seed?)` | `generatePuzzle(options: GenerateOptions): PuzzleResult` |
| `Placement { word, cells }` | `Placement { word, displayWord, row, col, direction, cells }` |
| — | `validatePuzzle(result, context?): ValidationReport` |
| — | `resolveGenerateOptions({ difficulty, grade?, ... })` |
| — | `toPrismaPuzzlePayload(result, meta)` |
| — | `generatePuzzleBatch(requests, batchOptions?)` |

## Appendix B — `lib/word-search.ts` decision

The file **does not exist** today. **Recommendation:** add as one-line re-export in Phase B only if external clarity is needed:

```typescript
export * from "./puzzle-engine"
```

All logic stays in `lib/puzzle-engine/`. No duplicate implementation.

---

*Phase B implementation started after performance requirements were added.*
