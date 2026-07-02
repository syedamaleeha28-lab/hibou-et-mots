import type { PrismaClient } from "@prisma/client"
import type { CategoryType } from "@/lib/db/types/page-data"
import {
  HUB_CATEGORY_SLUGS,
  MVP_P1_COMBOS,
  MVP_PRESS_BRANDS,
} from "@/lib/db/adapters/category-constants"
import { difficultySeed } from "./difficulties"
import { getCategoryFaq, getPhase1Intro, seasonalCategoryIntro, themeCategoryIntro } from "@/lib/content/phase1"
import { ADULTES_INTRO, ADULTES_META_DESCRIPTION } from "@/lib/content/adultes"
import { PEDAGOGIE_INTRO, PEDAGOGIE_META_DESCRIPTION } from "@/lib/content/pedagogie"
import { RESSOURCES_ENSEIGNANTS_INTRO } from "@/lib/content/educational-entities"
import { SENIORS_INTRO, SENIORS_META_DESCRIPTION } from "@/lib/content/seniors"
import { getThemeMetaDescription } from "@/lib/content/themes"
import { gradeSeed } from "./grades"
import { themeSeed } from "./themes"

export type CategorySeedDefinition = {
  slug: string
  type: CategoryType
  parentSlug?: string
  gradeSlug?: string
  themeSlug?: string
  difficultySlug?: string
  pressBrandSlug?: string
  h1: string
  seoTitle: string
  metaDescription: string
  introText: string
  isHub?: boolean
  isStaticSupport?: boolean
}

const HUB_DEFINITIONS: CategorySeedDefinition[] = [
  {
    slug: HUB_CATEGORY_SLUGS.gratuits,
    type: "AUDIENCE",
    h1: "Mots Mêlés Gratuits : Jouez en Ligne ou Imprimez",
    seoTitle: "Mots Mêlés Gratuits en Ligne et à Imprimer | Hibou & Mots",
    metaDescription:
      "Des centaines de grilles de mots mêlés 100% gratuites, sans inscription. Jouez en ligne ou imprimez en PDF - pour enfants, adultes et la classe.",
    introText:
      "Parcourez notre bibliothèque de mots mêlés 100 % gratuits : par thème, par niveau scolaire ou par difficulté.",
    isHub: true,
  },
  {
    slug: HUB_CATEGORY_SLUGS.imprimer,
    type: "AUDIENCE",
    h1: "Mots Mêlés à Imprimer en PDF",
    seoTitle: "Mots Mêlés à Imprimer Gratuitement (PDF) | Hibou & Mots",
    metaDescription:
      "Téléchargez et imprimez gratuitement nos grilles de mots mêlés en PDF, format A4, avec ou sans solution. Idéal pour la classe ou la maison.",
    introText:
      "Des grilles prêtes à imprimer pour la maison ou la classe, classées par thème et par niveau scolaire.",
    isHub: true,
  },
  {
    slug: HUB_CATEGORY_SLUGS.ecole,
    type: "GRADE",
    h1: "Mots mêlés École — Grilles par niveau scolaire",
    seoTitle: "Mots mêlés École — CP, CE1, CM2 gratuits à imprimer",
    metaDescription:
      "Des mots mêlés gratuits pour chaque niveau scolaire : maternelle, CP, CE1, CE2, CM1, CM2 et 6e.",
    introText:
      "Retrouve des mots mêlés adaptés à chaque classe, du CP au CM2. Des grilles calibrées pour le vocabulaire scolaire.",
    isHub: true,
  },
  {
    slug: HUB_CATEGORY_SLUGS.fetes,
    type: "SEASONAL",
    h1: "Mots mêlés Fêtes & Saisons",
    seoTitle: "Mots mêlés Fêtes & Saisons — Noël, Halloween, Pâques",
    metaDescription:
      "Des mots mêlés thématiques pour les fêtes et les saisons : Noël, Halloween, Pâques, Carnaval et plus.",
    introText:
      "Célébrez les fêtes et les saisons avec des grilles de mots mêlés gratuites à imprimer ou à jouer en ligne.",
    isHub: true,
  },
  {
    slug: HUB_CATEGORY_SLUGS.thematiques,
    type: "THEME",
    h1: "Mots mêlés Thématiques",
    seoTitle: "Mots mêlés Thématiques — Animaux, Sport, Vocabulaire",
    metaDescription:
      "Explorez nos mots mêlés par thème : animaux, sport, vocabulaire, famille et bien d'autres sujets.",
    introText:
      "Choisis un thème et découvre des grilles de mots mêlés — jeux de mots cachés adaptés aux enfants et aux adultes.",
    isHub: true,
  },
  {
    slug: HUB_CATEGORY_SLUGS.difficulte,
    type: "DIFFICULTY",
    h1: "Mots mêlés par difficulté",
    seoTitle: "Mots mêlés Facile, Moyen, Difficile — Grilles gratuites",
    metaDescription:
      "Des mots mêlés classés par difficulté : facile, moyen, difficile et géant. Grilles gratuites à imprimer.",
    introText:
      "Trouve la grille qui correspond à ton niveau, du débutant au champion des mots mêlés.",
    isHub: true,
  },
  {
    slug: HUB_CATEGORY_SLUGS.presse,
    type: "PRESS_BRAND",
    h1: "Mots mêlés Journaux & Magazines",
    seoTitle: "Mots mêlés Journaux & Magazines — Grilles gratuites",
    metaDescription:
      "Des mots mêlés inspirés des grilles de journaux et magazines français, gratuits à jouer en ligne.",
    introText:
      "Retrouve le plaisir des mots mêlés de presse avec des grilles adaptées au format web et PDF.",
    isHub: true,
  },
]

