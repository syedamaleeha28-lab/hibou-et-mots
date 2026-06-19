import { absoluteUrl, ROUTES } from "@/lib/seo/routes"
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
]

const NOINDEX_STATIC_PATHS = new Set<string>([
  ROUTES.recherche,
  ROUTES.jouer,
  ROUTES.generateur,
])

export function getStaticSitemapEntries(siteUrl?: string): SitemapUrlEntry[] {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://hibou-et-mots.fr"
  const now = new Date()

  return STATIC_PATHS.filter((path) => !NOINDEX_STATIC_PATHS.has(path)).map((path) => ({
    loc: absoluteUrl(path, base),
    lastModified: now,
    changeFrequency: path === ROUTES.home ? "daily" : "weekly",
    priority: priorityForStaticPage(path),
  }))
}
