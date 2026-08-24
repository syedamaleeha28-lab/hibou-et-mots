import {
  ROUTES,
  difficultyPath,
  gradePath,
  motsCroisesForcePath,
  seasonalPath,
  themePath,
} from "@/lib/seo/routes"

export type NavLink = {
  label: string
  href: string
  description?: string
}

export type NavSection = {
  title: string
  links: NavLink[]
}

export type MegaMenuPanel = {
  id: string
  label: string
  sections: NavSection[]
  featured?: NavLink[]
}

/** PRD §9 — desktop header primary actions */
export const headerPrimaryLinks: NavLink[] = [
  { label: "Jouer en ligne", href: ROUTES.jouer },
  { label: "Créer ma grille", href: ROUTES.generateur },
]

export const imprimerMegaMenu: MegaMenuPanel = {
  id: "imprimer",
  label: "Imprimer",
  featured: [
    { label: "Mots mêlés gratuits", href: ROUTES.gratuits, description: "Toutes les grilles gratuites" },
    { label: "Mots mêlés à imprimer", href: ROUTES.imprimer, description: "PDF prêts à imprimer" },
  ],
  sections: [
    {
      title: "Par thème",
      links: [
        { label: "Tous les thèmes", href: ROUTES.thematiquesHub },
        { label: "Animaux", href: themePath("animaux") },
        { label: "Sport", href: themePath("sport") },
        { label: "Noël", href: seasonalPath("noel") },
        { label: "Halloween", href: seasonalPath("halloween") },
        { label: "Fêtes & saisons", href: ROUTES.fetesHub },
      ],
    },
    {
      title: "Par niveau",
      links: [
        { label: "Tous les niveaux", href: ROUTES.ecoleHub },
        { label: "Maternelle", href: gradePath("maternelle") },
        { label: "CP", href: gradePath("cp") },
        { label: "CE1", href: gradePath("ce1") },
        { label: "CE2", href: gradePath("ce2") },
        { label: "CM1", href: gradePath("cm1") },
        { label: "CM2", href: gradePath("cm2") },
        { label: "6e", href: gradePath("6e") },
      ],
    },
    {
      title: "Par difficulté",
      links: [
        { label: "Toutes les difficultés", href: ROUTES.difficulteHub },
        { label: "Facile", href: difficultyPath("facile") },
        { label: "Moyen", href: difficultyPath("moyen") },
        { label: "Difficile", href: difficultyPath("difficile") },
        { label: "Géant", href: difficultyPath("geant") },
      ],
    },
    // NEW: consolidates mots croisés (previously had ZERO nav links
    // anywhere on the site) and mots coupés into one place, instead of
    // scattering them across featured/Découvrir as the mots-coupés pack
    // originally did. This is the actual point of this pass — cross-type
    // discoverability, not just "add a link somewhere".
    {
      title: "Autres jeux de mots",
      links: [
        { label: "Mots croisés à imprimer", href: ROUTES.motsCroisesImprimer },
        { label: "Mini mots croisés (jeu quotidien)", href: ROUTES.miniMotsCroises },
        { label: "Mots coupés à imprimer", href: ROUTES.motsCoupesImprimer },
        { label: "Mots coupés (jeu en ligne)", href: ROUTES.motsCoupes },
      ],
    },
  ],
}

export const ecoleMegaMenu: MegaMenuPanel = {
  id: "ecole",
  label: "École",
  featured: [{ label: "Hub École", href: ROUTES.ecoleHub, description: "Mots mêlés par niveau scolaire" }],
  sections: [
    {
      title: "Niveaux scolaires",
      links: [
        { label: "Maternelle", href: gradePath("maternelle") },
        { label: "CP", href: gradePath("cp") },
        { label: "CE1", href: gradePath("ce1") },
        { label: "CE2", href: gradePath("ce2") },
        { label: "CM1", href: gradePath("cm1") },
        { label: "CM2", href: gradePath("cm2") },
        { label: "6e", href: gradePath("6e") },
      ],
    },
    {
      title: "Ressources",
      links: [
        { label: "Pédagogie", href: ROUTES.pedagogie },
        { label: "Ressources enseignants", href: ROUTES.ressources },
      ],
    },
  ],
}

