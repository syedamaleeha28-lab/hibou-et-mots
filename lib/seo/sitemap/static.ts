/**
 * Static sitemap entries for fixed app routes (hubs, tools, legal).
 *
 * Inclusion rules:
 * - Hub/tool pages listed here → sitemap-static.xml
 * - Category pages under /mots-meles-* paths (grades, themes, seasons, etc.) →
 *   sitemap-categories.xml: THEME/GRADE/SEASONAL/DIFFICULTY + audience hubs
 *   are always included; other categories when PUBLISHED + indexable in DB
 *   (falls back to prisma seed definitions when DB is unavailable)
 * - Individual puzzles → sitemap-puzzles.xml automatically from DB/seed
 *
 * When adding a new fixed hub page, add its path to ROUTES and STATIC_PATHS below.
 * Dynamic /mots-meles-* subpages seeded as categories need no manual sitemap edit.
 */
import { absoluteUrl, DEFAULT_SITE_URL, ROUTES } from "@/lib/seo/routes"
import type { SitemapUrlEntry } from "./types"
import { priorityForStaticPage } from "./priority"

const STATIC_PATHS: string[] = [
  ROUTES.home,
  ROUTES.gratuits,
  ROUTES.imprimer,
  ROUTES.difficulteHub,
  ROUTES.ecoleHub,
  ROUTES.fetesHub,
  ROUTES.thematiquesHub,
  ROUTES.presseHub,
  ROUTES.enfants,
  ROUTES.adultes,
  ROUTES.seniors,
  ROUTES.pedagogie,
  ROUTES.personnages,
  ROUTES.solutions,
  ROUTES.application,
  ROUTES.jeuxMagazines,
  ROUTES.ressources,
  ROUTES.mentionsLegales,
  ROUTES.confidentialite,
  ROUTES.contact,
  ROUTES.aPropos,
  ROUTES.auteur,
  ROUTES.jouer,
  ROUTES.generateur,
]

const NOINDEX_STATIC_PATHS = new Set<string>([ROUTES.recherche])

export function getStaticSitemapEntries(siteUrl?: string): SitemapUrlEntry[] {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
  const now = new Date()

  return STATIC_PATHS.filter((path) => !NOINDEX_STATIC_PATHS.has(path)).map((path) => ({
    loc: absoluteUrl(path, base),
    lastModified: now,
    changeFrequency: path === ROUTES.home ? "daily" : "weekly",
    priority: priorityForStaticPage(path),
  }))
}
