import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-thematiques/famille/ (~300 words). */
export const FAMILLE_INTRO = [
  "Le thème Famille de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés famille pour faire vivre le vocabulaire du quotidien en français. Chaque grille invite à retrouver les mots qui structurent la vie à la maison : papa et maman au centre du foyer, bébé dans les bras, frère et sœur qui partagent la chambre, oncle et tante lors des réunions du dimanche, cousin qui vient en vacances. Les listes évoquent aussi les parents, les enfants réunis autour de la table, le mariage célébré en famille et le foyer comme premier cercle d'apprentissage du langage.",
  "Ces puzzles deviennent une activité éducative légère autour de la vie quotidienne : nommer un proche, relier un mot à une photo de classe ou à un album illustré, sans transformer la séance en fiche rébarbative. Trouver un mot caché ancre la forme orthographique du mot entier — utile en maternelle pour les premiers prénoms et en CP pour consolider l'expression orale. Le vocabulaire famille progresse avec l'âge : mots courts pour les tout-petits, puis mariage, génération ou foyer lorsque l'élève lit déjà des termes plus longs.",
  "En classe, les enseignants utilisent les grilles au début d'une séquence sur la vie quotidienne, après un album sur les proches ou en fin de journée comme rituel calme. Les familles impriment un PDF pour occuper un mercredi pluvieux ou préparer un arbre généalogique simplifié. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les séries alternent membres proches, fête de famille et vocabulaire du foyer pour garder de la variété. Croisez le thème avec un niveau scolaire — maternelle, CP ou CE1 — ou choisissez une difficulté adaptée : le lexique familial devient un fil concret entre programme de français et conversations à la maison.",
].join("\n\n")

export const FAMILLE_META_DESCRIPTION =
  "Mots mêlés et mots cachés famille gratuits : papa, maman, frère, sœur, cousin, parents, foyer. Vocabulaire famille et vie quotidienne — à imprimer ou à jouer en ligne."

export const FAMILLE_FAQ: FaqItem[] = [
  {
    question: "Quels mots de la famille figurent dans les grilles ?",
    answer:
      "Les listes Famille mêlent papa, maman, bébé, frère, sœur, oncle, tante, cousin, parents, enfants, mariage ou foyer, selon la grille choisie.",
  },
  {
    question: "Comment utiliser le thème Famille en maternelle ?",
    answer:
      "Proposez une grille Famille courte après un album sur les proches : les tout-petits repèrent papa, maman ou bébé dans une grille en grandes lettres.",
  },
  {
    question: "Ce thème Famille convient-il à une séquence vie quotidienne ?",
    answer:
      "Oui, distribuez une fiche Famille en expression orale ou en français : les élèves consolidant le vocabulaire des proches pendant un temps calme.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés Famille ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Famille : partie en ligne ou PDF A4 avec corrigé pour la maison et la classe.",
  },
  {
    question: "Existe-t-il des grilles Famille par niveau scolaire ?",
    answer:
      "Oui, croisez le thème Famille avec un niveau via les pages École ou choisissez une difficulté facile pour les plus jeunes.",
  },
]

export const FAMILLE_EXPLORE_LINK_LABELS = [
  { href: gradePath("maternelle"), label: "Mots mêlés Maternelle", hint: "Premiers mots sur la famille en grandes lettres" },
  { href: themePath("corps-humain"), label: "Thème Corps humain", hint: "Compléter avec le vocabulaire du corps" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de proches" },
  { href: ROUTES.ecoleHub, label: "Mots mêlés École", hint: "Parcours par niveau scolaire" },
  { href: themePath("couleurs"), label: "Thème Couleurs", hint: "Variez avec un autre thème du quotidien" },
] as const
