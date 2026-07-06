import { ROUTES, comboPath, gradePath, seasonalPath, themePath } from "@/lib/seo/routes"

export type RessourcesGradeCard = {
  slug: string
  label: string
  age: string
  grid: string
  hint: string
}

export type RessourcesThemeCard = {
  href: string
  label: string
  hint: string
  group: "programme" | "saison"
}

export type RessourcesPrintableRow = {
  href: string
  label: string
  description: string
}

export type RessourcesActivity = {
  id: string
  title: string
  duration: string
  levels: string
  steps: string[]
}

export type RessourcesComboLink = {
  href: string
  label: string
  hint: string
}

/** Grade picker cards for teacher quick navigation. */
export const RESSOURCES_GRADE_CARDS: RessourcesGradeCard[] = [
  {
    slug: "maternelle",
    label: "Maternelle",
    age: "3–5 ans",
    grid: "8×8",
    hint: "Cycle 1 — premières formes en grandes lettres",
  },
  {
    slug: "cp",
    label: "CP",
    age: "6 ans",
    grid: "8×8",
    hint: "Cycle 2 — premiers mots outils, horizontal et vertical",
  },
  {
    slug: "ce1",
    label: "CE1",
    age: "7 ans",
    grid: "10×10",
    hint: "Cycle 2 — vocabulaire scolaire progressif",
  },
  {
    slug: "ce2",
    label: "CE2",
    age: "8 ans",
    grid: "10×10",
    hint: "Cycle 2 — lexique enrichi, consolidation orthographique",
  },
  {
    slug: "cm1",
    label: "CM1",
    age: "9 ans",
    grid: "12×12",
    hint: "Cycle 3 — diagonales et mots plus longs",
  },
  {
    slug: "cm2",
    label: "CM2",
    age: "10 ans",
    grid: "12×12",
    hint: "Cycle 3 — directions variées, préparation au collège",
  },
  {
    slug: "6e",
    label: "6e",
    age: "11 ans",
    grid: "15×15",
    hint: "Grilles denses, vocabulaire de début de collège",
  },
]

/** Thematic quick-picks grouped for classroom planning. */
export const RESSOURCES_THEME_CARDS: RessourcesThemeCard[] = [
  {
    href: themePath("vocabulaire"),
    label: "Vocabulaire scolaire",
    hint: "Mots outils, lecture, grammaire — aligné sur le programme de français",
    group: "programme",
  },
  {
    href: themePath("animaux"),
    label: "Animaux",
    hint: "Lexique nature, sciences et lecture au Cycle 2",
    group: "programme",
  },
  {
    href: themePath("couleurs"),
    label: "Couleurs",
    hint: "Champ lexical du quotidien, idéal en maternelle et CP",
    group: "programme",
  },
  {
    href: themePath("famille"),
    label: "Famille",
    hint: "Vocabulaire de la vie quotidienne et des relations",
    group: "programme",
  },
  {
    href: themePath("corps-humain"),
    label: "Corps humain",
    hint: "Lexique scientifique simplifié pour le primaire",
    group: "programme",
  },
  {
    href: themePath("fruits"),
    label: "Fruits",
    hint: "Alimentation et vocabulaire sensoriel en classe",
    group: "programme",
  },
  {
    href: seasonalPath("noel"),
    label: "Noël",
    hint: "Fête de fin d'année — activité calme avant les vacances",
    group: "saison",
  },
  {
    href: seasonalPath("halloween"),
    label: "Halloween",
    hint: "Thème saisonnier populaire en octobre",
    group: "saison",
  },
  {
    href: seasonalPath("rentree"),
    label: "Rentrée",
    hint: "Vocabulaire de la classe et des fournitures",
    group: "saison",
  },
  {
    href: seasonalPath("ete"),
    label: "Été",
    hint: "Lexique des vacances et de la chaleur",
    group: "saison",
  },
]

