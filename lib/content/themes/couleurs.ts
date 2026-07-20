import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-thematiques/couleurs/ (~300 words). */
export const COULEURS_INTRO = [
  "Le thème Couleurs de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés couleurs pour ancrer le vocabulaire des teintes en français. Chaque grille invite à retrouver les mots que l'enfant croise dès la maternelle : le rouge vif du feutre, le bleu du ciel, le vert de l'herbe, le jaune du soleil, le rose d'une fleur. Les listes poursuivent avec le noir et le blanc, l'orange de l'automne, le violet des glycines, le marron de la terre, le gris des nuages et le turquoise de la mer — autant de repères visuels pour nommer le monde.",
  "Ces puzzles deviennent une activité éducative idéale en maternelle et au début du primaire : associer une couleur à un objet, compléter une frise, préparer un atelier peinture sans surcharge d'écriture. Trouver un mot caché fixe la forme orthographique du mot entier — rouge, bleu, vert — et soutient la lecture en PS, MS et GS. Le vocabulaire couleurs s'étoffe ensuite avec turquoise, marron ou violet lorsque l'élève entre en CP et en CE1.",
  "En classe, les enseignants utilisent les grilles en arts plastiques, en langage ou en début de séance : « trouve toutes les couleurs chaudes » après la partie. Les familles impriment un PDF pour un goûter créatif ou pour accompagner un album illustré très coloré. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les séries alternent couleurs primaires, couleurs secondaires et teintes plus rares pour garder de la variété. Croisez le thème avec un niveau scolaire — maternelle en priorité — ou choisissez une difficulté facile pour les tout-petits.",
].join("\n\n")

export const COULEURS_META_DESCRIPTION =
  "Mots mêlés et mots cachés couleurs gratuits : rouge, bleu, vert, jaune, orange, violet, marron, turquoise. Vocabulaire couleurs pour la maternelle et le primaire — à imprimer ou à jouer en ligne."

export const COULEURS_FAQ: FaqItem[] = [
  {
    question: "Quelles couleurs figurent dans les grilles de ce thème ?",
    answer:
      "Les listes Couleurs mêlent rouge, bleu, vert, jaune, rose, noir, blanc, orange, violet, marron, gris ou turquoise, selon la grille choisie.",
  },
  {
    question: "Ce thème Couleurs convient-il à la maternelle ?",
    answer:
      "Oui, les grilles Couleurs courtes en grandes lettres sont idéales pour les premiers repérages visuels en PS, MS et GS.",
  },
  {
    question: "Comment utiliser les mots mêlés Couleurs en arts plastiques ?",
    answer:
      "Distribuez une grille de mots mêlés Couleurs avant un atelier peinture ou après une frise : les élèves repèrent le vocabulaire des teintes pendant un temps calme.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les grilles Couleurs ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Couleurs : partie en ligne ou PDF A4 avec corrigé pour la maison et la classe.",
  },
  {
    question: "Peut-on croiser Couleurs et un niveau scolaire ?",
    answer:
      "Oui, explorez les pages École — maternelle ou CP — ou choisissez une difficulté facile sur le thème Couleurs pour calibrer la liste.",
  },
]

export const COULEURS_EXPLORE_LINK_LABELS = [
  { href: gradePath("maternelle"), label: "Mots mêlés Maternelle", hint: "Couleurs en grandes lettres pour les tout-petits" },
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Vocabulaire couleurs adapté au cycle 2" },
  { href: themePath("fruits"), label: "Thème Fruits", hint: "Relier couleurs et alimentation" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de couleurs" },
  { href: themePath("famille"), label: "Thème Famille", hint: "Variez avec la vie quotidienne" },
] as const