export const plusMegaMenu: MegaMenuPanel = {
  id: "plus",
  label: "Plus",
  sections: [
    {
      title: "Par public",
      links: [
        { label: "Enfants", href: ROUTES.enfants },
        { label: "Adultes", href: ROUTES.adultes },
        { label: "Seniors", href: ROUTES.seniors },
      ],
    },
    {
      title: "Presse & ressources",
      links: [
        { label: "Journaux & magazines", href: ROUTES.presseHub },
        { label: "Jeux & magazines", href: ROUTES.jeuxMagazines },
        { label: "Ressources enseignants", href: ROUTES.ressources },
      ],
    },
    {
      title: "Découvrir",
      links: [
        { label: "Personnages", href: ROUTES.personnages },
        { label: "Solutions & règles", href: ROUTES.solutions },
        { label: "Application", href: ROUTES.application },
        // Mots coupés online-game link moved to imprimerMegaMenu's new
        // "Autres jeux de mots" section (consolidated with mots croisés
        // there) — removed from here to avoid the same link appearing
        // in two different menus with no clear reason for the split.
      ],
    },
  ],
}

/**
 * PT-BR pack: upgraded from a single flat header link. A flat link only
 * gets a visitor INTO the Portuguese section — once there, every other
 * header item (Imprimer/École/Plus) is still the French mega-menu with
 * no locale awareness, so clicking anything else immediately drops the
 * visitor back into French content with no way back except re-clicking
 * this same entry point. A real dropdown, matching the same pattern as
 * the French menus, lets a visitor move between all Portuguese pages
 * without ever losing their place in that section.
 *
 * Covers all 8 real PT-BR category pages that exist today (the 6
 * original ones plus the 2 hub index pages added later —
 * /caca-palavras-nivel/ and /caca-palavras-tematicos/).
 */
export const portuguesMegaMenu: MegaMenuPanel = {
  id: "portugues",
  label: "🇧🇷 Português",
  featured: [
    {
      label: "Caça-Palavras para Imprimir",
      href: "/caca-palavras-para-imprimir/",
      description: "Grades grátis em PDF",
    },
  ],
  sections: [
    {
      title: "Por dificuldade",
      links: [
        { label: "Todos os níveis", href: "/caca-palavras-nivel/" },
        { label: "Fácil", href: "/caca-palavras-nivel/facil/" },
        { label: "Médio", href: "/caca-palavras-nivel/medio/" },
        { label: "Difícil", href: "/caca-palavras-nivel/dificil/" },
      ],
    },
    {
      title: "Por tema",
      links: [
        { label: "Todos os temas", href: "/caca-palavras-tematicos/" },
        { label: "Animais", href: "/caca-palavras-tematicos/animais/" },
        { label: "Esporte", href: "/caca-palavras-tematicos/esporte/" },
      ],
    },
  ],
}

export const headerMegaMenus: MegaMenuPanel[] = [
  imprimerMegaMenu,
  ecoleMegaMenu,
  plusMegaMenu,
  portuguesMegaMenu,
]

/** PRD §9 — mobile bottom tab bar (≥44px touch targets) */
export const mobileBottomTabs: Array<NavLink & { icon: "home" | "print" | "play" | "create" | "search" }> = [
  { label: "Accueil", href: ROUTES.home, icon: "home" },
  { label: "Imprimer", href: ROUTES.imprimer, icon: "print" },
  { label: "Jouer", href: ROUTES.jouer, icon: "play" },
  { label: "Créer", href: ROUTES.generateur, icon: "create" },
  { label: "Recherche", href: ROUTES.recherche, icon: "search" },
]

