import type { CategoryPageData, CategoryType } from "@/lib/db/types/page-data"
import { categoryPathFromDefinition } from "@/lib/seo/link-graph/paths"
import {
  ROUTES,
  seasonalPath,
  themePath,
} from "@/lib/seo/routes"
import { generatorCtaHref } from "@/lib/seo/linking"
import {
  CATEGORY_SEED_DEFINITIONS,
  type CategorySeedDefinition,
} from "@/prisma/seed/categories"
import { themeSeed } from "@/prisma/seed/themes"

export type CategoryExploreLink = {
  href: string
  label: string
  description: string
}

const DEDICATED_EDITORIAL_SLUGS = new Set([
  "animaux",
  "fruits",
  "halloween",
  "noel",
  "sport",
  "hub-gratuits",
  "hub-imprimer",
  "hub-ecole",
  "enfants",
])

export function hasDedicatedEditorialLinks(slug: string): boolean {
  return DEDICATED_EDITORIAL_SLUGS.has(slug)
}

function toolLinks(themeSlug?: string): CategoryExploreLink[] {
  return [
    {
      href: ROUTES.jouer,
      label: "Jouer en ligne",
      description: "Partie immédiate dans le navigateur, sans impression",
    },
    {
      href: ROUTES.imprimer,
      label: "Mots mêlés à imprimer",
      description: "PDF A4 avec corrigé pour la classe ou la maison",
    },
    {
      href: generatorCtaHref(themeSlug),
      label: "Générateur gratuit",
      description: "Composez une grille personnalisée avec vos propres mots",
    },
  ]
}

function printableLinks(): CategoryExploreLink[] {
  return [
    {
      href: ROUTES.gratuits,
      label: "Catalogue gratuit",
      description: "Toutes les grilles publiées sur Hibou&Mots",
    },
    {
      href: ROUTES.imprimer,
      label: "Mots mêlés à imprimer",
      description: "Hub PDF : thèmes, niveaux et fêtes prêts à photocopier",
    },
  ]
}

function audienceLinks(): CategoryExploreLink[] {
  return [
    {
      href: ROUTES.enfants,
      label: "Mots mêlés Enfants",
      description: "Grilles calibrées pour les 3–12 ans",
    },
    {
      href: ROUTES.adultes,
      label: "Mots mêlés Adultes",
      description: "Puzzles plus denses pour les grown-ups",
    },
    {
      href: ROUTES.seniors,
      label: "Mots mêlés Seniors",
      description: "Grand format et lecture confortable",
    },
  ]
}

function hubLinks(): CategoryExploreLink[] {
  return [
    {
      href: ROUTES.ecoleHub,
      label: "Mots mêlés École",
      description: "Maternelle, CP, CE1… CM2 et 6e",
    },
    {
      href: ROUTES.thematiquesHub,
      label: "Mots mêlés thématiques",
      description: "Animaux, sport, vocabulaire et plus",
    },
    {
      href: ROUTES.fetesHub,
      label: "Fêtes & saisons",
      description: "Noël, Halloween, Pâques, rentrée, été",
    },
  ]
}

function themeSiblingLink(slug: string): CategoryExploreLink | null {
  const siblings: Record<string, CategoryExploreLink> = {
    football: {
      href: themePath("sport"),
      label: "Thème Sport",
      description: "Football, basket, natation et autres disciplines",
    },
    sport: {
      href: themePath("football"),
      label: "Thème Football",
      description: "Ballon, but, pelouse et équipes",
    },
    couleurs: {
      href: themePath("vocabulaire"),
      label: "Thème Vocabulaire",
      description: "Lexique scolaire et mots du quotidien",
    },
    vocabulaire: {
      href: themePath("couleurs"),
      label: "Thème Couleurs",
      description: "Rouge, bleu, vert… idéal en maternelle",
    },
    meteo: {
      href: themePath("famille"),
      label: "Thème Famille",
      description: "Maison, parents, fratrie et quotidien",
    },
    famille: {
      href: themePath("meteo"),
      label: "Thème Météo",
      description: "Soleil, pluie, neige et saisons",
    },
  }
  return siblings[slug] ?? null
}

