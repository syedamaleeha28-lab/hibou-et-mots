export const PILOT_PUZZLE_SLUG = "animaux-facile-01"

export const HUB_CATEGORY_SLUGS = {
  gratuits: "hub-gratuits",
  imprimer: "hub-imprimer",
  ecole: "hub-ecole",
  fetes: "hub-fetes",
  thematiques: "hub-thematiques",
  difficulte: "hub-difficulte",
  presse: "hub-presse",
} as const

export const MVP_PRESS_BRANDS = [
  { slug: "ouest-france", name: "Ouest-France" },
  { slug: "sud-ouest", name: "Sud Ouest" },
  { slug: "la-croix", name: "La Croix" },
] as const

export const MVP_SEASONAL_THEME_SLUGS = ["noel", "halloween", "paques", "carnaval", "rentree", "ete", "printemps"] as const

export const MVP_P0_THEME_SLUGS = ["animaux", "sport"] as const

export const MVP_P0_GRADE_SLUGS = ["cp", "ce1", "cm2"] as const

export const MVP_P0_DIFFICULTY_SLUGS = ["facile", "moyen", "difficile"] as const

export const MVP_P1_COMBOS = [
  { grade: "ce1", theme: "noel" },
  { grade: "ce1", theme: "halloween" },
] as const