/** PRD §9 — footer sitemap (6 silos) */
export const footerSiloColumns: NavSection[] = [
  {
    title: "Hub principal",
    links: [
      { label: "Mots mêlés gratuits", href: ROUTES.gratuits },
      { label: "Mots mêlés à imprimer", href: ROUTES.imprimer },
      { label: "Par difficulté", href: ROUTES.difficulteHub },
      { label: "Jouer en ligne", href: ROUTES.jouer },
      { label: "Générateur", href: ROUTES.generateur },
      { label: "Solutions & règles", href: ROUTES.solutions },
    ],
  },
  {
    title: "Par public",
    links: [
      { label: "Enfants", href: ROUTES.enfants },
      { label: "Adultes", href: ROUTES.adultes },
      { label: "Seniors", href: ROUTES.seniors },
    ],
  },
  {
    title: "Éducation",
    links: [
      { label: "École", href: ROUTES.ecoleHub },
      { label: "CP", href: gradePath("cp") },
      { label: "CE1", href: gradePath("ce1") },
      { label: "CM2", href: gradePath("cm2") },
      { label: "Pédagogie", href: ROUTES.pedagogie },
    ],
  },
  {
    title: "Thèmes & saisons",
    links: [
      { label: "Fêtes & saisons", href: ROUTES.fetesHub },
      { label: "Noël", href: seasonalPath("noel") },
      { label: "Halloween", href: seasonalPath("halloween") },
      { label: "Thématiques", href: ROUTES.thematiquesHub },
      { label: "Animaux", href: themePath("animaux") },
      { label: "Personnages", href: ROUTES.personnages },
    ],
  },
  {
    title: "Presse",
    links: [{ label: "Journaux & magazines", href: ROUTES.presseHub }],
  },
  {
    title: "Produits & ressources",
    links: [
      { label: "Jeux & magazines", href: ROUTES.jeuxMagazines },
      { label: "Ressources enseignants", href: ROUTES.ressources },
    ],
  },
  // NEW: same consolidated set as the header's "Autres jeux de mots"
  // section — footer is what actually reaches mobile visitors, since
  // the header mega-menu is desktop-only (see site-header.tsx's
  // "hidden ... lg:flex" wrapper), same reasoning already applied to
  // the Português column below.
  {
    title: "Autres jeux de mots",
    links: [
      { label: "Mots croisés à imprimer", href: ROUTES.motsCroisesImprimer },
      { label: "Mini mots croisés", href: ROUTES.miniMotsCroises },
      { label: "Mots coupés à imprimer", href: ROUTES.motsCoupesImprimer },
    ],
  },
  // PT-BR pack: footer still carries a compact Português column too, for
  // mobile visitors — the dropdown above only renders in the desktop nav
  // (see site-header.tsx's "hidden ... lg:flex" wrapper), same reason
  // the French mega-menus don't reach mobile without MobileNavDrawer
  // handling them separately.
  {
    title: "🇧🇷 Português",
    links: [
      { label: "Caça-palavras para imprimir", href: "/caca-palavras-para-imprimir/" },
      { label: "Por dificuldade", href: "/caca-palavras-nivel/" },
      { label: "Por tema", href: "/caca-palavras-tematicos/" },
    ],
  },
]

export const footerLegalLinks: NavLink[] = [
  { label: "Mentions légales", href: ROUTES.mentionsLegales },
  { label: "Politique de confidentialité", href: ROUTES.confidentialite },
  { label: "Contact", href: ROUTES.contact },
  { label: "À propos", href: ROUTES.aPropos },
  { label: "Auteur", href: ROUTES.auteur },
]

/**
 * NEW: shared cross-links between the three puzzle FORMATS (mots mêlés,
 * mots croisés, mots coupés) — meant to be rendered on EACH format's own
 * pages (category pages, crossword pages, mots-coupés pages) so a
 * visitor discovers the other formats from within the content itself,
 * not just from the header/footer. This is the actual topical-authority
 * signal: related content linking to related content, not just isolated
 * pages each linked from the same nav.
 *
 * Deliberately excludes whichever format the visitor is currently on —
 * consuming code should filter by `id !== currentFormatId`.
 */
export type PuzzleFormatLink = NavLink & { id: "mots-meles" | "mots-croises" | "mots-coupes" }

export const PUZZLE_FORMAT_LINKS: PuzzleFormatLink[] = [
  {
    id: "mots-meles",
    label: "Mots mêlés",
    href: ROUTES.imprimer,
    description: "Trouve les mots cachés dans une grille de lettres",
  },
  {
    id: "mots-croises",
    label: "Mots croisés",
    href: ROUTES.motsCroisesImprimer,
    description: "Complète la grille à l'aide des définitions",
  },
  {
    id: "mots-coupes",
    label: "Mots coupés",
    href: ROUTES.motsCoupesImprimer,
    description: "Associe le début et la fin de chaque mot",
  },
]

export { motsCroisesForcePath }