const GRADE_DEFINITIONS: CategorySeedDefinition[] = gradeSeed.map((grade) => ({
  slug: grade.slug,
  type: "GRADE",
  parentSlug: HUB_CATEGORY_SLUGS.ecole,
  gradeSlug: grade.slug,
  h1: `Mots mêlés ${grade.name}`,
  seoTitle: grade.seoTitle,
  metaDescription: grade.metaDescription,
  introText: grade.introText,
}))

const THEME_DEFINITIONS: CategorySeedDefinition[] = themeSeed
  .filter((theme) => !theme.isSeasonal)
  .map((theme) => ({
    slug: theme.slug,
    type: "THEME" as const,
    parentSlug: HUB_CATEGORY_SLUGS.thematiques,
    themeSlug: theme.slug,
    h1: `Mots mêlés ${theme.name}`,
    seoTitle: `Mots mêlés ${theme.name} — Grilles gratuites à imprimer`,
    metaDescription:
      getThemeMetaDescription(theme.slug) ??
      `Des mots mêlés gratuits sur le thème ${theme.name}, à imprimer et à jouer en ligne.`,
    introText: getPhase1Intro(theme.slug) ?? themeCategoryIntro(theme.name),
  }))

const SEASONAL_DEFINITIONS: CategorySeedDefinition[] = themeSeed
  .filter((theme) => theme.isSeasonal)
  .map((theme) => ({
    slug: theme.slug,
    type: "SEASONAL" as const,
    parentSlug: HUB_CATEGORY_SLUGS.fetes,
    themeSlug: theme.slug,
    h1: `Mots mêlés ${theme.name}`,
    seoTitle: `Mots mêlés ${theme.name} — Grilles gratuites`,
    metaDescription:
      getThemeMetaDescription(theme.slug) ??
      `Des mots mêlés ${theme.name} gratuits à imprimer et à jouer en ligne.`,
    introText: getPhase1Intro(theme.slug) ?? seasonalCategoryIntro(theme.name),
    isHub: false,
  }))

const DIFFICULTY_DEFINITIONS: CategorySeedDefinition[] = difficultySeed.map((level) => ({
  slug: level.slug,
  type: "DIFFICULTY",
  parentSlug: HUB_CATEGORY_SLUGS.difficulte,
  difficultySlug: level.slug,
  h1: `Mots mêlés ${level.name}`,
  seoTitle: `Mots mêlés ${level.name} — Grilles gratuites`,
  metaDescription: `Des mots mêlés de difficulté ${level.name.toLowerCase()} à imprimer gratuitement.`,
  introText: `Sélection de grilles ${level.name.toLowerCase()} pour progresser à votre rythme.`,
}))

const AUDIENCE_DEFINITIONS: CategorySeedDefinition[] = [
  {
    slug: "enfants",
    type: "AUDIENCE",
    h1: "Mots Mêlés pour Enfants",
    seoTitle: "Mots Mêlés pour Enfants - Grilles Gratuites à Imprimer",
    metaDescription:
      "Grilles de mots mêlés adaptées aux enfants : vocabulaire simple, grandes lettres, thèmes ludiques. À imprimer ou jouer en ligne, 100% gratuit.",
    introText:
      "Des grilles amusantes et éducatives pour les enfants, du CP au CM2, à imprimer ou à jouer en ligne.",
  },
  {
    slug: "adultes",
    type: "AUDIENCE",
    h1: "Mots mêlés Adultes",
    seoTitle: "Mots mêlés Adultes — Grilles gratuites",
    metaDescription: ADULTES_META_DESCRIPTION,
    introText: ADULTES_INTRO,
  },
  {
    slug: "seniors",
    type: "AUDIENCE",
    h1: "Mots mêlés Seniors — Grand format",
    seoTitle: "Mots mêlés Seniors — Grilles grand format",
    metaDescription: SENIORS_META_DESCRIPTION,
    introText: SENIORS_INTRO,
  },
]

