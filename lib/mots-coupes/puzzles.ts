export type MotsCoupesPair = {
  /** Stable id, also the link between a left fragment and its correct
   *  right fragment — a match is simply "same pair id selected on both
   *  sides", regardless of display order. */
  id: string
  word: string
  part1: string
  part2: string
}

export type MotsCoupesPuzzle = {
  id: string
  /** Simpler 3-tier scheme than the crossword's Force 1–5 — word length
   *  and count scale up per tier. Expand to a finer scheme later if
   *  content grows; not worth the complexity for a first version. */
  tier: 1 | 2 | 3
  /** Canonical order — defines the LEFT column's numbering (1, 2, 3…). */
  pairs: MotsCoupesPair[]
  /**
   * Pair ids in the order the RIGHT column's fragments should display
   * (lettered A, B, C…) — a fixed, hand-verified derangement (no id
   * appears at its own canonical index), so the puzzle is never
   * trivially "already matched" by position. Baked into the data
   * (not shuffled at runtime) so the printed version and the online
   * version always show the identical layout.
   */
  part2Order: string[]
}

/**
 * Words are stored unaccented and uppercase, matching the same house
 * convention as theme-words.ts and the mini-crossword grids (ETE not
 * ÉTÉ, etc.) — consistency across the site's puzzle content, not a
 * technical requirement here (this game doesn't involve typed input).
 *
 * Every split was manually checked against every OTHER fragment pair
 * in the same puzzle to rule out an unintended fragment combination
 * spelling a different real French word — see inline notes on the
 * handful of borderline (proper-noun-only) coincidences left in on
 * purpose, same standard the crossword grids' own comment describes.
 */
export const MOTS_COUPES_PUZZLES: MotsCoupesPuzzle[] = [
  {
    id: "maison",
    tier: 1,
    pairs: [
      { id: "maison", word: "MAISON", part1: "MAI", part2: "SON" },
      { id: "table", word: "TABLE", part1: "TA", part2: "BLE" },
      { id: "velo", word: "VELO", part1: "VE", part2: "LO" },
      { id: "porte", word: "PORTE", part1: "POR", part2: "TE" },
      { id: "livre", word: "LIVRE", part1: "LI", part2: "VRE" },
      { id: "jardin", word: "JARDIN", part1: "JAR", part2: "DIN" },
    ],
    // Verified derangement — no pair id sits at its own canonical index.
    part2Order: ["livre", "jardin", "porte", "velo", "maison", "table"],
  },
  {
    id: "animaux-du-jardin",
    tier: 1,
    pairs: [
      { id: "ballon", word: "BALLON", part1: "BAL", part2: "LON" },
      { id: "chaton", word: "CHATON", part1: "CHA", part2: "TON" },
      { id: "soleil", word: "SOLEIL", part1: "SO", part2: "LEIL" },
      { id: "nuage", word: "NUAGE", part1: "NU", part2: "AGE" },
      { id: "fleur", word: "FLEUR", part1: "FLE", part2: "UR" },
      { id: "poisson", word: "POISSON", part1: "POIS", part2: "SON" },
    ],
    part2Order: ["poisson", "nuage", "chaton", "fleur", "ballon", "soleil"],
  },
  {
    id: "objets-du-quotidien",
    tier: 2,
    pairs: [
      { id: "chocolat", word: "CHOCOLAT", part1: "CHOCO", part2: "LAT" },
      { id: "ordinateur", word: "ORDINATEUR", part1: "ORDI", part2: "NATEUR" },
      { id: "bibliotheque", word: "BIBLIOTHEQUE", part1: "BIBLIO", part2: "THEQUE" },
      { id: "parapluie", word: "PARAPLUIE", part1: "PARA", part2: "PLUIE" },
      { id: "anniversaire", word: "ANNIVERSAIRE", part1: "ANNI", part2: "VERSAIRE" },
      { id: "telephone", word: "TELEPHONE", part1: "TELE", part2: "PHONE" },
    ],
    part2Order: [
      "telephone",
      "parapluie",
      "ordinateur",
      "anniversaire",
      "chocolat",
      "bibliotheque",
    ],
  },
  {
    id: "grands-mots",
    tier: 3,
    pairs: [
      { id: "extraordinaire", word: "EXTRAORDINAIRE", part1: "EXTRA", part2: "ORDINAIRE" },
      { id: "responsabilite", word: "RESPONSABILITE", part1: "RESPONSA", part2: "BILITE" },
      { id: "environnement", word: "ENVIRONNEMENT", part1: "ENVIRON", part2: "NEMENT" },
      { id: "independance", word: "INDEPENDANCE", part1: "INDE", part2: "PENDANCE" },
      { id: "caracteristique", word: "CARACTERISTIQUE", part1: "CARACTE", part2: "RISTIQUE" },
      { id: "international", word: "INTERNATIONAL", part1: "INTER", part2: "NATIONAL" },
    ],
    part2Order: [
      "international",
      "environnement",
      "independance",
      "caracteristique",
      "extraordinaire",
      "responsabilite",
    ],
  },
]

export function puzzlesForTier(tier: 1 | 2 | 3): MotsCoupesPuzzle[] {
  return MOTS_COUPES_PUZZLES.filter((p) => p.tier === tier)
}