function seasonalSiblingLink(slug: string): CategoryExploreLink | null {
  const siblings: Record<string, CategoryExploreLink> = {
    noel: {
      href: seasonalPath("halloween"),
      label: "Mots mêlés Halloween",
      description: "Citrouille, fantôme et déguisements",
    },
    halloween: {
      href: seasonalPath("noel"),
      label: "Mots mêlés Noël",
      description: "Sapin, cadeaux et fêtes de fin d'année",
    },
    paques: {
      href: seasonalPath("carnaval"),
      label: "Mots mêlés Carnaval",
      description: "Défilé, masque et confettis",
    },
    carnaval: {
      href: seasonalPath("paques"),
      label: "Mots mêlés Pâques",
      description: "Œufs, cloche et printemps",
    },
    rentree: {
      href: seasonalPath("ete"),
      label: "Mots mêlés Été",
      description: "Vacances, plage et soleil",
    },
    ete: {
      href: seasonalPath("rentree"),
      label: "Mots mêlés Rentrée",
      description: "Cartable, classe et nouveaux cahiers",
    },
  }
  return siblings[slug] ?? null
}

function linksForType(type: CategoryType, category: CategoryPageData): CategoryExploreLink[] {
  const themeSlug = category.theme?.slug
  const label = category.theme?.name ?? category.h1.replace(/^Mots mêlés\s+/i, "")

  switch (type) {
    case "THEME": {
      const links = [
        ...toolLinks(themeSlug),
        ...printableLinks(),
        {
          href: ROUTES.enfants,
          label: "Mots mêlés Enfants",
          description: `Grilles ${label} adaptées aux 3–12 ans`,
        },
        {
          href: ROUTES.ecoleHub,
          label: "Par niveau scolaire",
          description: "Maternelle au CM2 avec vocabulaire calibré",
        },
        {
          href: ROUTES.thematiquesHub,
          label: "Tous les thèmes",
          description: "Parcourir le catalogue thématique complet",
        },
      ]
      const sibling = themeSiblingLink(category.slug)
      if (sibling) links.push(sibling)
      return links
    }
    case "SEASONAL": {
      const links = [
        ...toolLinks(themeSlug),
        ...printableLinks(),
        {
          href: ROUTES.fetesHub,
          label: "Fêtes & saisons",
          description: "Noël, Halloween, Pâques et autres occasions",
        },
        {
          href: ROUTES.enfants,
          label: "Mots mêlés Enfants",
          description: `Activités ${label} pour la maternelle et le primaire`,
        },
        {
          href: ROUTES.ecoleHub,
          label: "Mots mêlés École",
          description: "Distribuer une grille en classe avant les vacances",
        },
      ]
      const sibling = seasonalSiblingLink(category.slug)
      if (sibling) links.push(sibling)
      return links
    }
    case "GRADE":
      return [
        ...toolLinks(),
        ...printableLinks(),
        {
          href: ROUTES.ecoleHub,
          label: "Hub École",
          description: "Comparer tous les niveaux du primaire et du collège",
        },
        {
          href: ROUTES.enfants,
          label: "Mots mêlés Enfants",
          description: "Vue d'ensemble par tranche d'âge",
        },
        {
          href: ROUTES.thematiquesHub,
          label: "Mots mêlés thématiques",
          description: "Croiser un thème avec le niveau de votre classe",
        },
      ]
    case "AUDIENCE":
      if (category.slug === "enfants") return []
      return [
        ...toolLinks(),
        ...printableLinks(),
        ...hubLinks(),
        {
          href: ROUTES.pedagogie,
          label: "Pédagogie",
          description: "Conseils pour enseignants et parents",
        },
        ...(category.slug === "adultes"
          ? [
              {
                href: ROUTES.seniors,
                label: "Mots mêlés Seniors",
                description: "Grilles grand format pour une lecture confortable",
              },
            ]
          : [
              {
                href: ROUTES.adultes,
                label: "Mots mêlés Adultes",
                description: "Puzzles plus exigeants pour les passionnés",
              },
            ]),
      ]
    case "DIFFICULTY":
      return [
        ...toolLinks(),
        ...printableLinks(),
        {
          href: ROUTES.difficulteHub,
          label: "Hub Difficulté",
          description: "Facile, moyen, difficile et géant",
        },
        {
          href: ROUTES.enfants,
          label: "Mots mêlés Enfants",
          description: "Commencer par une grille facile",
        },
      ]
    case "HUB":
      return [
        ...toolLinks(),
        ...printableLinks(),
        ...audienceLinks(),
        ...hubLinks().filter((link) => link.href !== category.canonicalPath),
      ]
    case "PRESS_BRAND":
      return [
        ...toolLinks(),
        ...printableLinks(),
        {
          href: ROUTES.presseHub,
          label: "Journaux & magazines",
          description: "Ouest-France, Sud-Ouest, La Croix et autres titres",
        },
        {
          href: ROUTES.adultes,
          label: "Mots mêlés Adultes",
          description: "Grilles denses comme dans la presse",
        },
        {
          href: ROUTES.seniors,
          label: "Mots mêlés Seniors",
          description: "Puzzles papier et lecture agrandie",
        },
      ]
    case "COMBO":
      return [
        ...toolLinks(themeSlug),
        ...printableLinks(),
        {
          href: ROUTES.ecoleHub,
          label: "Mots mêlés École",
          description: "Autres combinaisons niveau × thème",
        },
        {
          href: ROUTES.fetesHub,
          label: "Fêtes & saisons",
          description: "Noël, Halloween et autres grilles festives",
        },
      ]
    case "STATIC_SUPPORT":
      return [
        ...toolLinks(),
        ...printableLinks(),
        ...audienceLinks(),
        {
          href: ROUTES.ecoleHub,
          label: "Mots mêlés École",
          description: "Grilles par niveau pour la classe",
        },
      ]
    default:
      return [...toolLinks(), ...printableLinks()]
  }
}

