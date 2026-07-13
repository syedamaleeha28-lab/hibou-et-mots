import type { SynonymId } from "@/lib/content/synonym-phrases"

export type { SynonymId }

export type SynonymTerm = {
  id: SynonymId
  label: string
  patterns: RegExp[]
  /** Primary term — expected on every indexable page. */
  primary?: boolean
}

export const WORD_SEARCH_SYNONYMS: SynonymTerm[] = [
  {
    id: "mots-meles",
    label: "mots mêlés",
    patterns: [/mots\s+m[êe]l[ée]s/i],
    primary: true,
  },
  {
    id: "mots-caches",
    label: "mots cachés",
    patterns: [/mots\s+cach[ée]s/i],
  },
  {
    id: "grille-lettres",
    label: "grille de lettres",
    patterns: [/grilles?\s+de\s+lettres/i],
  },
  {
    id: "jeu-lettres",
    label: "jeu de lettres",
    patterns: [/jeux?\s+de\s+lettres/i],
  },
  {
    id: "puzzle-mots",
    label: "puzzle de mots",
    patterns: [/puzzles?\s+de\s+mots/i],
  },
  {
    id: "word-search",
    label: "word search",
    patterns: [/word\s+search/i],
  },
]

export const SECONDARY_SYNONYM_IDS = WORD_SEARCH_SYNONYMS.filter((term) => !term.primary).map(
  (term) => term.id,
)

/** Minimum secondary synonyms on pillar / important pages after coverage pass. */
export const MIN_SECONDARY_SYNONYMS_IMPORTANT = 4

/** Minimum secondary synonyms on other audited category pages. */
export const MIN_SECONDARY_SYNONYMS_DEFAULT = 3

export function normalizeSynonymText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Mark}/gu, "")
    .toLowerCase()
}

export function detectSynonymsInText(text: string): SynonymId[] {
  const normalized = normalizeSynonymText(text)
  return WORD_SEARCH_SYNONYMS.filter((term) =>
    term.patterns.some((pattern) => pattern.test(normalized)),
  ).map((term) => term.id)
}

export function synonymLabels(ids: SynonymId[]): string[] {
  return ids.map(
    (id) => WORD_SEARCH_SYNONYMS.find((term) => term.id === id)?.label ?? id,
  )
}

export function missingSynonymIds(present: SynonymId[]): SynonymId[] {
  return WORD_SEARCH_SYNONYMS.filter((term) => !present.includes(term.id)).map((term) => term.id)
}
