export type {
  BatchFailure,
  BatchOptions,
  BatchPuzzleRequest,
  BatchResult,
  Cell,
  Direction,
  DifficultySlug,
  GenerateOptions,
  GradeSlug,
  Grid,
  Placement,
  PuzzleResult,
  SolutionData,
  ThemeWordInput,
  ValidationContext,
  ValidationError,
  ValidationReport,
  ValidationWarning,
  WordListEntry,
} from "./types"

export { PuzzleGenerationError, type PuzzleErrorCode } from "./errors"
export { mulberry32, createRng, randomSeed } from "./rng"
export { ALL_DIRECTIONS, cellsAlongDirection, directionFromCells, getDelta } from "./directions"
export { FRENCH_LETTER_WEIGHTS, weightedRandomLetter } from "./alphabet"
export { normalizeWord, stripAccents, prepareWords } from "./normalize"
export { generatePuzzle } from "./generate"
export { generatePuzzleBatch } from "./batch"
export { buildWordList, buildSolutionData, puzzleResultToLegacyGrid } from "./solution"
export { validatePuzzle } from "./validate"
export {
  DIFFICULTY_PRESETS,
  GRADE_ORDER,
  GRADE_WORD_LENGTH,
  resolveGenerateOptions,
  resolveGridSize,
  selectWordsFromBank,
  shouldSimplifyAccents,
} from "./difficulty"
export { lineBetween, cellsEqual } from "./gameplay"
export { generateGrid } from "./compat"
export { toPrismaPuzzlePayload, type PrismaPuzzlePayload } from "./adapters/prisma"
