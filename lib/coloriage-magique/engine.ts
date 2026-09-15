import { COLORIAGE_DESIGNS, type ColoriageDesign } from "./designs"

/** Own epoch, independent of every other daily game's rotation. */
const EPOCH_UTC_MS = Date.UTC(2024, 9, 1)

export function getDayIndex(date: Date = new Date()): number {
  const localMidnightAsUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((localMidnightAsUtc - EPOCH_UTC_MS) / 86_400_000)
}

export function getDesignForDay(
  dayIndex: number,
  designs: ColoriageDesign[] = COLORIAGE_DESIGNS,
): ColoriageDesign {
  const size = designs.length
  const idx = ((dayIndex % size) + size) % size
  return designs[idx]!
}

/** Filters designs by level. Defaults to "maternelle-cp" designs
 *  when a design has no explicit level (keeps the 2 original designs
 *  working exactly as before on the main /coloriage-magique/ pages,
 *  which should keep using ALL "maternelle-cp"-level designs, not
 *  the new CE2 ones — those get their own separate page). */
export function designsForLevel(
  level: "maternelle-cp" | "ce2",
  designs: ColoriageDesign[] = COLORIAGE_DESIGNS,
): ColoriageDesign[] {
  return designs.filter((d) => (d.level ?? "maternelle-cp") === level)
}

/** Region ids that have been correctly filled so far. */
export type ColoriageFillState = ReadonlySet<string>

export function isDesignComplete(design: ColoriageDesign, filled: ColoriageFillState): boolean {
  return design.regions.every((region) => filled.has(region.id))
}

export function legendColorForNumber(design: ColoriageDesign, number: number): string | undefined {
  return design.legend.find((entry) => entry.number === number)?.colorHex
}

/**
 * Structural validation, used by tests: every region's `number` must
 * correspond to a real legend entry, and every legend number must be
 * used by at least one region (no orphaned legend entries, no regions
 * pointing at a number that doesn't exist).
 */
export function isDesignWellFormed(design: ColoriageDesign): boolean {
  const legendNumbers = new Set(design.legend.map((entry) => entry.number))
  const usedNumbers = new Set(design.regions.map((region) => region.number))

  for (const region of design.regions) {
    if (!legendNumbers.has(region.number)) return false
  }
  for (const number of legendNumbers) {
    if (!usedNumbers.has(number)) return false
  }
  return true
}
