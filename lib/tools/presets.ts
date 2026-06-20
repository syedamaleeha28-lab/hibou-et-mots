export type ThemePreset = {
  id: string
  label: string
  words: string
}

export const GENERATOR_THEME_PRESETS: ThemePreset[] = [
  {
    id: "animaux",
    label: "Animaux",
    words: "CHAT, CHIEN, LION, ZEBRE, TIGRE, OURS, RENARD, LAPIN",
  },
  {
    id: "fruits",
    label: "Fruits",
    words: "POMME, FRAISE, BANANE, CERISE, RAISIN, MELON, POIRE, KIWI",
  },
  {
    id: "couleurs",
    label: "Couleurs",
    words: "ROUGE, BLEU, VERT, JAUNE, ROSE, ORANGE, MARRON, NOIR",
  },
  {
    id: "ecole",
    label: "École",
    words: "CRAYON, CAHIER, REGLE, GOMME, LIVRE, STYLO, TABLE, COLLE",
  },
]

export type PlayableTheme = {
  slug: string
  label: string
}

export const ONLINE_PLAY_THEMES: PlayableTheme[] = [
  { slug: "animaux", label: "Animaux" },
  { slug: "fruits", label: "Fruits" },
  { slug: "noel", label: "Noël" },
  { slug: "sport", label: "Sport" },
  { slug: "couleurs", label: "Couleurs" },
  { slug: "vocabulaire", label: "École" },
]

export const GRID_SIZE_OPTIONS = [8, 10, 12, 15] as const

export type GridSizeOption = (typeof GRID_SIZE_OPTIONS)[number]
