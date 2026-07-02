import type { CategoryPageData, RelatedCategoryLink, SubCategoryLink } from "@/lib/db/types/page-data"
import { difficultySeed } from "@/prisma/seed/difficulties"
import { gradeSeed } from "@/prisma/seed/grades"
import { themeSeed } from "@/prisma/seed/themes"
import { mapCategoryToPageData } from "@/lib/db/queries/mappers"
import {
  comboPath,
  difficultyPath,
  gradePath,
  pressBrandPath,
  ROUTES,
  seasonalPath,
  themePath,
} from "@/lib/seo/routes"
import { buildItemListSchema } from "@/lib/seo/schema"
import { buildComboParentLinks } from "@/lib/seo/linking"
import {
  HUB_CATEGORY_SLUGS,
  MVP_PRESS_BRANDS,
  MVP_SEASONAL_THEME_SLUGS,
} from "@/lib/db/adapters/category-constants"
import {
  mockCategoryRecord,
  mockDifficultyRecord,
  mockGradeRecord,
  mockThemeRecord,
  staticMockPuzzleCards,
} from "@/lib/db/adapters/mock-utils"
import { getPhase1Intro, seasonalCategoryIntro, themeCategoryIntro } from "@/lib/content/phase1"
import { getCategoryFaq } from "@/lib/content/category-faqs"
import { ADULTES_INTRO, ADULTES_META_DESCRIPTION } from "@/lib/content/adultes"
import { RESSOURCES_ENSEIGNANTS_INTRO } from "@/lib/content/educational-entities"
import { PEDAGOGIE_INTRO, PEDAGOGIE_META_DESCRIPTION } from "@/lib/content/pedagogie"
import { SENIORS_INTRO, SENIORS_META_DESCRIPTION } from "@/lib/content/seniors"
import { getThemeMetaDescription } from "@/lib/content/themes"

function phase1Intro(slug: string, fallback: string): string {
  return getPhase1Intro(slug) ?? fallback
}

function phase1Faq(slug: string) {
  return getCategoryFaq(slug) ?? undefined
}

const gradeSubCategories: SubCategoryLink[] = gradeSeed.map((grade) => ({
  id: `mock-grade-${grade.slug}`,
  label: grade.name,
  href: gradePath(grade.slug),
  description: grade.introText.slice(0, 120),
  puzzleCount: 12,
  badge: grade.slug.toUpperCase(),
}))

const nonSeasonalThemes = themeSeed.filter((theme) => !theme.isSeasonal)
const seasonalThemes = themeSeed.filter((theme) => theme.isSeasonal)

const themeSubCategories: SubCategoryLink[] = nonSeasonalThemes.map((theme) => ({
  id: `mock-theme-${theme.slug}`,
  label: theme.name,
  href: themePath(theme.slug),
  description: `Mots mêlés sur le thème ${theme.name}.`,
  puzzleCount: 8,
}))

const seasonalSubCategories: SubCategoryLink[] = seasonalThemes.map((theme) => ({
  id: `mock-seasonal-${theme.slug}`,
  label: theme.name,
  href: seasonalPath(theme.slug),
  description: `Mots mêlés ${theme.name} à imprimer et jouer en ligne.`,
  puzzleCount: 8,
}))

const difficultySubCategories: SubCategoryLink[] = difficultySeed.map((level) => ({
  id: `mock-difficulty-${level.slug}`,
  label: level.name,
  href: difficultyPath(level.slug),
  description: `Grilles de difficulté ${level.name.toLowerCase()}.`,
  puzzleCount: 10,
}))

const pressSubCategories: SubCategoryLink[] = MVP_PRESS_BRANDS.map((brand) => ({
  id: `mock-press-${brand.slug}`,
  label: brand.name,
  href: pressBrandPath(brand.slug),
  description: `Mots mêlés inspirés de ${brand.name}.`,
  puzzleCount: 4,
}))