const STATIC_SUPPORT_DEFINITIONS: CategorySeedDefinition[] = [
  {
    slug: "pedagogie",
    type: "AUDIENCE",
    h1: "Pédagogie des mots mêlés",
    seoTitle: "Pédagogie des mots mêlés — Guide pour enseignants et parents",
    metaDescription: PEDAGOGIE_META_DESCRIPTION,
    introText: PEDAGOGIE_INTRO,
    isStaticSupport: true,
  },
  {
    slug: "personnages",
    type: "AUDIENCE",
    h1: "Personnages de mots mêlés",
    seoTitle: "Personnages — Hibou&Mots",
    metaDescription:
      "Découvrez Hibou, la mascotte de Hibou&Mots, et l'univers des personnages du site.",
    introText:
      "Plongez dans l'univers de Hibou&Mots et découvrez les personnages qui accompagnent les enfants.",
    isStaticSupport: true,
  },
  {
    slug: "application",
    type: "AUDIENCE",
    h1: "Application mots mêlés",
    seoTitle: "Application mots mêlés — Hibou&Mots",
    metaDescription: "Jouez aux mots mêlés sur mobile avec l'application Hibou&Mots.",
    introText: "Emportez vos grilles préférées partout avec l'application Hibou&Mots, bientôt disponible.",
    isStaticSupport: true,
  },
  {
    slug: "solutions",
    type: "AUDIENCE",
    h1: "Solutions et règles des mots mêlés",
    seoTitle: "Solutions et règles des mots mêlés",
    metaDescription:
      "Apprenez les règles des mots mêlés et consultez nos conseils pour trouver toutes les solutions.",
    introText:
      "Tout savoir sur les règles des mots mêlés et les astuces pour résoudre une grille plus rapidement.",
    isStaticSupport: true,
  },
  {
    slug: "jeux-magazines",
    type: "AUDIENCE",
    h1: "Jeux et magazines de mots mêlés",
    seoTitle: "Jeux et magazines de mots mêlés",
    metaDescription: "Découvrez les jeux et magazines de mots mêlés populaires en France.",
    introText:
      "Une sélection de jeux et magazines de mots mêlés pour compléter votre pratique en ligne.",
    isStaticSupport: true,
  },
  {
    slug: "ressources-enseignants",
    type: "AUDIENCE",
    h1: "Ressources enseignants — Mots mêlés",
    seoTitle: "Ressources enseignants mots mêlés",
    metaDescription:
      "Ressources gratuites pour les enseignants : grilles, fiches et idées d'activités autour des mots mêlés et du vocabulaire scolaire.",
    introText: RESSOURCES_ENSEIGNANTS_INTRO,
    isStaticSupport: true,
  },
]

const COMBO_DEFINITIONS: CategorySeedDefinition[] = MVP_P1_COMBOS.map(({ grade, theme }) => {
  const gradeDef = gradeSeed.find((entry) => entry.slug === grade)!
  const themeDef = themeSeed.find((entry) => entry.slug === theme)!
  return {
    slug: `${grade}-${theme}`,
    type: "COMBO",
    parentSlug: HUB_CATEGORY_SLUGS.ecole,
    gradeSlug: grade,
    themeSlug: theme,
    h1: `Mots mêlés ${gradeDef.name} — ${themeDef.name}`,
    seoTitle: `Mots mêlés ${gradeDef.name} ${themeDef.name} — Grilles gratuites`,
    metaDescription: `Mots mêlés ${gradeDef.name} sur le thème ${themeDef.name}, gratuits à imprimer et à jouer en ligne.`,
    introText: `Grilles croisant le niveau ${gradeDef.name} et le thème ${themeDef.name}, idéales pour une activité ciblée.`,
  }
})

const PRESS_DEFINITIONS: CategorySeedDefinition[] = MVP_PRESS_BRANDS.map((brand) => ({
  slug: brand.slug,
  type: "PRESS_BRAND",
  parentSlug: HUB_CATEGORY_SLUGS.presse,
  pressBrandSlug: brand.slug,
  h1: `Mots mêlés ${brand.name}`,
  seoTitle: `Mots mêlés ${brand.name} — Grilles gratuites`,
  metaDescription: `Des mots mêlés inspirés de ${brand.name}, gratuits à jouer en ligne.`,
  introText: `Retrouvez le style des grilles de ${brand.name} en version web et PDF.`,
}))

