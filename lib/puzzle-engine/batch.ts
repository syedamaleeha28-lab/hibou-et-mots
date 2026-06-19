import { generatePuzzle } from "./generate"
import { PuzzleGenerationError } from "./errors"
import type {
  BatchFailure,
  BatchOptions,
  BatchPuzzleRequest,
  BatchResult,
} from "./types"

const DEFAULT_GLOBAL_BUDGET_MS = 300_000
const DEFAULT_MAX_BATCH_SIZE = 2_000

export function generatePuzzleBatch(
  requests: BatchPuzzleRequest[],
  batchOptions: BatchOptions = {},
): BatchResult {
  const {
    globalTimeBudgetMs = DEFAULT_GLOBAL_BUDGET_MS,
    maxBatchSize = DEFAULT_MAX_BATCH_SIZE,
    stopOnFirstFailure = false,
    seedBase,
  } = batchOptions

  if (requests.length > maxBatchSize) {
    throw new PuzzleGenerationError(
      "BATCH_SIZE_EXCEEDED",
      `Lot de ${requests.length} puzzles dépasse la limite de ${maxBatchSize}.`,
    )
  }

  const batchStarted = Date.now()
  const successes: BatchResult["successes"] = []
  const failures: BatchFailure[] = []
  let aborted = false

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i]!
    const elapsed = Date.now() - batchStarted

    if (elapsed >= globalTimeBudgetMs) {
      aborted = true
      failures.push({
        id: request.id,
        code: "TIME_BUDGET_EXCEEDED",
        message: `Lot interrompu: budget global (${globalTimeBudgetMs} ms) dépassé.`,
        elapsedMs: 0,
        options: request.options,
      })
      break
    }

    const options =
      request.options.seed === undefined && seedBase !== undefined
        ? { ...request.options, seed: seedBase + i }
        : request.options

    const itemStarted = Date.now()

    try {
      const result = generatePuzzle(options)
      successes.push({
        id: request.id,
        result,
        elapsedMs: Date.now() - itemStarted,
      })
    } catch (error) {
      const puzzleError =
        error instanceof PuzzleGenerationError
          ? error
          : new PuzzleGenerationError(
              "PLACEMENT_FAILED",
              error instanceof Error ? error.message : "Erreur inconnue",
            )

      failures.push({
        id: request.id,
        code: puzzleError.code,
        message: puzzleError.message,
        elapsedMs: Date.now() - itemStarted,
        options,
      })

      if (stopOnFirstFailure) {
        aborted = true
        break
      }
    }
  }

  return {
    successes,
    failures,
    stats: {
      requested: requests.length,
      succeeded: successes.length,
      failed: failures.length,
      aborted,
    },
    totalElapsedMs: Date.now() - batchStarted,
  }
}
