export type Cell = { r: number; c: number }

export type Direction =
  | "HORIZONTAL"
  | "HORIZONTAL_INVERSE"
  | "VERTICAL"
  | "VERTICAL_INVERSE"
  | "DIAGONAL_DESCENDANTE"
  | "DIAGONAL_DESCENDANTE_INVERSE"
  | "DIAGONAL_MONTANTE"
  | "DIAGONAL_MONTANTE_INVERSE"

export type DifficultySlug = "facile" | "moyen" | "difficile" | "geant"

export type GradeSlug =
  | "maternelle"
  | "cp"
  | "ce1"
  | "ce2"
  | "cm1"
  | "cm2"
  | "6e"

export type PreparedWord = {
  displayWord: string
  gridWord: string
}

export type Placement = {
  word: string
  displayWord: string
  row: number
  col: number
  direction: Direction
  cells: Cell[]
}

export type WordListEntry = {
  word: string
  row: number
  col: number
  direction: Direction
}

export type SolutionData = {
  version: 1
  size: number
  words: Array<{
    word: string
    cells: Array<{ row: number; col: number }>
  }>
}

export type ValidationError = {
  code: string
  message: string
}

export type ValidationWarning = {
  code: string
  message: string
}

export type ValidationReport = {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export type GenerateOptions = {
  words: string[]
  size?: number
  directions: Direction[]
  maxAttemptsPerWord?: number
  maxSize?: number
  simplifyAccents?: boolean
  seed?: number
  timeBudgetMs?: number
}

export type PuzzleResult = {
  grid: string[][]
  size: number
  placements: Placement[]
  wordList: WordListEntry[]
  solutionData: SolutionData
  warnings: ValidationWarning[]
}

/** Legacy shape consumed by WordGrid — built from PuzzleResult. */
export type Grid = {
  letters: string[][]
  placements: Array<{ word: string; cells: Cell[] }>
  size: number
}

export type ThemeWordInput = {
  word: string
  length: number
  minGradeOrder: number
}

export type BatchPuzzleRequest = {
  id: string
  options: GenerateOptions
}

export type BatchFailure = {
  id: string
  code: string
  message: string
  elapsedMs: number
  options: GenerateOptions
}

export type BatchResult = {
  successes: Array<{ id: string; result: PuzzleResult; elapsedMs: number }>
  failures: BatchFailure[]
  stats: {
    requested: number
    succeeded: number
    failed: number
    aborted: boolean
  }
  totalElapsedMs: number
}

export type BatchOptions = {
  globalTimeBudgetMs?: number
  maxBatchSize?: number
  stopOnFirstFailure?: boolean
  seedBase?: number
}

export type ValidationContext = {
  gradeOrder?: number
  wordCountMin?: number
  wordCountMax?: number
  minWordLength?: number
  maxWordLength?: number
}
