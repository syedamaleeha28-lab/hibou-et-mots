import { difficultySeed } from "@/prisma/seed/difficulties"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"
import { difficultySeedPt } from "@/prisma/seed/difficulties.pt"
import { themeSeedPt } from "@/prisma/seed/themes.pt"
import {
  MVP_P1_COMBOS,
  MVP_PRESS_BRANDS,
  MVP_SEASONAL_THEME_SLUGS,
  // NEW:
  MVP_GRADE_SLUGS_PT,
} from "@/lib/db/adapters/category-constants"

export function gradeStaticParams() {
  return gradeSeed.map((grade) => ({ grade: grade.slug }))
}

export function themeStaticParams() {
  return themeSeed.filter((theme) => !theme.isSeasonal).map((theme) => ({ theme: theme.slug }))
}

export function seasonalStaticParams() {
  return MVP_SEASONAL_THEME_SLUGS.map((theme) => ({ theme }))
}

export function difficultyStaticParams() {
  return difficultySeed.map((level) => ({ level: level.slug }))
}

export function comboStaticParams() {
  return MVP_P1_COMBOS.map(({ grade, theme }) => ({ grade, theme }))
}

export function pressBrandStaticParams() {
  return MVP_PRESS_BRANDS.map((brand) => ({ brand: brand.slug }))
}

// ------------------------------------------------------------
// PT-BR pack additions (v1 scope: themes + difficulties only)
// ------------------------------------------------------------

export function ptThemeStaticParams() {
  return themeSeedPt.map((theme) => ({ theme: theme.slug }))
}

export function ptDifficultyStaticParams() {
  return difficultySeedPt.map((level) => ({ level: level.slug }))
}

// NEW: PT-BR grade cluster static params. Doesn't read from a Prisma
// seed file the way the others do — grades.pt.ts was staged earlier in
// this project but never wired in, so this reads directly from the
// plain slug list in category-constants.ts instead.
export function ptGradeStaticParams() {
  return MVP_GRADE_SLUGS_PT.map((grade) => ({ ano: grade }))
}