/** Curated printable entry points — links to existing PDF-capable pages. */
export const RESSOURCES_PRINTABLE_ROWS: RessourcesPrintableRow[] = [
  {
    href: ROUTES.imprimer,
    label: "Toutes les grilles à imprimer",
    description:
      "Accédez aux PDF A4 avec corrigé en page 2 — noir et blanc, prêts à photocopier pour la classe.",
  },
  {
    href: gradePath("cp"),
    label: "Pack CP — grilles 8×8",
    description:
      "Sélection de mots mêlés pour le Cycle 2 : listes courtes, repérage horizontal et vertical.",
  },
  {
    href: gradePath("ce1"),
    label: "Pack CE1 — grilles 10×10",
    description:
      "Vocabulaire scolaire du CE1, idéal pour une fiche de révision lexicale en fin de séance.",
  },
  {
    href: themePath("vocabulaire"),
    label: "Thème Vocabulaire — PDF",
    description:
      "Mots outils du programme de français : lecture, orthographe, grammaire et conjugaison.",
  },
  {
    href: seasonalPath("noel"),
    label: "Grilles de Noël",
    description:
      "Fiches festives à distribuer avant les vacances — imprimables avec solution.",
  },
  {
    href: ROUTES.generateur,
    label: "Fiche sur mesure avec le générateur",
    description:
      "Saisissez dix mots de la semaine : une grille personnalisée et son corrigé en quelques minutes.",
  },
]

/** Express classroom activity recipes (5–20 minutes). */
export const RESSOURCES_CLASSROOM_ACTIVITIES: RessourcesActivity[] = [
  {
    id: "accueil",
    title: "Accueil du matin",
    duration: "5–10 min",
    levels: "CP, CE1",
    steps: [
      "Distribuez une grille 8×8 ou 10×10 pendant que les élèves s'installent.",
      "Projetez la liste des mots au tableau pour soutenir les lecteurs débutants.",
      "Corrigez à l'oral en fin d'accueil : chaque mot trouvé est lu collectivement.",
    ],
  },
  {
    id: "revision-vocabulaire",
    title: "Révision de vocabulaire",
    duration: "10–15 min",
    levels: "CE1, CE2, CM1",
    steps: [
      "Choisissez une grille thématique alignée sur la leçon de la semaine (animaux, saisons, corps humain).",
      "Les élèves travaillent en autonomie sur la fiche imprimée.",
      "Relisez les mots non trouvés à voix haute pour ancrer l'orthographe lexicale.",
    ],
  },
  {
    id: "fin-seance",
    title: "Fin de séance calme",
    duration: "10–20 min",
    levels: "Tous niveaux",
    steps: [
      "Après une séance exigeante de français, proposez une grille adaptée au niveau de la classe.",
      "L'activité calme favorise la concentration et la compréhension écrite de la liste.",
      "Le corrigé au verso permet une correction rapide ou une auto-évaluation.",
    ],
  },
  {
    id: "devoir-maison",
    title: "Devoir maison ludique",
    duration: "15–20 min",
    levels: "CP au CM2",
    steps: [
      "Imprimez un PDF ou envoyez un lien vers une grille en ligne — sans compte requis.",
      "Les parents accompagnent la lecture de la liste si l'enfant débute en lecture.",
      "En classe le lendemain, repérez collectivement les mots encore hésitants.",
    ],
  },
  {
    id: "evaluation-formative",
    title: "Évaluation formative du lexique",
    duration: "15 min",
    levels: "CE2, CM1, CM2",
    steps: [
      "Distribuez des grilles différentes par table pour limiter la reprise visuelle.",
      "Utilisez le vocabulaire travaillé durant le trimestre.",
      "Analysez les erreurs de repérage pour cibler une révision orthographique ciblée.",
    ],
  },
  {
    id: "projet-saisonnier",
    title: "Projet saisonnier",
    duration: "20 min",
    levels: "CE1, CE2",
    steps: [
      "Croisez un thème de fête (Noël, Halloween, rentrée) avec le niveau de la classe.",
      "Associez la grille à un album ou à une activité plastique sur le même lexique.",
      "Prolongez par une courte production écrite : une phrase avec trois mots trouvés.",
    ],
  },
]