function hubRelatedLinks(): RelatedCategoryLink[] {
  return [
    {
      id: "mock-hub-gratuits",
      label: "Mots mêlés gratuits",
      href: ROUTES.gratuits,
      description: "Toutes les grilles gratuites du site.",
      puzzleCount: 120,
    },
    {
      id: "mock-hub-imprimer",
      label: "Mots mêlés à imprimer",
      href: ROUTES.imprimer,
      description: "PDF prêts à imprimer.",
      puzzleCount: 80,
    },
    {
      id: "mock-hub-ecole",
      label: "Mots mêlés École",
      href: ROUTES.ecoleHub,
      description: "Grilles par niveau scolaire.",
      puzzleCount: 60,
    },
  ]
}

const HUB_DEFINITIONS = {
  [HUB_CATEGORY_SLUGS.gratuits]: {
    type: "AUDIENCE" as const,
    h1: "Mots Mêlés Gratuits : Jouez en Ligne ou Imprimez",
    seoTitle: "Mots Mêlés Gratuits en Ligne et à Imprimer | Hibou & Mots",
    metaDescription:
      "Des centaines de grilles de mots mêlés 100% gratuites, sans inscription. Jouez en ligne ou imprimez en PDF - pour enfants, adultes et la classe.",
    introText: phase1Intro(
      HUB_CATEGORY_SLUGS.gratuits,
      "Parcourez notre bibliothèque de mots mêlés 100 % gratuits : par thème, par niveau scolaire ou par difficulté.",
    ),
    subCategories: [...themeSubCategories.slice(0, 6), ...gradeSubCategories.slice(0, 4)],
  },
  [HUB_CATEGORY_SLUGS.imprimer]: {
    type: "AUDIENCE" as const,
    h1: "Mots mêlés à imprimer — PDF gratuits",
    seoTitle: "Mots mêlés à imprimer — Grilles PDF gratuites",
    metaDescription:
      "Téléchargez et imprimez des mots mêlés gratuits en PDF, adaptés aux enfants et aux enseignants.",
    introText: phase1Intro(
      HUB_CATEGORY_SLUGS.imprimer,
      "Des grilles prêtes à imprimer pour la maison ou la classe, classées par thème et par niveau scolaire.",
    ),
    subCategories: [...themeSubCategories.slice(0, 4), ...difficultySubCategories.slice(0, 3)],
  },
  [HUB_CATEGORY_SLUGS.ecole]: {
    type: "GRADE" as const,
    h1: "Mots mêlés École — Grilles par niveau scolaire",
    seoTitle: "Mots mêlés École — CP, CE1, CM2 gratuits à imprimer",
    metaDescription:
      "Des mots mêlés gratuits pour chaque niveau scolaire : maternelle, CP, CE1, CE2, CM1, CM2 et 6e.",
    introText: phase1Intro(
      HUB_CATEGORY_SLUGS.ecole,
      "Retrouve des mots mêlés adaptés à chaque classe, du CP au CM2. Des grilles calibrées pour le vocabulaire scolaire.",
    ),
    subCategories: gradeSubCategories,
  },
  [HUB_CATEGORY_SLUGS.fetes]: {
    type: "SEASONAL" as const,
    h1: "Mots mêlés Fêtes & Saisons",
    seoTitle: "Mots mêlés Fêtes & Saisons — Noël, Halloween, Pâques",
    metaDescription:
      "Des mots mêlés thématiques pour les fêtes et les saisons : Noël, Halloween, Pâques, Carnaval et plus.",
    introText:
      "Célébrez les fêtes et les saisons avec des grilles de mots mêlés gratuites à imprimer ou à jouer en ligne.",
    subCategories: seasonalSubCategories,
  },
  [HUB_CATEGORY_SLUGS.thematiques]: {
    type: "THEME" as const,
    h1: "Mots mêlés Thématiques",
    seoTitle: "Mots mêlés Thématiques — Animaux, Sport, Vocabulaire",
    metaDescription:
      "Explorez nos mots mêlés par thème : animaux, sport, vocabulaire, famille et bien d'autres sujets.",
    introText:
      "Choisis un thème et découvre des grilles de mots mêlés — jeux de mots cachés adaptés aux enfants et aux adultes.",
    subCategories: themeSubCategories,
  },
  [HUB_CATEGORY_SLUGS.difficulte]: {
    type: "DIFFICULTY" as const,
    h1: "Mots mêlés par difficulté",
    seoTitle: "Mots mêlés Facile, Moyen, Difficile — Grilles gratuites",
    metaDescription:
      "Des mots mêlés classés par difficulté : facile, moyen, difficile et géant. Grilles gratuites à imprimer.",
    introText:
      "Trouve la grille qui correspond à ton niveau, du débutant au champion des mots mêlés.",
    subCategories: difficultySubCategories,
  },
  [HUB_CATEGORY_SLUGS.presse]: {
    type: "PRESS_BRAND" as const,
    h1: "Mots mêlés Journaux & Magazines",
    seoTitle: "Mots mêlés Journaux & Magazines — Grilles gratuites",
    metaDescription:
      "Des mots mêlés inspirés des grilles de journaux et magazines français, gratuits à jouer en ligne.",
    introText:
      "Retrouve le plaisir des mots mêlés de presse avec des grilles adaptées au format web et PDF.",
    subCategories: pressSubCategories,
  },
} as const

