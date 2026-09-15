export type SudokuGradeSlug = "ce1" | "ce2" | "cm1" | "cm2"

export type SudokuGradeInfo = {
  slug: SudokuGradeSlug
  name: string
  ageRange: string
  /** Maps onto the existing 2 difficulty tiers — deliberately reuses
   *  already-verified puzzle content (see lib/sudoku/puzzles.ts's
   *  uniqueness-solver note) rather than generating new grade-specific
   *  puzzles. CE1/CE2 share the fácil tier, CM1/CM2 share the difícil
   *  tier — each grade page still gets its own real title, intro, and
   *  FAQ content; only the underlying puzzle data is shared. */
  tier: 1 | 2
}

export const SUDOKU_GRADES: SudokuGradeInfo[] = [
  { slug: "ce1", name: "CE1", ageRange: "7-8 ans", tier: 1 },
  { slug: "ce2", name: "CE2", ageRange: "8-9 ans", tier: 1 },
  { slug: "cm1", name: "CM1", ageRange: "9-10 ans", tier: 2 },
  { slug: "cm2", name: "CM2", ageRange: "10-11 ans", tier: 2 },
]

export function getSudokuGrade(slug: string): SudokuGradeInfo | undefined {
  return SUDOKU_GRADES.find((g) => g.slug === slug)
}
