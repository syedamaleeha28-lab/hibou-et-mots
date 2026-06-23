export type EducationalEntityId =
  | "education-nationale"
  | "cycle-1"
  | "cycle-2"
  | "cycle-3"
  | "apprentissage-lecture"
  | "vocabulaire-scolaire"
  | "comprehension-ecrite"

export type EducationalEntityTerm = {
  id: EducationalEntityId
  label: string
  patterns: RegExp[]
}

export const EDUCATIONAL_ENTITIES: EducationalEntityTerm[] = [
  {
    id: "education-nationale",
    label: "Éducation Nationale",
    patterns: [/education\s+nationale/i, /education\s+nationales/i],
  },
  {
    id: "cycle-1",
    label: "Cycle 1",
    patterns: [/cycle\s+1/i],
  },
  {
    id: "cycle-2",
    label: "Cycle 2",
    patterns: [/cycle\s+2/i],
  },
  {
    id: "cycle-3",
    label: "Cycle 3",
    patterns: [/cycle\s+3/i],
  },
  {
    id: "apprentissage-lecture",
    label: "apprentissage de la lecture",
    patterns: [/apprentissage\s+de\s+la\s+lecture/i],
  },
  {
    id: "vocabulaire-scolaire",
    label: "vocabulaire scolaire",
    patterns: [/vocabulaire\s+scolaire/i],
  },
  {
    id: "comprehension-ecrite",
    label: "compréhension écrite",
    patterns: [/comprehension\s+ecrite/i],
  },
]

export const MIN_ENTITIES_HUB_PAGES = 5
export const MIN_ENTITIES_GRADE_PAGES = 2
export const MIN_ENTITIES_SNIPPET_PAGES = 2

export function normalizeEducationalText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Mark}/gu, "")
    .toLowerCase()
}

export function detectEducationalEntities(text: string): EducationalEntityId[] {
  const normalized = normalizeEducationalText(text)
  return EDUCATIONAL_ENTITIES.filter((term) =>
    term.patterns.some((pattern) => pattern.test(normalized)),
  ).map((term) => term.id)
}

export function entityLabels(ids: EducationalEntityId[]): string[] {
  return ids.map((id) => EDUCATIONAL_ENTITIES.find((term) => term.id === id)?.label ?? id)
}

export function missingEntityIds(present: EducationalEntityId[]): EducationalEntityId[] {
  return EDUCATIONAL_ENTITIES.filter((term) => !present.includes(term.id)).map((term) => term.id)
}
