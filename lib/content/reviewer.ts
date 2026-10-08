import { ROUTES } from "@/lib/seo/routes"

/** Independent reviewer. Not the site author. */
export const SITE_REVIEWER = {
  name: "Faqir Syed Iftikhar",
  jobTitle: "Enseignant",
  worksFor: {
    "@type": "EducationalOrganization",
    name: "Royal Academy School",
  },
  description:
    "Faqir Syed Iftikhar enseigne l'anglais et les mathématiques à Royal Academy School, du Grade 4 au Grade 12, dans le programme CBSE, depuis 5 ans. Il relit certaines pages de Hibou & Mots pour vérifier que le niveau, la difficulté et les consignes conviennent à l'âge des élèves.",
} as const

/** Visible line under the publisher byline on allowlisted pages only. */
export const REVIEWER_BYLINE =
  "Niveau et difficulté relus par Faqir Syed Iftikhar, enseignant à Royal Academy School."

export const REVIEWER_PAGE_H1 = "Faqir Syed Iftikhar, enseignant"

export const REVIEWER_PAGE_HEADING = "À propos de l'enseignant"

export const REVIEWER_PAGE_TITLE = "Faqir Syed Iftikhar, enseignant — Hibou & Mots"

export const REVIEWER_PAGE_DESCRIPTION =
  "Faqir Syed Iftikhar enseigne l'anglais et les mathématiques à Royal Academy School. Il relit des pages de Hibou & Mots et partage ses conseils pour utiliser les mots mêlés en classe et à la maison."

export const REVIEWED_PAGE_PATHS = [
  ROUTES.pedagogie,
  ROUTES.ecoleHub,
  ROUTES.enfants,
] as const

const REVIEWED_PAGE_PATH_SET = new Set<string>(REVIEWED_PAGE_PATHS)

export function isReviewedPage(path: string | undefined | null): boolean {
  if (!path) return false
  return REVIEWED_PAGE_PATH_SET.has(path)
}
