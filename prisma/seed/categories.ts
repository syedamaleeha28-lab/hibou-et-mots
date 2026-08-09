import type { PrismaClient } from "@prisma/client"
import type { CategoryType, FaqItem } from "@/lib/db/types/page-data"
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

function seasonalPageH1(slug: string, name: string): string {
  if (slug === "noel") return "Mots Mêlés de Noël"
  if (slug === "halloween") return "Mots Mêlés d'Halloween"
  if (slug === "printemps") return "Mots Mêlés de Printemps"
  return `Mots mêlés ${name}`
}

function seasonalPageTitle(slug: string, name: string): string {
  if (slug === "noel") return "Mots Mêlés de Noël Gratuits à Imprimer | Hibou & Mots"
  if (slug === "halloween") return "Mots Mêlés d'Halloween Gratuits à Imprimer | Hibou & Mots"
  if (slug === "printemps") return "Mots Mêlés de Printemps Gratuits à Imprimer | Hibou & Mots"
  return `Mots mêlés ${name} — Grilles gratuites`
}

function themePageH1(slug: string, name: string): string {
  if (slug === "animaux") return "Mots Mêlés Animaux"
  return `Mots mêlés ${name}`
}

function themePageTitle(slug: string, name: string): string {
  if (slug === "animaux") return "Mots Mêlés Animaux Gratuits à Imprimer | Hibou & Mots"
  return `Mots mêlés ${name} — Grilles gratuites à imprimer`
}

export type CategorySeedDefinition = {
  /** Added for PT-BR pack. All existing (French) definitions are tagged "fr" below. */
  locale: string
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
  /**
   * Added for PT-BR pack. French definitions leave this undefined and fall
   * back to the required getCategoryFaq(slug) lookup (unchanged behavior).
   * Non-French definitions MUST set this explicitly — getCategoryFaq only
   * knows French slugs.
   */
  faqJson?: FaqItem[]
  isHub?: boolean
  isStaticSupport?: boolean
}

const HUB_DEFINITIONS: Omit<CategorySeedDefinition, "locale">[] = [
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
    h1: "Mots Mêlés Thématiques",
    seoTitle: "Mots Mêlés Thématiques - Animaux, Sport, Vocabulaire | Hibou & Mots",
    metaDescription:
      "Explorez nos mots mêlés par thème : animaux, sport, vocabulaire, famille et bien d'autres sujets.",
    introText:
      "Choisis un thème et découvre des grilles de mots mêlés — jeux de mots cachés adaptés aux enfants et aux adultes.",
    isHub: true,
  },
  {
    slug: HUB_CATEGORY_SLUGS.difficulte,
    type: "DIFFICULTY",
    h1: "Mots Mêlés Faciles ou Difficiles : Choisissez Votre Niveau",
    seoTitle: "Mots Mêlés Faciles et Difficiles - Tous Niveaux | Hibou & Mots",
    metaDescription:
      "Des mots mêlés classés par difficulté : facile, moyen, difficile et géant. Grilles gratuites à imprimer.",
    introText:
      "Trouve la grille qui correspond à ton niveau, du débutant au champion des mots mêlés.",
    isHub: true,
  },
  {
    slug: HUB_CATEGORY_SLUGS.presse,
    type: "PRESS_BRAND",
    h1: "Une Alternative Gratuite aux Mots Mêlés de Presse",
    seoTitle: "Mots Mêlés Gratuits - Alternative aux Grilles de Presse | Hibou & Mots",
    metaDescription:
      "Des mots mêlés inspirés des grilles de journaux et magazines français, gratuits à jouer en ligne.",
    introText:
      "Retrouve le plaisir des mots mêlés de presse avec des grilles adaptées au format web et PDF.",
    isHub: true,
  },
]

const GRADE_DEFINITIONS: Omit<CategorySeedDefinition, "locale">[] = gradeSeed.map((grade) => ({
  slug: grade.slug,
  type: "GRADE",
  parentSlug: HUB_CATEGORY_SLUGS.ecole,
  gradeSlug: grade.slug,
  h1: "h1" in grade && grade.h1 ? grade.h1 : `Mots mêlés ${grade.name}`,
  seoTitle: grade.seoTitle,
  metaDescription: grade.metaDescription,
  introText: grade.introText,
}))