export const CATEGORY_SEED_DEFINITIONS: CategorySeedDefinition[] = [
  ...HUB_DEFINITIONS,
  ...GRADE_DEFINITIONS,
  ...THEME_DEFINITIONS,
  ...SEASONAL_DEFINITIONS,
  ...DIFFICULTY_DEFINITIONS,
  ...AUDIENCE_DEFINITIONS,
  ...STATIC_SUPPORT_DEFINITIONS,
  ...COMBO_DEFINITIONS,
  ...PRESS_DEFINITIONS,
]

export async function seedPressBrands(prisma: PrismaClient) {
  for (const brand of MVP_PRESS_BRANDS) {
    await prisma.pressBrand.upsert({
      where: { slug: brand.slug },
      create: {
        slug: brand.slug,
        name: brand.name,
        description: `Grilles de mots mêlés inspirées de ${brand.name}.`,
        seoTitle: `Mots mêlés ${brand.name}`,
        metaDescription: `Des mots mêlés gratuits inspirés de ${brand.name}.`,
      },
      update: {
        name: brand.name,
      },
    })
  }
}

export async function seedCategories(prisma: PrismaClient): Promise<Map<string, string>> {
  const gradeIdBySlug = new Map(
    (await prisma.grade.findMany()).map((grade) => [grade.slug, grade.id]),
  )
  const themeIdBySlug = new Map(
    (await prisma.theme.findMany()).map((theme) => [theme.slug, theme.id]),
  )
  const difficultyIdBySlug = new Map(
    (await prisma.difficulty.findMany()).map((difficulty) => [difficulty.slug, difficulty.id]),
  )
  const pressBrandIdBySlug = new Map(
    (await prisma.pressBrand.findMany()).map((brand) => [brand.slug, brand.id]),
  )

  const categoryIdBySlug = new Map<string, string>()

  for (const def of CATEGORY_SEED_DEFINITIONS) {
    const faqJson = getCategoryFaq(def.slug)
    if (!faqJson) {
      throw new Error(`Missing category FAQ for slug: ${def.slug}`)
    }
    const introText = getPhase1Intro(def.slug) ?? def.introText

    const record = await prisma.category.upsert({
      where: { slug: def.slug },
      create: {
        type: def.type,
        slug: def.slug,
        h1: def.h1,
        seoTitle: def.seoTitle,
        metaDescription: def.metaDescription,
        introText,
        faqJson,
        status: "PUBLISHED",
        minPuzzleThreshold: 4,
        gradeId: def.gradeSlug ? gradeIdBySlug.get(def.gradeSlug) : null,
        themeId: def.themeSlug ? themeIdBySlug.get(def.themeSlug) : null,
        difficultyId: def.difficultySlug ? difficultyIdBySlug.get(def.difficultySlug) : null,
        pressBrandId: def.pressBrandSlug ? pressBrandIdBySlug.get(def.pressBrandSlug) : null,
      },
      update: {
        type: def.type,
        h1: def.h1,
        seoTitle: def.seoTitle,
        metaDescription: def.metaDescription,
        introText,
        faqJson,
        status: "PUBLISHED",
        gradeId: def.gradeSlug ? gradeIdBySlug.get(def.gradeSlug) : null,
        themeId: def.themeSlug ? themeIdBySlug.get(def.themeSlug) : null,
        difficultyId: def.difficultySlug ? difficultyIdBySlug.get(def.difficultySlug) : null,
        pressBrandId: def.pressBrandSlug ? pressBrandIdBySlug.get(def.pressBrandSlug) : null,
      },
    })

    categoryIdBySlug.set(def.slug, record.id)
  }

  for (const def of CATEGORY_SEED_DEFINITIONS) {
    if (!def.parentSlug) continue
    const parentId = categoryIdBySlug.get(def.parentSlug)
    const childId = categoryIdBySlug.get(def.slug)
    if (!parentId || !childId) continue

    await prisma.category.update({
      where: { id: childId },
      data: { parentCategoryId: parentId },
    })
  }

  return categoryIdBySlug
}

export async function clearContentSeed(prisma: PrismaClient) {
  await prisma.categoryPuzzle.deleteMany()
  await prisma.puzzle.deleteMany()
  await prisma.category.deleteMany()
  await prisma.pressBrand.deleteMany()
}
