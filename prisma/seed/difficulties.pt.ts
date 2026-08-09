/** Brazilian Portuguese difficulty levels — mirrors prisma/seed/difficulties.ts */
export const difficultySeedPt = [
  {
    locale: "pt-BR",
    slug: "facil",
    name: "Fácil",
    gridSizeMin: 8,
    gridSizeMax: 8,
    wordCountMin: 6,
    wordCountMax: 8,
    directions: ["HORIZONTAL", "VERTICAL"],
  },
  {
    locale: "pt-BR",
    slug: "medio",
    name: "Médio",
    gridSizeMin: 10,
    gridSizeMax: 10,
    wordCountMin: 8,
    wordCountMax: 10,
    directions: [
      "HORIZONTAL",
      "VERTICAL",
      "DIAGONAL_DESCENDANTE",
      "DIAGONAL_MONTANTE",
    ],
  },
  {
    locale: "pt-BR",
    slug: "dificil",
    name: "Difícil",
    gridSizeMin: 12,
    gridSizeMax: 15,
    wordCountMin: 12,
    wordCountMax: 15,
    directions: [
      "HORIZONTAL",
      "HORIZONTAL_INVERSE",
      "VERTICAL",
      "VERTICAL_INVERSE",
      "DIAGONAL_DESCENDANTE",
      "DIAGONAL_DESCENDANTE_INVERSE",
      "DIAGONAL_MONTANTE",
      "DIAGONAL_MONTANTE_INVERSE",
    ],
  },
] as const

export type DifficultySlugPt = (typeof difficultySeedPt)[number]["slug"]
