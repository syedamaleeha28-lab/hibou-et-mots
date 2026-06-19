/** Canonical public paths — PRD §8, trailing slash enforced via next.config. */

export const ROUTES = {
  home: "/",
  gratuits: "/mots-meles-gratuits/",
  imprimer: "/mots-meles-a-imprimer/",
  jouer: "/jouer-mots-meles-en-ligne/",
  generateur: "/generateur-mots-meles/",
  recherche: "/recherche/",
  difficulteHub: "/mots-meles-difficulte/",
  ecoleHub: "/mots-meles-ecole/",
  fetesHub: "/mots-meles-fetes-saisons/",
  thematiquesHub: "/mots-meles-thematiques/",
  presseHub: "/mots-meles-journaux-magazines/",
  enfants: "/mots-meles-enfants/",
  adultes: "/mots-meles-adultes/",
  seniors: "/mots-meles-seniors/",
  pedagogie: "/mots-meles-pedagogie/",
  personnages: "/mots-meles-personnages/",
  solutions: "/solutions-regles-mots-meles/",
  application: "/application-mots-meles/",
  jeuxMagazines: "/jeux-magazines-mots-meles/",
  ressources: "/ressources-enseignants-mots-meles/",
  mentionsLegales: "/mentions-legales/",
  confidentialite: "/politique-de-confidentialite/",
  contact: "/contact/",
} as const

export function gradePath(slug: string): string {
  return `/mots-meles-ecole/${slug}/`
}

export function themePath(slug: string): string {
  return `/mots-meles-thematiques/${slug}/`
}

export function seasonalPath(slug: string): string {
  return `/mots-meles-fetes-saisons/${slug}/`
}

export function difficultyPath(slug: string): string {
  return `/mots-meles-difficulte/${slug}/`
}

export function comboPath(gradeSlug: string, themeSlug: string): string {
  return `/mots-meles-ecole/${gradeSlug}/${themeSlug}/`
}

export function puzzlePath(slug: string): string {
  return `/mots-meles/${slug}/`
}

export function pressBrandPath(slug: string): string {
  return `/mots-meles-journaux-magazines/${slug}/`
}

export function absoluteUrl(path: string, siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hibou-et-mots.fr"): string {
  const base = siteUrl.replace(/\/$/, "")
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalized}`
}