/** Contextual cross-links for category pages without a dedicated editorial block. */
export function getCategoryExploreLinks(category: CategoryPageData): CategoryExploreLink[] {
  if (hasDedicatedEditorialLinks(category.slug)) return []

  const seen = new Set<string>()
  const links: CategoryExploreLink[] = []

  for (const link of linksForType(category.type, category)) {
    if (link.href === category.canonicalPath) continue
    if (seen.has(link.href)) continue
    seen.add(link.href)
    links.push(link)
  }

  return links
}

/** Flat href list for audits and link-graph seeding. */
export function listCategoryExploreHrefs(category: CategoryPageData): string[] {
  return getCategoryExploreLinks(category).map((link) => link.href)
}

function stubCategoryFromSeed(def: CategorySeedDefinition): CategoryPageData {
  const theme = def.themeSlug
    ? themeSeed.find((entry) => entry.slug === def.themeSlug)
    : undefined

  return {
    id: def.slug,
    type: def.type,
    slug: def.slug,
    h1: def.h1,
    introText: def.introText,
    faqJson: [],
    seoTitle: def.seoTitle,
    metaDescription: def.metaDescription,
    canonicalPath: categoryPathFromDefinition(def),
    isIndexable: true,
    puzzleCount: 4,
    minPuzzleThreshold: 4,
    breadcrumbs: [],
    subCategories: [],
    puzzles: { items: [], page: 1, pageSize: 12, total: 0, totalPages: 0 },
    relatedCategories: [],
    theme: theme ? { slug: theme.slug, name: theme.name } : undefined,
    grade: def.gradeSlug ? { slug: def.gradeSlug, name: def.gradeSlug } : undefined,
    difficulty: def.difficultySlug
      ? { slug: def.difficultySlug, name: def.difficultySlug }
      : undefined,
    pressBrand: def.pressBrandSlug
      ? { slug: def.pressBrandSlug, name: def.pressBrandSlug }
      : undefined,
    schema: {
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: def.h1,
        numberOfItems: 0,
        itemListElement: [],
      },
    },
  } satisfies CategoryPageData
}

/** Sync explore hrefs for link-graph validation from seed definitions. */
export function listCategoryExploreHrefsForSlug(slug: string): string[] {
  const def = CATEGORY_SEED_DEFINITIONS.find((entry) => entry.slug === slug)
  if (!def) return []
  return listCategoryExploreHrefs(stubCategoryFromSeed(def))
}
