export type CrosswordCell = string | null // letter, or null for a block cell

export type CrosswordEntry = {
  number: number
  row: number
  col: number
  len: number
  answer: string
  clue: string
}

export type CrosswordGrid = {
  id: string
  /**
   * "Force" difficulty tier (1 = easiest, 5 = hardest) — this is the actual
   * French crossword-difficulty naming convention (searchers look for
   * "mots croisés force 1" etc.), not "facile/moyen/difficile". Difficulty
   * here is operationalized as grid size + entry count: more/longer entries
   * = objectively more to solve = harder.
   */
  tier: 1 | 2 | 3 | 4 | 5
  rows: CrosswordCell[][]
  across: CrosswordEntry[]
  down: CrosswordEntry[]
}

/**
 * Scoping note (same spirit as the daily word game): entries are unaccented
 * (ETE not ÉTÉ, EPI not ÉPI) to keep typed-answer comparison simple. Only
 * the specific numbered entries below are clued/checked — unlike a
 * newspaper-grade crossword, incidental letter-runs elsewhere in the grid
 * aren't required to be valid words themselves. Every grid was verified
 * programmatically (each entry's letters were extracted from the grid and
 * checked against its declared answer) before being added here.
 */
export const MINI_CROSSWORD_GRIDS: CrosswordGrid[] = [
  {
    id: "rue",
    tier: 1,
    rows: [
      ["A", "B", "P"],
      ["R", "U", "E"],
      ["C", "T", "U"],
    ],
    across: [{ number: 1, row: 1, col: 0, len: 3, answer: "RUE", clue: "On y marche, bordée de maisons" }],
    down: [
      { number: 1, row: 0, col: 0, len: 3, answer: "ARC", clue: "Il tire des flèches" },
      { number: 2, row: 0, col: 1, len: 3, answer: "BUT", clue: "Ce qu'on cherche à atteindre" },
      { number: 3, row: 0, col: 2, len: 3, answer: "PEU", clue: "Pas beaucoup" },
    ],
  },
  {
    id: "rose",
    tier: 2,
    rows: [
      ["A", "M", "U", "M"],
      ["R", "O", "S", "E"],
      ["T", "T", "E", "R"],
    ],
    across: [{ number: 1, row: 1, col: 0, len: 4, answer: "ROSE", clue: "Fleur épineuse, ou couleur pâle" }],
    down: [
      { number: 1, row: 0, col: 0, len: 3, answer: "ART", clue: "Peinture, musique, sculpture..." },
      { number: 2, row: 0, col: 1, len: 3, answer: "MOT", clue: "Unité de langage" },
      { number: 3, row: 0, col: 2, len: 3, answer: "USE", clue: "S'abîme à force de servir" },
      { number: 4, row: 0, col: 3, len: 3, answer: "MER", clue: "Grande étendue d'eau salée" },
    ],
  },
  {
    id: "monde",
    tier: 3,
    rows: [
      ["A", "R", "A", "O", "M"],
      ["M", "O", "N", "D", "E"],
      ["I", "I", "E", "E", "R"],
    ],
    across: [
      { number: 1, row: 1, col: 0, len: 5, answer: "MONDE", clue: "La Terre et tout ce qui nous entoure" },
    ],
    down: [
      { number: 1, row: 0, col: 0, len: 3, answer: "AMI", clue: "Personne proche et fidèle" },
      { number: 2, row: 0, col: 1, len: 3, answer: "ROI", clue: "Souverain d'un royaume" },
      { number: 3, row: 0, col: 2, len: 3, answer: "ANE", clue: "Animal têtu aux longues oreilles" },
      { number: 4, row: 0, col: 3, len: 3, answer: "ODE", clue: "Poème lyrique" },
      { number: 5, row: 0, col: 4, len: 3, answer: "MER", clue: "Grande étendue d'eau salée" },
    ],
  },
  {
    id: "porte",
    tier: 3,
    rows: [
      ["E", "S", "A", "E", "V"],
      ["P", "O", "R", "T", "E"],
      ["I", "L", "C", "E", "R"],
    ],
    across: [
      { number: 1, row: 1, col: 0, len: 5, answer: "PORTE", clue: "On l'ouvre pour entrer ou sortir" },
    ],
    down: [
      { number: 1, row: 0, col: 0, len: 3, answer: "EPI", clue: "Partie du blé ou du maïs" },
      { number: 2, row: 0, col: 1, len: 3, answer: "SOL", clue: "Ce qu'on a sous les pieds" },
      { number: 3, row: 0, col: 2, len: 3, answer: "ARC", clue: "Il tire des flèches" },
      { number: 4, row: 0, col: 3, len: 3, answer: "ETE", clue: "Saison la plus chaude" },
      { number: 5, row: 0, col: 4, len: 3, answer: "VER", clue: "Petit animal sans pattes, ami du jardinier" },
    ],
  },
  {
    id: "maison",
    tier: 4,
    rows: [
      ["A", "S", "R", "O", "S", "U"],
      ["M", "A", "I", "S", "O", "N"],
      ["I", "C", "Z", "E", "L", "E"],
    ],
    across: [
      { number: 1, row: 1, col: 0, len: 6, answer: "MAISON", clue: "On y habite, avec un toit et des murs" },
    ],
    down: [
      { number: 1, row: 0, col: 0, len: 3, answer: "AMI", clue: "Personne proche et fidèle" },
      { number: 2, row: 0, col: 1, len: 3, answer: "SAC", clue: "On le porte sur l'épaule" },
      { number: 3, row: 0, col: 2, len: 3, answer: "RIZ", clue: "Céréale de base en Asie" },
      { number: 4, row: 0, col: 3, len: 3, answer: "OSE", clue: "N'a pas peur d'essayer" },
      { number: 5, row: 0, col: 4, len: 3, answer: "SOL", clue: "Ce qu'on a sous les pieds" },
      { number: 6, row: 0, col: 5, len: 3, answer: "UNE", clue: "Article féminin singulier" },
    ],
  },
  {
    id: "chat",
    tier: 4,
    rows: [
      ["E", null, "R", "E"],
      ["C", "H", "A", "T"],
      ["U", null, "T", "E"],
    ],
    across: [{ number: 1, row: 1, col: 0, len: 4, answer: "CHAT", clue: "Animal domestique qui miaule" }],
    down: [
      { number: 1, row: 0, col: 0, len: 3, answer: "ECU", clue: "Ancienne pièce de monnaie ou bouclier" },
      { number: 2, row: 0, col: 2, len: 3, answer: "RAT", clue: "Petit rongeur à longue queue" },
      { number: 3, row: 0, col: 3, len: 3, answer: "ETE", clue: "Saison la plus chaude" },
    ],
  },
  {
    id: "chapeau",
    tier: 5,
    rows: [
      [null, null, "T", "E", "F", "B", "R"],
      ["C", "H", "A", "P", "E", "A", "U"],
      [null, null, "S", "I", "U", "L", "E"],
    ],
    across: [{ number: 1, row: 1, col: 0, len: 7, answer: "CHAPEAU", clue: "Se porte sur la tête" }],
    down: [
      { number: 1, row: 0, col: 2, len: 3, answer: "TAS", clue: "Amoncellement en vrac" },
      { number: 2, row: 0, col: 3, len: 3, answer: "EPI", clue: "Partie du blé ou du maïs" },
      { number: 3, row: 0, col: 4, len: 3, answer: "FEU", clue: "Chaud et lumineux, on l'allume" },
      { number: 4, row: 0, col: 5, len: 3, answer: "BAL", clue: "Soirée dansante" },
      { number: 5, row: 0, col: 6, len: 3, answer: "RUE", clue: "On y marche, bordée de maisons" },
    ],
  },
]

export function gridsForTier(tier: 1 | 2 | 3 | 4 | 5): CrosswordGrid[] {
  return MINI_CROSSWORD_GRIDS.filter((g) => g.tier === tier)
}