const THEME_DEFINITIONS: Omit<CategorySeedDefinition, "locale">[] = themeSeed
  .filter((theme) => !theme.isSeasonal)
  .map((theme) => ({
    slug: theme.slug,
    type: "THEME" as const,
    parentSlug: HUB_CATEGORY_SLUGS.thematiques,
    themeSlug: theme.slug,
    h1: themePageH1(theme.slug, theme.name),
    seoTitle: themePageTitle(theme.slug, theme.name),
    metaDescription:
      getThemeMetaDescription(theme.slug) ??
      `Des mots mêlés gratuits sur le thème ${theme.name}, à imprimer et à jouer en ligne.`,
    introText: getPhase1Intro(theme.slug) ?? themeCategoryIntro(theme.name),
  }))

const SEASONAL_DEFINITIONS: Omit<CategorySeedDefinition, "locale">[] = themeSeed
  .filter((theme) => theme.isSeasonal)
  .map((theme) => ({
    slug: theme.slug,
    type: "SEASONAL" as const,
    parentSlug: HUB_CATEGORY_SLUGS.fetes,
    themeSlug: theme.slug,
    h1: seasonalPageH1(theme.slug, theme.name),
    seoTitle: seasonalPageTitle(theme.slug, theme.name),
    metaDescription:
      getThemeMetaDescription(theme.slug) ??
      `Des mots mêlés ${theme.name} gratuits à imprimer et à jouer en ligne.`,
    introText: getPhase1Intro(theme.slug) ?? seasonalCategoryIntro(theme.name),
    isHub: false,
  }))

const DIFFICULTY_DEFINITIONS: Omit<CategorySeedDefinition, "locale">[] = difficultySeed.map((level) => ({
  slug: level.slug,
  type: "DIFFICULTY",
  parentSlug: HUB_CATEGORY_SLUGS.difficulte,
  difficultySlug: level.slug,
  h1: `Mots mêlés ${level.name}`,
  seoTitle: `Mots mêlés ${level.name} — Grilles gratuites`,
  metaDescription: `Des mots mêlés de difficulté ${level.name.toLowerCase()} à imprimer gratuitement.`,
  introText: `Sélection de grilles ${level.name.toLowerCase()} pour progresser à votre rythme.`,
}))

