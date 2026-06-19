export type PuzzleErrorCode =
  | "EMPTY_WORD_LIST"
  | "PLACEMENT_FAILED"
  | "TIME_BUDGET_EXCEEDED"
  | "BATCH_SIZE_EXCEEDED"
  | "INVALID_WORD"
  | "INSUFFICIENT_WORD_BANK"

export class PuzzleGenerationError extends Error {
  readonly code: PuzzleErrorCode

  constructor(code: PuzzleErrorCode, message: string) {
    super(message)
    this.name = "PuzzleGenerationError"
    this.code = code
  }
}
