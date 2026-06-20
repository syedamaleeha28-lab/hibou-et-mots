import { DIFFICULTY_PRESETS } from "@/lib/puzzle-engine/difficulty"
import type { DifficultySlug, Direction } from "@/lib/puzzle-engine"

const BASIC_DIAGONALS: Direction[] = ["DIAGONAL_DESCENDANTE", "DIAGONAL_MONTANTE"]

function isDiagonal(direction: Direction): boolean {
  return direction.includes("DIAGONAL")
}

export function resolveToolDirections(
  difficulty: DifficultySlug,
  allowDiagonals: boolean,
): Direction[] {
  const preset = DIFFICULTY_PRESETS[difficulty]
  let directions = [...preset.directions]

  if (!allowDiagonals) {
    directions = directions.filter((direction) => !isDiagonal(direction))
  } else if (difficulty === "facile" && !directions.some(isDiagonal)) {
    directions = [...directions, ...BASIC_DIAGONALS]
  }

  return directions.length > 0 ? directions : ["HORIZONTAL", "VERTICAL"]
}