const AUDIENCE_DEFINITIONS: Omit<CategorySeedDefinition, "locale">[] = [
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
    h1: "Mots Mêlés pour Adultes",
    seoTitle: "Mots Mêlés pour Adultes - Grilles Gratuites | Hibou & Mots",
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

const STATIC_SUPPORT_DEFINITIONS: Omit<CategorySeedDefinition, "locale">[] = [
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
    h1: "Solutions et Règles des Mots Mêlés",
    seoTitle: "Solutions et Règles des Mots Mêlés | Hibou & Mots",
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

const COMBO_DEFINITIONS: Omit<CategorySeedDefinition, "locale">[] = MVP_P1_COMBOS.map(({ grade, theme }) => {
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

const PRESS_DEFINITIONS: Omit<CategorySeedDefinition, "locale">[] = MVP_PRESS_BRANDS.map((brand) => ({
  slug: brand.slug,
  type: "PRESS_BRAND",
  parentSlug: HUB_CATEGORY_SLUGS.presse,
  pressBrandSlug: brand.slug,
  h1: `Mots mêlés ${brand.name}`,
  seoTitle: `Mots mêlés ${brand.name} — Grilles gratuites`,
  metaDescription: `Des mots mêlés inspirés de ${brand.name}, gratuits à jouer en ligne.`,
  introText: `Retrouvez le style des grilles de ${brand.name} en version web et PDF.`,
}))

/** French category definitions — unchanged content, now explicitly tagged locale: "fr". */
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
].map((def) => ({ ...def, locale: "fr" }))

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

/**
 * Generic, locale-driven category seeding.
 *
 * PT-BR pack changes from the original:
 * - Accepts `definitions` explicitly instead of always using the French
 *   constant — call with [...CATEGORY_SEED_DEFINITIONS, ...PT_CATEGORY_SEED_DEFINITIONS]
 *   to seed both locales in one pass.
 * - Every DB lookup/upsert now scopes by (locale, slug) via `findFirst` +
 *   branch, since `slug` alone is no longer unique post-migration.
 * - Returns a Map keyed by "locale:slug" (not just slug), since the same
 *   slug string (e.g. "hub-imprimer") now legitimately exists once per
 *   locale.
 */
export async function seedCategories(
  prisma: PrismaClient,
  definitions: CategorySeedDefinition[],
): Promise<Map<string, string>> {
  const grades = await prisma.grade.findMany()
  const themes = await prisma.theme.findMany()
  const difficulties = await prisma.difficulty.findMany()
  const pressBrands = await prisma.pressBrand.findMany()

  const gradeIdByLocaleSlug = new Map(grades.map((g) => [`${g.locale}:${g.slug}`, g.id]))
  const themeIdByLocaleSlug = new Map(themes.map((t) => [`${t.locale}:${t.slug}`, t.id]))
  const difficultyIdByLocaleSlug = new Map(difficulties.map((d) => [`${d.locale}:${d.slug}`, d.id]))
  const pressBrandIdBySlug = new Map(pressBrands.map((b) => [b.slug, b.id]))

  const categoryIdByLocaleSlug = new Map<string, string>()

  for (const def of definitions) {
    // French definitions rely on the existing required-FAQ lookup; other
    // locales must supply faqJson directly (getCategoryFaq only knows
    // French slugs).
    const faqJson =
      def.faqJson ??
      (def.locale === "fr" ? getCategoryFaq(def.slug) : undefined)
    if (!faqJson) {
      throw new Error(`Missing category FAQ for locale "${def.locale}", slug: ${def.slug}`)
    }

    // Safe for non-French locales too: getPhase1Intro only recognizes
    // French slugs, so it returns undefined for e.g. "animais"/"facil"
    // and falls through to def.introText.
    const introText = getPhase1Intro(def.slug) ?? def.introText

    const gradeId = def.gradeSlug ? gradeIdByLocaleSlug.get(`${def.locale}:${def.gradeSlug}`) : null
    const themeId = def.themeSlug ? themeIdByLocaleSlug.get(`${def.locale}:${def.themeSlug}`) : null
    const difficultyId = def.difficultySlug
      ? difficultyIdByLocaleSlug.get(`${def.locale}:${def.difficultySlug}`)
      : null
    const pressBrandId = def.pressBrandSlug ? pressBrandIdBySlug.get(def.pressBrandSlug) : null

    const existing = await prisma.category.findFirst({
      where: { locale: def.locale, slug: def.slug },
    })

    const data = {
      locale: def.locale,
      type: def.type,
      slug: def.slug,
      h1: def.h1,
      seoTitle: def.seoTitle,
      metaDescription: def.metaDescription,
      introText,
      faqJson,
      status: "PUBLISHED" as const,
      gradeId: gradeId ?? null,
      themeId: themeId ?? null,
      difficultyId: difficultyId ?? null,
      pressBrandId: pressBrandId ?? null,
    }

    const record = existing
      ? await prisma.category.update({ where: { id: existing.id }, data })
      : await prisma.category.create({ data: { ...data, minPuzzleThreshold: 4 } })

    categoryIdByLocaleSlug.set(`${def.locale}:${def.slug}`, record.id)
  }

  for (const def of definitions) {
    if (!def.parentSlug) continue
    const parentId = categoryIdByLocaleSlug.get(`${def.locale}:${def.parentSlug}`)
    const childId = categoryIdByLocaleSlug.get(`${def.locale}:${def.slug}`)
    if (!parentId || !childId) continue

    await prisma.category.update({
      where: { id: childId },
      data: { parentCategoryId: parentId },
    })
  }

  return categoryIdByLocaleSlug
}

export async function clearContentSeed(prisma: PrismaClient) {
  await prisma.categoryPuzzle.deleteMany()
  await prisma.puzzle.deleteMany()
  await prisma.category.deleteMany()
  await prisma.pressBrand.deleteMany()
}
