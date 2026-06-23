/** Shared French word-search synonym phrases for SEO coverage. */

export const SYNONYM_LABELS = [
  "mots mêlés",
  "mots cachés",
  "grille de lettres",
  "jeu de lettres",
  "puzzle de mots",
  "word search",
] as const

export type SynonymId =
  | "mots-meles"
  | "mots-caches"
  | "grille-lettres"
  | "jeu-lettres"
  | "puzzle-mots"
  | "word-search"

/** Visible on every category page beneath the intro. */
export const CATEGORY_SYNONYM_NOTE =
  "Chaque activité est un jeu de lettres et un word search en français : mots mêlés, mots cachés, grille de lettres et puzzle de mots — à imprimer ou à jouer en ligne."

/** How-to-play block description (category + puzzle pages). */
export const HOW_TO_PLAY_SYNONYM_DESCRIPTION =
  "Mots mêlés, mots cachés, grille de lettres, jeu de lettres, puzzle de mots — votre word search en français, en 3 étapes simples."

/** Homepage metadata and hero support copy. */
export const HOME_SYNONYM_PHRASE =
  "Mots mêlés, mots cachés, grilles de lettres et puzzles de mots : le word search gratuit en français pour toute la famille."

/** Tool pages (generator + online play). */
export const TOOL_SYNONYM_PHRASE =
  "Composez ou jouez un jeu de lettres instantané : mots mêlés, mots cachés, grille de lettres et puzzle de mots — word search sans installation."

/** Puzzle page default FAQ enrichment. */
export const PUZZLE_SYNONYM_PHRASE =
  "Ce puzzle de mots est aussi un jeu de mots cachés et une grille de lettres : un word search à retrouver horizontalement, verticalement ou en diagonale."