export const RESSOURCES_DIFFERENTIATION_PARAGRAPHS = [
  "Dans une classe hétérogène, la même consigne — « retrouvez les mots de la liste » — peut coexister avec des listes adaptées. Imprimez une grille CP pour les élèves en consolidation, une CE1 pour le groupe médian et une CM1 pour les plus avancés. L'apprentissage de la lecture progresse à des rythmes différents ; le mots mêlé offre une tâche commune sans imposer la même difficulté lexicale.",
  "Le générateur Hibou&Mots permet de composer trois fiches en quelques minutes : dix mots par liste, taille de grille ajustée au niveau. En Cycle 2 comme en Cycle 3, cette différenciation légère évite de multiplier les supports manuels tout en respectant les besoins de chaque élève.",
  "Pour un élève en difficulté, réduisez la liste à cinq mots et autorisez le travail en binôme. Pour un élève avancé, ajoutez des mots polysyllabiques ou proposez la relecture des entrées trouvées dans une phrase construite — un pont naturel vers la compréhension écrite.",
]

/** Niveau × thème combinations for quick classroom picks (seeded combo pages only). */
export const RESSOURCES_COMBO_LINKS: RessourcesComboLink[] = [
  {
    href: comboPath("ce1", "noel"),
    label: "CE1 × Noël",
    hint: "Vocabulaire festif calibré pour des élèves de 7 ans",
  },
  {
    href: comboPath("ce1", "halloween"),
    label: "CE1 × Halloween",
    hint: "Lexique d'octobre adapté au Cycle 2",
  },
]

export const RESSOURCES_PEDAGOGIE_CROSS_LINK = {
  href: ROUTES.pedagogie,
  title: "Approfondir la démarche pédagogique",
  description:
    "Cette page rassemble les fiches prêtes à l'emploi ; le guide Pédagogie détaille le pourquoi et le comment : cycles de l'Éducation nationale, bienfaits pour l'apprentissage de la lecture, usages en classe et à la maison.",
  cta: "Lire le guide pédagogique complet",
}

/** Teacher-focused internal links surfaced at the bottom of the editorial module. */
export const RESSOURCES_TEACHER_LINKS = [
  { href: ROUTES.ecoleHub, label: "Hub Mots mêlés École" },
  { href: ROUTES.pedagogie, label: "Guide pédagogique" },
  { href: gradePath("cp"), label: "Grilles CP" },
  { href: gradePath("ce1"), label: "Grilles CE1" },
  { href: gradePath("ce2"), label: "Grilles CE2" },
  { href: gradePath("cm1"), label: "Grilles CM1" },
  { href: gradePath("cm2"), label: "Grilles CM2" },
  { href: themePath("vocabulaire"), label: "Thème Vocabulaire" },
  { href: seasonalPath("noel"), label: "Grilles de Noël" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer" },
  { href: ROUTES.generateur, label: "Générateur de grilles" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants" },
] as const

/** Flat copy for word-count and educational-entity audits. */
export function ressourcesEnseignantsEditorialPlainText(): string {
  const grades = RESSOURCES_GRADE_CARDS.flatMap((row) => [
    row.label,
    row.age,
    row.grid,
    row.hint,
  ]).join(" ")
  const themes = RESSOURCES_THEME_CARDS.flatMap((card) => [
    card.label,
    card.hint,
  ]).join(" ")
  const printables = RESSOURCES_PRINTABLE_ROWS.flatMap((row) => [
    row.label,
    row.description,
  ]).join(" ")
  const activities = RESSOURCES_CLASSROOM_ACTIVITIES.flatMap((activity) => [
    activity.title,
    activity.duration,
    activity.levels,
    ...activity.steps,
  ]).join(" ")
  const combos = RESSOURCES_COMBO_LINKS.flatMap((link) => [
    link.label,
    link.hint,
  ]).join(" ")
  const links = RESSOURCES_TEACHER_LINKS.map((link) => link.label).join(" ")
  const crossLink = [
    RESSOURCES_PEDAGOGIE_CROSS_LINK.title,
    RESSOURCES_PEDAGOGIE_CROSS_LINK.description,
  ].join(" ")
  const differentiation = RESSOURCES_DIFFERENTIATION_PARAGRAPHS.join(" ")

  return [
    grades,
    themes,
    printables,
    activities,
    differentiation,
    combos,
    crossLink,
    links,
  ].join(" ")
}
