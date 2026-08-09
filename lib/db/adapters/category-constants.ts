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

/** Editorial / educational pages that reuse category routing but are not puzzle catalogs. */
export const STATIC_SUPPORT_CATEGORY_SLUGS = [
  "pedagogie",
  "personnages",
  "application",
  "solutions",
  "jeux-magazines",
  "ressources-enseignants",
] as const

export function isStaticSupportCategorySlug(slug: string): boolean {
  return (STATIC_SUPPORT_CATEGORY_SLUGS as readonly string[]).includes(slug)
}

// ============================================================
// PT-BR additions (v1 scope). Hub slugs are intentionally the SAME
// strings as the French ones (e.g. "hub-imprimer") — that's safe now
// because Category uniqueness is (locale, slug), not slug alone.
// Reusing hub slugs across locales keeps HUB_CATEGORY_SLUGS as the
// single source of truth for both languages.
// ============================================================

export const MVP_P0_THEME_SLUGS_PT = ["animais", "esporte"] as const

export const MVP_P0_DIFFICULTY_SLUGS_PT = ["facil", "medio", "dificil"] as const

export function isKnownPtThemeSlug(slug: string): boolean {
  return (MVP_P0_THEME_SLUGS_PT as readonly string[]).includes(slug)
}

export function isKnownPtDifficultySlug(slug: string): boolean {
  return (MVP_P0_DIFFICULTY_SLUGS_PT as readonly string[]).includes(slug)
}
