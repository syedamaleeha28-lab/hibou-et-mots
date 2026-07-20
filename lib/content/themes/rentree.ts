import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, seasonalPath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-fetes-saisons/rentree/ (~300 words). */
export const RENTREE_INTRO = [
  "Le thème Rentrée de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour retrouver le vocabulaire du retour à l'école en français. Chaque grille rassemble les mots de septembre : le cartable neuf, le cahier vierge, le stylo et la trousse remplie, le tableau de la classe, la maîtresse ou le professeur, l'ardoise, la colle et les ciseaux. Les listes s'ouvrent aussi sur la récréation tant attendue et le nouvel emploi du temps à apprendre par cœur.",
  "Ces puzzles deviennent une activité éducative légère pour accompagner le retour en classe : accueillir les élèves le premier jour, réviser le vocabulaire de la salle de classe ou simplement se réhabituer au rythme scolaire après deux mois de vacances. Trouver un mot caché fixe la forme orthographique du mot entier — cartable, cahier, trousse — et transforme la rentrée en jeu plutôt qu'en corvée.",
  "En classe, les enseignants utilisent les grilles Rentrée dès la première semaine de septembre, pour accueillir les élèves ou faire connaissance en douceur avec le nouveau vocabulaire de l'année. Les familles impriment un PDF pour préparer la trousse ou occuper les derniers jours de vacances. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les grilles Rentrée alternent fournitures scolaires et vie de classe pour garder de la variété. Croisez le thème avec un niveau scolaire — CP ou CE1 — ou explorez le thème Été pour couvrir toute la période des grandes vacances jusqu'à la rentrée.",
].join("\n\n")

export const RENTREE_META_DESCRIPTION =
  "Mots mêlés et mots cachés de la Rentrée gratuits : cartable, cahier, classe, professeur, règle, école. À imprimer en PDF ou à jouer en ligne, pour la maison et la classe."

export const RENTREE_FAQ: FaqItem[] = [
  {
    question: "Quels mots retrouve-t-on dans les grilles de Rentrée ?",
    answer:
      "Les listes Rentrée mêlent cartable, cahier, stylo, trousse, tableau, maîtresse, classe, ardoise, colle et ciseaux, selon la grille choisie.",
  },
  {
    question: "Ce thème Rentrée convient-il aux enfants de maternelle et de CP ?",
    answer:
      "Oui, commencez par colle, classe ou stylo en grilles courtes et grandes lettres — idéal en maternelle et au CP, avant des mots plus longs comme cartable ou trousse en CE1.",
  },
  {
    question: "Quand utiliser ce thème Rentrée en classe ?",
    answer:
      "Dès la première semaine de septembre, pour accueillir les élèves avec des mots mêlés Rentrée et réviser en douceur le vocabulaire de la salle de classe.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés de Rentrée ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Rentrée : partie en ligne immédiate ou PDF A4 avec corrigé pour la maison ou la classe.",
  },
  {
    question: "Existe-t-il des grilles de Rentrée par niveau scolaire ?",
    answer:
      "Oui, croisez le thème Rentrée avec un niveau via les pages École, ou choisissez la difficulté facile pour les plus jeunes élèves.",
  },
]

export const RENTREE_EXPLORE_LINK_LABELS = [
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Grilles Rentrée adaptées aux premiers lecteurs" },
  { href: seasonalPath("ete"), label: "Thème Été", hint: "La saison qui précède la rentrée" },
  { href: ROUTES.ecoleHub, label: "Mots mêlés École", hint: "Parcours par niveau scolaire" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de rentrée" },
  { href: themePath("vocabulaire"), label: "Thème Vocabulaire", hint: "Pour prolonger le lexique scolaire" },
] as const
