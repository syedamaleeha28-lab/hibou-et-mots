import type { CategoryType } from "@/lib/db/types/page-data"
import { CONTACT_EMAIL, ROUTES } from "@/lib/seo/routes"

/** Editorial identity for E-E-A-T (Experience, Expertise, Authoritativeness, Trust). */
export const SITE_AUTHOR = {
  name: "Équipe Hibou&Mots",
  jobTitle: "Créateurs et rédacteurs éducatifs",
  slug: "equipe-hibou-et-mots",
  email: CONTACT_EMAIL,
  mission:
    "Rendre les mots mêlés gratuits accessibles aux enfants, aux enseignants et aux familles en français — pour enrichir le vocabulaire en s'amusant, à la maison comme en classe.",
  experience:
    "L'équipe conçoit et publie des grilles de mots mêlés et de mots cachés calibrées par niveau scolaire (maternelle à 6e), par thème et par saison. Chaque liste de mots est pensée pour le programme de français : vocabulaire thématique, dictée, lecture et activités calmes en classe.",
  purpose:
    "Hibou&Mots est un site éducatif gratuit qui propose des mots mêlés à jouer en ligne ou à imprimer en PDF, un générateur personnalisé et des ressources pour les enseignants et les parents.",
  knowsAbout: [
    "Mots mêlés",
    "Mots cachés",
    "Vocabulaire scolaire",
    "Éducation primaire",
    "Orthographe et lecture",
    "Jeux éducatifs en français",
  ] as const,
} as const

/** Site-wide first publication (ISO 8601 date). */
export const SITE_PUBLISHED_DATE = "2024-06-01"

/** Last substantive editorial update (ISO 8601 date). */
export const SITE_CONTENT_UPDATED_DATE = "2026-06-23"

const EDUCATIONAL_AUTHOR_SLUGS = new Set([
  "pedagogie",
  "ressources-enseignants",
  "enfants",
  "hub-ecole",
  "hub-gratuits",
  "solutions",
])

export function shouldShowAuthorAttribution(slug: string, type?: CategoryType): boolean {
  if (EDUCATIONAL_AUTHOR_SLUGS.has(slug)) return true
  if (type === "GRADE" && slug !== "6e") return true
  return false
}

export function formatFrenchDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number)
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export const AUTHOR_PAGE_PATH = ROUTES.auteur