const AUDIENCE_DEFINITIONS = {
  enfants: {
    h1: "Mots Mêlés pour Enfants",
    seoTitle: "Mots Mêlés pour Enfants - Grilles Gratuites à Imprimer",
    metaDescription:
      "Grilles de mots mêlés adaptées aux enfants : vocabulaire simple, grandes lettres, thèmes ludiques. À imprimer ou jouer en ligne, 100% gratuit.",
    introText: phase1Intro(
      "enfants",
      "Des grilles amusantes et éducatives pour les enfants, du CP au CM2, à imprimer ou à jouer en ligne.",
    ),
    subCategories: gradeSubCategories,
  },
  adultes: {
    h1: "Mots mêlés Adultes",
    seoTitle: "Mots mêlés Adultes — Grilles gratuites",
    metaDescription: ADULTES_META_DESCRIPTION,
    introText: ADULTES_INTRO,
    subCategories: difficultySubCategories.slice(0, 3),
  },
  seniors: {
    h1: "Mots mêlés Seniors — Grand format",
    seoTitle: "Mots mêlés Seniors — Grilles grand format",
    metaDescription: SENIORS_META_DESCRIPTION,
    introText: SENIORS_INTRO,
    subCategories: difficultySubCategories.slice(0, 2),
  },
} as const

const STATIC_SUPPORT_PAGES = {
  [ROUTES.pedagogie]: {
    slug: "pedagogie",
    h1: "Pédagogie des mots mêlés",
    seoTitle: "Pédagogie des mots mêlés — Guide pour enseignants et parents",
    metaDescription: PEDAGOGIE_META_DESCRIPTION,
    introText: PEDAGOGIE_INTRO,
  },
  [ROUTES.personnages]: {
    slug: "personnages",
    h1: "Personnages de mots mêlés",
    seoTitle: "Personnages — Hibou&Mots",
    metaDescription:
      "Découvrez Hibou, la mascotte de Hibou&Mots, et l'univers des personnages du site.",
    introText:
      "Plongez dans l'univers de Hibou&Mots et découvrez les personnages qui accompagnent les enfants.",
  },
  [ROUTES.application]: {
    slug: "application",
    h1: "Application mots mêlés",
    seoTitle: "Application mots mêlés — Hibou&Mots",
    metaDescription:
      "Jouez aux mots mêlés sur mobile avec l'application Hibou&Mots.",
    introText:
      "Emportez vos grilles préférées partout avec l'application Hibou&Mots, bientôt disponible.",
  },
  [ROUTES.solutions]: {
    slug: "solutions",
    h1: "Solutions et règles des mots mêlés",
    seoTitle: "Solutions et règles des mots mêlés",
    metaDescription:
      "Apprenez les règles des mots mêlés et consultez nos conseils pour trouver toutes les solutions.",
    introText:
      "Tout savoir sur les règles des mots mêlés et les astuces pour résoudre une grille plus rapidement.",
  },
  [ROUTES.jeuxMagazines]: {
    slug: "jeux-magazines",
    h1: "Jeux et magazines de mots mêlés",
    seoTitle: "Jeux et magazines de mots mêlés",
    metaDescription:
      "Découvrez les jeux et magazines de mots mêlés populaires en France.",
    introText:
      "Une sélection de jeux et magazines de mots mêlés pour compléter votre pratique en ligne.",
  },
  [ROUTES.ressources]: {
    slug: "ressources-enseignants",
    h1: "Ressources enseignants — Mots mêlés",
    seoTitle: "Ressources enseignants mots mêlés",
    metaDescription:
      "Ressources gratuites pour les enseignants : grilles, fiches et idées d'activités autour des mots mêlés et du vocabulaire scolaire.",
    introText: RESSOURCES_ENSEIGNANTS_INTRO,
  },
} as const

