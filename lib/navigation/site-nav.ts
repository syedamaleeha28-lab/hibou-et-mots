import {
  ROUTES,
  difficultyPath,
  gradePath,
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
      ],
    },
  ],
}

export const headerMegaMenus: MegaMenuPanel[] = [
  imprimerMegaMenu,
  ecoleMegaMenu,
  plusMegaMenu,
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
]

export const footerLegalLinks: NavLink[] = [
  { label: "Mentions légales", href: ROUTES.mentionsLegales },
  { label: "Politique de confidentialité", href: ROUTES.confidentialite },
  { label: "Contact", href: ROUTES.contact },
  { label: "À propos", href: ROUTES.aPropos },
  { label: "Auteur", href: ROUTES.auteur },
]
