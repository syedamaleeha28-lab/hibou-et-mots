export const ANIMAL_WORDS = [
  "CHAT",
  "CHIEN",
  "LION",
  "ZEBRE",
  "TIGRE",
  "OURS",
  "RENARD",
  "LAPIN",
]

export const ACCENTED_WORDS = ["ÉCOLE", "ÉTÉ", "FRÈRE", "ÇA"]

export const LONG_WORD = "ANTICONSTITUTIONNELLEMENT"

export const IMPOSSIBLE_WORDS = Array.from({ length: 40 }, (_, i) => `MOTLONGNUMERO${i}`)

export function themedWordSet(seed: number): string[] {
  const base = [
    "CHAT",
    "CHIEN",
    "LION",
    "ZEBRE",
    "TIGRE",
    "OURS",
    "RENARD",
    "LAPIN",
    "POMME",
    "FRAISE",
  ]
  return base.map((w, i) => (i + seed) % 3 === 0 ? w : w.slice(0, 4 + (seed % 3)))
}
