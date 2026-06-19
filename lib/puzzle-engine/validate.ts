import { cellsAlongDirection } from "./directions"
import type {
  Placement,
  PuzzleResult,
  ValidationContext,
  ValidationError,
  ValidationReport,
  ValidationWarning,
} from "./types"

function checkSubstringAmbiguity(words: string[]): ValidationWarning[] {
  const warnings: ValidationWarning[] = []
  const normalized = words.map((w) => w.toUpperCase())

  for (let i = 0; i < normalized.length; i++) {
    for (let j = 0; j < normalized.length; j++) {
      if (i === j) continue
      if (normalized[i]!.includes(normalized[j]!) || normalized[j]!.includes(normalized[i]!)) {
        warnings.push({
          code: "SUBSTRING_AMBIGUITY",
          message: `Les mots "${words[i]}" et "${words[j]}" peuvent créer une ambiguïté de recherche.`,
        })
      }
    }
  }

  return warnings
}

function checkCrossings(placements: Placement[], grid: string[][]): ValidationError[] {
  const errors: ValidationError[] = []
  const cellMap = new Map<string, string>()

  for (const placement of placements) {
    for (let i = 0; i < placement.cells.length; i++) {
      const cell = placement.cells[i]!
      const key = `${cell.r},${cell.c}`
      const letter = placement.word[i]!
      const existing = cellMap.get(key)
      if (existing && existing !== letter) {
        errors.push({
          code: "CROSSING_MISMATCH",
          message: `Lettre incompatible à (${cell.r},${cell.c}): "${existing}" vs "${letter}".`,
        })
      }
      cellMap.set(key, letter)
    }
  }

  for (const placement of placements) {
    for (let i = 0; i < placement.cells.length; i++) {
      const cell = placement.cells[i]!
      const gridLetter = grid[cell.r]?.[cell.c]
      if (gridLetter !== placement.word[i]) {
        errors.push({
          code: "GRID_PLACEMENT_MISMATCH",
          message: `La grille à (${cell.r},${cell.c}) contient "${gridLetter}" mais le mot attend "${placement.word[i]}".`,
        })
      }
    }
  }

  return errors
}

function checkSolutionData(result: PuzzleResult): ValidationError[] {
  const errors: ValidationError[] = []

  for (const entry of result.wordList) {
    const solutionWord = result.solutionData.words.find((w) => w.word === entry.word)
    if (!solutionWord) {
      errors.push({
        code: "SOLUTION_MISSING_WORD",
        message: `Mot "${entry.word}" absent de solutionData.`,
      })
      continue
    }

    const expectedCells = cellsAlongDirection(
      { r: entry.row, c: entry.col },
      entry.direction,
      solutionWord.cells.length,
    )

    const matches = expectedCells.every(
      (cell, i) =>
        solutionWord.cells[i]?.row === cell.r && solutionWord.cells[i]?.col === cell.c,
    )

    if (!matches) {
      errors.push({
        code: "SOLUTION_PATH_MISMATCH",
        message: `solutionData ne correspond pas à wordList pour "${entry.word}".`,
      })
    }

    const placement = result.placements.find(
      (p) => p.displayWord === entry.word || p.word === entry.word,
    )

    const spelled = solutionWord.cells
      .map((c) => result.grid[c.row]?.[c.col] ?? "")
      .join("")

    if (placement && spelled !== placement.word) {
      errors.push({
        code: "GRID_PLACEMENT_MISMATCH",
        message: `La grille ne correspond pas au mot placé "${entry.word}" à (${entry.row},${entry.col}).`,
      })
    }
  }

  return errors
}

export function validatePuzzle(
  result: PuzzleResult,
  context?: ValidationContext,
): ValidationReport {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  if (!result.grid.length || result.wordList.length === 0) {
    errors.push({ code: "EMPTY_PUZZLE", message: "La grille ou la liste de mots est vide." })
    return { valid: false, errors, warnings }
  }

  const displayWords = result.wordList.map((w) => w.word)
  const unique = new Set(displayWords.map((w) => w.toUpperCase()))
  if (unique.size !== displayWords.length) {
    errors.push({ code: "DUPLICATE_WORDS", message: "La liste de mots contient des doublons." })
  }

  warnings.push(...checkSubstringAmbiguity(displayWords))

  if (result.placements.length !== result.wordList.length) {
    errors.push({
      code: "ORPHAN_PLACEMENT",
      message: "Certains mots n'ont pas été placés dans la grille.",
    })
  }

  for (const placement of result.placements) {
    for (const cell of placement.cells) {
      if (cell.r < 0 || cell.r >= result.size || cell.c < 0 || cell.c >= result.size) {
        errors.push({
          code: "OUT_OF_BOUNDS",
          message: `Le mot "${placement.displayWord}" dépasse les limites de la grille.`,
        })
      }
    }
  }

  errors.push(...checkCrossings(result.placements, result.grid))
  errors.push(...checkSolutionData(result))

  if (context?.wordCountMin !== undefined && result.wordList.length < context.wordCountMin) {
    warnings.push({
      code: "WORD_COUNT_LOW",
      message: `Nombre de mots (${result.wordList.length}) inférieur au minimum (${context.wordCountMin}).`,
    })
  }

  if (context?.wordCountMax !== undefined && result.wordList.length > context.wordCountMax) {
    warnings.push({
      code: "WORD_COUNT_HIGH",
      message: `Nombre de mots (${result.wordList.length}) supérieur au maximum (${context.wordCountMax}).`,
    })
  }

  if (context?.minWordLength !== undefined || context?.maxWordLength !== undefined) {
    for (const entry of result.wordList) {
      const len = entry.word.length
      if (context.minWordLength !== undefined && len < context.minWordLength) {
        warnings.push({
          code: "WORD_LENGTH_LOW",
          message: `Le mot "${entry.word}" est trop court pour le niveau.`,
        })
      }
      if (context.maxWordLength !== undefined && len > context.maxWordLength) {
        warnings.push({
          code: "WORD_LENGTH_HIGH",
          message: `Le mot "${entry.word}" est trop long pour le niveau.`,
        })
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}
