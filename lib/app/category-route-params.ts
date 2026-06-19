import { difficultySeed } from "@/prisma/seed/difficulties"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"
import {
  MVP_P1_COMBOS,
  MVP_PRESS_BRANDS,
  MVP_SEASONAL_THEME_SLUGS,
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
