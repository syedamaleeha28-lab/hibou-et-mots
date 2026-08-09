/**
 * Brazilian Portuguese word bank — mirrors prisma/seed/theme-words.ts format.
 *
 * NOT YET WIRED INTO PUZZLE GENERATION. This file exists so the data shape
 * is ready for the next step (generating actual PT-BR puzzles via
 * lib/puzzle-engine/generate.ts). For this first pack, the PT-BR pages
 * render with 0 puzzles until that step happens — see the setup notes.
 */
import type { ThemeSlugPt } from "./themes.pt"

export type ThemeWordSeedPt = {
  themeSlug: ThemeSlugPt
  word: string
  minGradeOrder: number
}

function wordLength(word: string): number {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "").length
}

function entry(themeSlug: ThemeSlugPt, word: string, minGradeOrder: number): ThemeWordSeedPt {
  return { themeSlug, word: word.toUpperCase(), minGradeOrder }
}

const rawWordsPt: ThemeWordSeedPt[] = [
  // Animais
  ...[
    ["animais", "GATO", 0],
    ["animais", "CACHORRO", 1],
    ["animais", "LEAO", 1],
    ["animais", "URSO", 1],
    ["animais", "ZEBRA", 2],
    ["animais", "TIGRE", 2],
    ["animais", "COELHO", 1],
    ["animais", "RAPOSA", 2],
    ["animais", "ELEFANTE", 3],
    ["animais", "GIRAFA", 3],
    ["animais", "CROCODILO", 4],
    ["animais", "HIPOPOTAMO", 5],
    ["animais", "BORBOLETA", 4],
    ["animais", "GOLFINHO", 4],
    ["animais", "CANGURU", 5],
    // Extra mid-length words so "dificil" (needs 12) has enough eligible
    // under grade-order length bounds (5–9 / 5–10).
    ["animais", "MACACO", 2],
    ["animais", "CAVALO", 2],
    ["animais", "PATO", 0],
    ["animais", "OVELHA", 3],
    ["animais", "PANTERA", 4],
  ].map(([s, w, g]) => entry(s as ThemeSlugPt, w as string, g as number)),

  // Esporte
  ...[
    ["esporte", "BOLA", 0],
    ["esporte", "CORRIDA", 2],
    ["esporte", "PULO", 1],
    ["esporte", "NATACAO", 4],
    ["esporte", "TENIS", 3],
    ["esporte", "VOLEI", 3],
    ["esporte", "SKI", 1],
    ["esporte", "JUDO", 2],
    ["esporte", "GINASTICA", 5],
    ["esporte", "ATLETISMO", 5],
    ["esporte", "CAMPEAO", 4],
    ["esporte", "EQUIPE", 3],
    ["esporte", "TREINO", 4],
    ["esporte", "COMPETICAO", 6],
    ["esporte", "FUTEBOL", 2],
    ["esporte", "BASQUETE", 3],
    ["esporte", "SURFE", 2],
    ["esporte", "REMO", 1],
    ["esporte", "MEDALHA", 4],
    ["esporte", "TORNEIO", 4],
  ].map(([s, w, g]) => entry(s as ThemeSlugPt, w as string, g as number)),
]

export const themeWordSeedPt = rawWordsPt.map((w) => ({
  ...w,
  length: wordLength(w.word),
}))
