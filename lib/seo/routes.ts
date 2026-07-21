/** Canonical public paths — PRD §8, trailing slash enforced via next.config. */

import type { CategoryType } from "@/lib/db/types/page-data"
import { MVP_SEASONAL_THEME_SLUGS } from "@/lib/db/adapters/category-constants"

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
  aPropos: "/a-propos/",
  auteur: "/auteur/",
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

const SEASONAL_THEME_SLUGS = new Set<string>(MVP_SEASONAL_THEME_SLUGS)

/** True for fêtes/saisons themes that must never live under /mots-meles-thematiques/. */
export function isSeasonalThemeSlug(slug: string): boolean {
  return SEASONAL_THEME_SLUGS.has(slug)
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

export const DEFAULT_SITE_URL = "https://hibou-et-mots.com"

export const CONTACT_EMAIL = "hibou.et.mots@gmail.com"

export const SOCIAL_PROFILES = {
  instagram: "https://www.instagram.com/hibou.et.mots/",
  x: "https://x.com/hibouetmots",
  pinterest: "https://pin.it/5J8yqtESq",
} as const

export const SOCIAL_PROFILE_URLS = Object.values(SOCIAL_PROFILES)

/**
 * Resolve the public site origin: HTTPS, no trailing slash, www stripped.
 * Keeps canonicals / sitemap locs on the preferred apex host.
 */
export function resolveSiteOrigin(
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL,
): string {
  try {
    const withProtocol = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`
    const url = new URL(withProtocol)
    if (url.hostname.toLowerCase().startsWith("www.")) {
      url.hostname = url.hostname.slice(4)
    }
    url.protocol = "https:"
    return url.origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function absoluteUrl(
  path: string,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL,
): string {
  const base = resolveSiteOrigin(siteUrl)
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalized}`
}

export type CategoryPathInput = {
  type: CategoryType
  slug: string
  grade?: { slug: string } | null
  theme?: { slug: string } | null
  difficulty?: { slug: string } | null
  pressBrand?: { slug: string } | null
}

const HUB_SLUG_PATHS: Record<string, string> = {
  "hub-gratuits": ROUTES.gratuits,
  "hub-imprimer": ROUTES.imprimer,
  "hub-ecole": ROUTES.ecoleHub,
  "hub-fetes": ROUTES.fetesHub,
  "hub-thematiques": ROUTES.thematiquesHub,
  "hub-difficulte": ROUTES.difficulteHub,
  "hub-presse": ROUTES.presseHub,
}

const AUDIENCE_SLUG_PATHS: Record<string, string> = {
  enfants: ROUTES.enfants,
  adultes: ROUTES.adultes,
  seniors: ROUTES.seniors,
}

const STATIC_SUPPORT_SLUG_PATHS: Record<string, string> = {
  pedagogie: ROUTES.pedagogie,
  personnages: ROUTES.personnages,
  application: ROUTES.application,
  solutions: ROUTES.solutions,
  "jeux-magazines": ROUTES.jeuxMagazines,
  "ressources-enseignants": ROUTES.ressources,
}

/** DB-driven category → canonical path (single source of truth). */
export function resolveCategoryPath(input: CategoryPathInput): string {
  const hubPath = HUB_SLUG_PATHS[input.slug]
  if (hubPath) return hubPath

  switch (input.type) {
    case "GRADE":
      return input.grade ? gradePath(input.grade.slug) : ROUTES.ecoleHub
    case "THEME": {
      // Guard: seasonal themes must use /mots-meles-fetes-saisons/ even if
      // mis-typed as THEME in the DB (prevents wrong sitemap locs).
      const themeSlug = input.theme?.slug ?? input.slug
      if (isSeasonalThemeSlug(themeSlug)) return seasonalPath(themeSlug)
      return input.theme ? themePath(input.theme.slug) : ROUTES.thematiquesHub
    }
    case "SEASONAL":
      return input.theme ? seasonalPath(input.theme.slug) : ROUTES.fetesHub
    case "DIFFICULTY":
      return input.difficulty
        ? difficultyPath(input.difficulty.slug)
        : ROUTES.difficulteHub
    case "AUDIENCE":
      return (
        AUDIENCE_SLUG_PATHS[input.slug] ??
        STATIC_SUPPORT_SLUG_PATHS[input.slug] ??
        `/mots-meles-${input.slug}/`
      )
    case "PRESS_BRAND":
      return input.pressBrand
        ? pressBrandPath(input.pressBrand.slug)
        : ROUTES.presseHub
    case "COMBO":
      if (input.grade && input.theme) {
        return comboPath(input.grade.slug, input.theme.slug)
      }
      return ROUTES.ecoleHub
    default:
      return ROUTES.home
  }
}

export function resolvePuzzlePath(slug: string): string {
  return puzzlePath(slug)
}
