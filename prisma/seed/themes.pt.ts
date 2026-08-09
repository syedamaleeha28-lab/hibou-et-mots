/**
 * Brazilian Portuguese themes — v1 scope only (2 themes to test the pipeline).
 * Mirrors prisma/seed/themes.ts. Extend this array once the first pages
 * are verified working; do not need to match the French theme list 1:1.
 */
export const themeSeedPt = [
  {
    locale: "pt-BR",
    slug: "animais",
    name: "Animais",
    group: "Natureza e Animais",
    isSeasonal: false,
    activeDateStart: null,
    activeDateEnd: null,
  },
  {
    locale: "pt-BR",
    slug: "esporte",
    name: "Esporte",
    group: "Esporte e Lazer",
    isSeasonal: false,
    activeDateStart: null,
    activeDateEnd: null,
  },
] as const

export type ThemeSlugPt = (typeof themeSeedPt)[number]["slug"]