function buildHubMock(slug: keyof typeof HUB_DEFINITIONS, page = 1): CategoryPageData {
  const def = HUB_DEFINITIONS[slug]
  const category = mockCategoryRecord({
    type: def.type,
    slug,
    h1: def.h1,
    seoTitle: def.seoTitle,
    metaDescription: def.metaDescription,
    introText: def.introText,
    faqJson: phase1Faq(slug) ?? null,
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards(slug, 6), {
    page,
    subCategories: def.subCategories,
    relatedCategories: hubRelatedLinks(),
  })
}

export function mockHubCategoryPageData(
  hubSlug: keyof typeof HUB_DEFINITIONS,
  page = 1,
): CategoryPageData {
  return buildHubMock(hubSlug, page)
}

export function mockEcoleHubPageData(page = 1): CategoryPageData {
  return mockHubCategoryPageData(HUB_CATEGORY_SLUGS.ecole, page)
}

export function mockGradeCategoryPageData(gradeSlug: string, page = 1): CategoryPageData | null {
  const grade = gradeSeed.find((entry) => entry.slug === gradeSlug)
  if (!grade) return null

  const category = mockCategoryRecord({
    type: "GRADE",
    slug: grade.slug,
    h1: `Mots mêlés ${grade.name}`,
    seoTitle: grade.seoTitle,
    metaDescription: grade.metaDescription,
    introText: grade.introText,
    faqJson: getCategoryFaq(grade.slug) ?? null,
    grade: mockGradeRecord({
      slug: grade.slug,
      name: grade.name,
      order: grade.order,
      defaultGridSize: grade.defaultGridSize,
    }),
  })

  const comboLinks: SubCategoryLink[] = seasonalThemes.slice(0, 3).map((theme) => ({
    id: `mock-combo-${grade.slug}-${theme.slug}`,
    label: `${grade.name} × ${theme.name}`,
    href: comboPath(grade.slug, theme.slug),
    description: `Grilles ${grade.name} sur le thème ${theme.name}.`,
    puzzleCount: 6,
  }))

  return mapCategoryToPageData(category, staticMockPuzzleCards(grade.slug, 6), {
    page,
    subCategories: comboLinks,
    relatedCategories: gradeSubCategories.filter((entry) => entry.href !== gradePath(grade.slug)),
  })
}

export function mockThemeCategoryPageData(themeSlug: string, page = 1): CategoryPageData | null {
  const theme = nonSeasonalThemes.find((entry) => entry.slug === themeSlug)
  if (!theme) return null

  const themeRecord = mockThemeRecord(theme)
  const category = mockCategoryRecord({
    type: "THEME",
    slug: theme.slug,
    h1: `Mots mêlés ${theme.name}`,
    seoTitle: `Mots mêlés ${theme.name} — Grilles gratuites à imprimer`,
    metaDescription:
      getThemeMetaDescription(theme.slug) ??
      `Des mots mêlés gratuits sur le thème ${theme.name}, à imprimer et à jouer en ligne.`,
    introText: getPhase1Intro(theme.slug) ?? themeCategoryIntro(theme.name),
    faqJson: getCategoryFaq(theme.slug) ?? null,
    theme: themeRecord,
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards(theme.slug, 6), {
    page,
    relatedCategories: themeSubCategories
      .filter((entry) => entry.href !== themePath(theme.slug))
      .slice(0, 4),
  })
}

export function mockAnimauxCategoryPageData(page = 1): CategoryPageData | null {
  return mockThemeCategoryPageData("animaux", page)
}

export function mockSeasonalCategoryPageData(themeSlug: string, page = 1): CategoryPageData | null {
  if (!MVP_SEASONAL_THEME_SLUGS.includes(themeSlug as (typeof MVP_SEASONAL_THEME_SLUGS)[number])) {
    return null
  }

  const theme = seasonalThemes.find((entry) => entry.slug === themeSlug)
  if (!theme) return null

  const themeRecord = mockThemeRecord(theme)
  const category = mockCategoryRecord({
    type: "SEASONAL",
    slug: theme.slug,
    h1: `Mots mêlés ${theme.name}`,
    seoTitle: `Mots mêlés ${theme.name} — Grilles gratuites`,
    metaDescription:
      getThemeMetaDescription(theme.slug) ??
      `Des mots mêlés ${theme.name} gratuits à imprimer et à jouer en ligne.`,
    introText: getPhase1Intro(theme.slug) ?? seasonalCategoryIntro(theme.name),
    faqJson: getCategoryFaq(theme.slug) ?? null,
    theme: themeRecord,
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards(theme.slug, 6), {
    page,
    relatedCategories: seasonalSubCategories
      .filter((entry) => entry.href !== seasonalPath(theme.slug))
      .slice(0, 4),
  })
}

export function mockDifficultyCategoryPageData(levelSlug: string, page = 1): CategoryPageData | null {
  const level = difficultySeed.find((entry) => entry.slug === levelSlug)
  if (!level) return null

  const category = mockCategoryRecord({
    type: "DIFFICULTY",
    slug: level.slug,
    h1: `Mots mêlés ${level.name}`,
    seoTitle: `Mots mêlés ${level.name} — Grilles gratuites`,
    metaDescription: `Des mots mêlés de difficulté ${level.name.toLowerCase()} à imprimer gratuitement.`,
    introText: `Sélection de grilles ${level.name.toLowerCase()} pour progresser à votre rythme.`,
    faqJson: getCategoryFaq(level.slug) ?? null,
    difficulty: mockDifficultyRecord(level),
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards(level.slug, 6), {
    page,
    relatedCategories: difficultySubCategories.filter(
      (entry) => entry.href !== difficultyPath(level.slug),
    ),
  })
}

export function mockComboCategoryPageData(
  gradeSlug: string,
  themeSlug: string,
  page = 1,
): CategoryPageData | null {
  const grade = gradeSeed.find((entry) => entry.slug === gradeSlug)
  const theme = themeSeed.find((entry) => entry.slug === themeSlug)
  if (!grade || !theme) return null

  const gradeRecord = mockGradeRecord({
    slug: grade.slug,
    name: grade.name,
    order: grade.order,
    defaultGridSize: grade.defaultGridSize,
  })
  const themeRecord = mockThemeRecord(theme)

  const category = mockCategoryRecord({
    type: "COMBO",
    slug: `${grade.slug}-${theme.slug}`,
    h1: `Mots mêlés ${grade.name} — ${theme.name}`,
    seoTitle: `Mots mêlés ${grade.name} ${theme.name} — Grilles gratuites`,
    metaDescription: `Mots mêlés ${grade.name} sur le thème ${theme.name}, gratuits à imprimer et à jouer en ligne.`,
    introText: `Grilles croisant le niveau ${grade.name} et le thème ${theme.name}, idéales pour une activité ciblée.`,
    faqJson: getCategoryFaq(`${grade.slug}-${theme.slug}`) ?? null,
    grade: gradeRecord,
    theme: themeRecord,
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards(`${grade.slug}-${theme.slug}`, 6), {
    page,
    comboParentLinks: buildComboParentLinks({
      grade: { slug: grade.slug, name: grade.name },
      theme: { slug: theme.slug, name: theme.name, isSeasonal: theme.isSeasonal },
    }),
    relatedCategories: [
      {
        id: `mock-grade-${grade.slug}`,
        label: grade.name,
        href: gradePath(grade.slug),
        description: `Toutes les grilles ${grade.name}.`,
        puzzleCount: 12,
      },
      {
        id: `mock-theme-${theme.slug}`,
        label: theme.name,
        href: theme.isSeasonal ? seasonalPath(theme.slug) : themePath(theme.slug),
        description: `Toutes les grilles ${theme.name}.`,
        puzzleCount: 10,
      },
    ],
  })
}

export function mockAudienceCategoryPageData(
  audienceSlug: keyof typeof AUDIENCE_DEFINITIONS,
  page = 1,
): CategoryPageData | null {
  const def = AUDIENCE_DEFINITIONS[audienceSlug]
  if (!def) return null

  const category = mockCategoryRecord({
    type: "AUDIENCE",
    slug: audienceSlug,
    h1: def.h1,
    seoTitle: def.seoTitle,
    metaDescription: def.metaDescription,
    introText: def.introText,
    faqJson: phase1Faq(audienceSlug) ?? null,
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards(audienceSlug, 6), {
    page,
    subCategories: def.subCategories,
    relatedCategories: hubRelatedLinks(),
  })
}

export function mockPressBrandCategoryPageData(brandSlug: string, page = 1): CategoryPageData | null {
  const brand = MVP_PRESS_BRANDS.find((entry) => entry.slug === brandSlug)
  if (!brand) return null

  const now = new Date()
  const category = mockCategoryRecord({
    type: "PRESS_BRAND",
    slug: brand.slug,
    h1: `Mots mêlés ${brand.name}`,
    seoTitle: `Mots mêlés ${brand.name} — Grilles gratuites`,
    metaDescription: `Des mots mêlés inspirés de ${brand.name}, gratuits à jouer en ligne.`,
    introText: `Retrouvez le style des grilles de ${brand.name} en version web et PDF.`,
    faqJson: getCategoryFaq(brand.slug) ?? null,
    pressBrand: {
      id: `mock-press-${brand.slug}`,
      slug: brand.slug,
      name: brand.name,
      description: null,
      logoUrl: null,
      seoTitle: null,
      metaDescription: null,
      createdAt: now,
      updatedAt: now,
    },
  })

  return mapCategoryToPageData(category, staticMockPuzzleCards(brand.slug, 4), {
    page,
    relatedCategories: pressSubCategories.filter((entry) => entry.href !== pressBrandPath(brand.slug)),
  })
}

export function mockStaticSupportCategoryPageData(
  path: keyof typeof STATIC_SUPPORT_PAGES,
  page = 1,
): CategoryPageData {
  const def = STATIC_SUPPORT_PAGES[path]
  const category = mockCategoryRecord({
    type: "AUDIENCE",
    slug: def.slug,
    h1: def.h1,
    seoTitle: def.seoTitle,
    metaDescription: def.metaDescription,
    introText: def.introText,
    faqJson: getCategoryFaq(def.slug) ?? null,
  })

  const base = mapCategoryToPageData(category, staticMockPuzzleCards(def.slug, 4), {
    page,
    relatedCategories: hubRelatedLinks(),
  })

  const breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: def.h1, href: path },
  ]

  const paginated = base.puzzles

  return {
    ...base,
    canonicalPath: path,
    breadcrumbs,
    schema: {
      itemList: buildItemListSchema(def.h1, paginated.items),
      faqPage: base.schema.faqPage,
    },
  }
}

export function isKnownHubSlug(slug: string): slug is keyof typeof HUB_DEFINITIONS {
  return slug in HUB_DEFINITIONS
}

export function isKnownStaticSupportPath(path: string): path is keyof typeof STATIC_SUPPORT_PAGES {
  return path in STATIC_SUPPORT_PAGES
}
