import { seasonalPath, themePath } from "@/lib/seo/routes"

/** Topical entities benchmarked from competitor word-search pages and theme word banks. */
export type ThemeEntityDefinition = {
  slug: string
  /** Display label for audit reports */
  label: string
  path: string
  isSeasonal: boolean
  competitorEntities: readonly string[]
  semanticPhrases?: readonly string[]
}

export const THEME_ENTITY_DEFINITIONS: ThemeEntityDefinition[] = [
  {
    slug: "noel",
    label: "Noël",
    path: seasonalPath("noel"),
    isSeasonal: true,
    competitorEntities: [
      "père noël",
      "renne",
      "traîneau",
      "sapin",
      "cadeaux",
      "lutins",
      "guirlande",
      "bonhomme de neige",
      "calendrier de l'avent",
      "réveillon",
      "neige",
      "étoile",
    ],
    semanticPhrases: ["mots cachés noël", "vocabulaire de noël", "vacances scolaires", "activité de noël"],
  },
  {
    slug: "halloween",
    label: "Halloween",
    path: seasonalPath("halloween"),
    isSeasonal: true,
    competitorEntities: [
      "citrouille",
      "fantôme",
      "sorcière",
      "vampire",
      "chauve-souris",
      "monstre",
      "bonbons",
      "déguisement",
      "araignée",
      "squelette",
    ],
    semanticPhrases: ["mots cachés halloween", "vocabulaire halloween"],
  },
  {
    slug: "animaux",
    label: "Animaux",
    path: themePath("animaux"),
    isSeasonal: false,
    competitorEntities: [
      "lion",
      "tigre",
      "éléphant",
      "girafe",
      "zèbre",
      "singe",
      "dauphin",
      "ferme",
      "savane",
      "jungle",
      "océan",
      "animaux sauvages",
      "animaux domestiques",
    ],
    semanticPhrases: ["mots cachés animaux", "vocabulaire animaux", "activité éducative"],
  },
  {
    slug: "fruits",
    label: "Fruits",
    path: themePath("fruits"),
    isSeasonal: false,
    competitorEntities: [
      "pomme",
      "poire",
      "banane",
      "orange",
      "raisin",
      "fraise",
      "kiwi",
      "ananas",
      "mangue",
      "pastèque",
      "cerise",
    ],
    semanticPhrases: ["vocabulaire fruits", "alimentation", "activité éducative"],
  },
  {
    slug: "sport",
    label: "Sport",
    path: themePath("sport"),
    isSeasonal: false,
    competitorEntities: [
      "football",
      "basket",
      "tennis",
      "natation",
      "vélo",
      "rugby",
      "gymnastique",
      "athlétisme",
      "handball",
      "course",
    ],
    semanticPhrases: ["vocabulaire du sport", "activité sportive", "éducation physique"],
  },
  {
    slug: "famille",
    label: "Famille",
    path: themePath("famille"),
    isSeasonal: false,
    competitorEntities: [
      "papa",
      "maman",
      "bébé",
      "frère",
      "sœur",
      "oncle",
      "tante",
      "cousin",
      "parents",
      "enfants",
      "mariage",
      "foyer",
    ],
    semanticPhrases: ["vocabulaire famille", "mots cachés famille", "vie quotidienne"],
  },
  {
    slug: "meteo",
    label: "Météo",
    path: themePath("meteo"),
    isSeasonal: false,
    competitorEntities: [
      "pluie",
      "neige",
      "soleil",
      "nuage",
      "vent",
      "orage",
      "brouillard",
      "tempête",
      "arc-en-ciel",
      "grêle",
      "canicule",
      "saison",
    ],
    semanticPhrases: ["vocabulaire météo", "mots cachés météo", "sciences"],
  },
  {
    slug: "couleurs",
    label: "Couleurs",
    path: themePath("couleurs"),
    isSeasonal: false,
    competitorEntities: [
      "rouge",
      "bleu",
      "vert",
      "jaune",
      "rose",
      "noir",
      "blanc",
      "orange",
      "violet",
      "marron",
      "gris",
      "turquoise",
    ],
    semanticPhrases: ["vocabulaire couleurs", "mots cachés couleurs", "maternelle"],
  },
  {
    slug: "vocabulaire",
    label: "École",
    path: themePath("vocabulaire"),
    isSeasonal: false,
    competitorEntities: [
      "mot",
      "lire",
      "écrire",
      "phrase",
      "lettre",
      "syllabe",
      "orthographe",
      "lecture",
      "grammaire",
      "dictionnaire",
      "vocabulaire",
      "conjugaison",
    ],
    semanticPhrases: ["vocabulaire scolaire", "programme de français", "mots cachés école"],
  },
  {
    slug: "corps-humain",
    label: "Corps humain",
    path: themePath("corps-humain"),
    isSeasonal: false,
    competitorEntities: [
      "tête",
      "main",
      "pied",
      "bras",
      "jambe",
      "œil",
      "oreille",
      "nez",
      "bouche",
      "cœur",
      "estomac",
      "peau",
      "cheveux",
      "dent",
    ],
    semanticPhrases: ["vocabulaire corps humain", "mots cachés corps", "sciences"],
  },
]

export const MIN_THEME_INTRO_WORDS = 250
export const MAX_THEME_INTRO_WORDS = 400
export const MIN_THEME_FAQ_ITEMS = 4

export function normalizeEntityText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function detectThemeEntities(text: string, entities: readonly string[]): string[] {
  const normalized = normalizeEntityText(text)
  return entities.filter((entity) => normalized.includes(normalizeEntityText(entity)))
}

export function missingThemeEntities(text: string, entities: readonly string[]): string[] {
  const present = new Set(detectThemeEntities(text, entities))
  return entities.filter((entity) => !present.has(entity))
}

export function themeEntityCoveragePercent(text: string, entities: readonly string[]): number {
  if (entities.length === 0) return 100
  const found = detectThemeEntities(text, entities).length
  return Math.round((found / entities.length) * 100)
}

export function getThemeEntityDefinition(slug: string): ThemeEntityDefinition | undefined {
  return THEME_ENTITY_DEFINITIONS.find((theme) => theme.slug === slug)
}
