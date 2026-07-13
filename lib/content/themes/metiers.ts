import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-thematiques/metiers/ (~300 words). */
export const METIERS_INTRO = [
  "Le thème Métiers de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour retrouver le vocabulaire des professions en français. Chaque grille rassemble des métiers que les enfants croisent au quotidien : le facteur qui distribue le courrier, le pompier qui éteint les incendies, le médecin qui soigne, le boulanger qui prépare le pain, le fermier qui s'occupe des animaux, le professeur devant sa classe et le policier qui veille à la sécurité. Les listes s'ouvrent aussi, pour les plus grands, sur le vétérinaire, l'ingénieur, l'architecte et même l'astronaute.",
  "Ces puzzles deviennent une activité éducative légère pour accompagner la découverte des métiers : préparer un exposé sur le métier rêvé, réviser le vocabulaire avant une visite de la caserne des pompiers ou simplement s'interroger sur ce que fait chaque adulte croisé dans la journée. Trouver un mot caché fixe la forme orthographique du mot entier — pompier, médecin, boulanger — et enrichit le vocabulaire social sans donner l'impression de réciter une leçon.",
  "En classe, les enseignants utilisent les grilles Métiers lors d'une séquence sur les métiers et l'orientation, ou après la visite d'un intervenant extérieur. Les familles impriment un PDF pour accompagner une discussion sur les métiers ou un exposé scolaire. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les grilles Métiers alternent professions du quotidien et métiers plus rares pour garder de la variété. Croisez le thème avec un niveau scolaire — CP ou CE1 pour les métiers familiers, CM1 ou CM2 pour des professions plus complexes — ou explorez le thème Sciences pour d'autres vocations scientifiques.",
].join("\n\n")

export const METIERS_META_DESCRIPTION =
  "Mots mêlés et mots cachés Métiers gratuits : facteur, pompier, médecin, boulanger, fermier, professeur. Vocabulaire des professions à imprimer ou à jouer en ligne."

export const METIERS_FAQ: FaqItem[] = [
  {
    question: "Quels métiers retrouve-t-on dans les grilles ?",
    answer:
      "Les listes Métiers mêlent facteur, pompier, médecin, boulanger, fermier, professeur, policier, dentiste, vétérinaire et infirmier, selon la grille choisie.",
  },
  {
    question: "Ce thème Métiers convient-il aux enfants de maternelle et de CP ?",
    answer:
      "Oui, commencez par chef, facteur ou pompier en grilles courtes et grandes lettres — idéal en maternelle et au CP, avant des métiers plus longs comme vétérinaire ou architecte en CM1-CM2.",
  },
  {
    question: "Comment utiliser ce thème Métiers en classe ?",
    answer:
      "Distribuez une grille Métiers lors d'une séquence sur les professions et l'orientation, ou après la visite d'un intervenant extérieur comme un pompier ou un policier.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés Métiers ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Métiers : partie en ligne immédiate ou PDF A4 avec corrigé pour la maison ou la classe.",
  },
  {
    question: "Existe-t-il des grilles Métiers par niveau scolaire ?",
    answer:
      "Oui, croisez le thème Métiers avec un niveau via les pages École, ou choisissez la difficulté facile pour les plus jeunes élèves.",
  },
]

export const METIERS_EXPLORE_LINK_LABELS = [
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Grilles Métiers adaptées aux premiers lecteurs" },
  { href: themePath("sciences"), label: "Thème Sciences", hint: "D'autres vocations scientifiques" },
  { href: ROUTES.ecoleHub, label: "Mots mêlés École", hint: "Parcours par niveau scolaire" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de métiers" },
  { href: ROUTES.ressources, label: "Ressources enseignants", hint: "Pour une séquence sur les métiers en classe" },
] as const
