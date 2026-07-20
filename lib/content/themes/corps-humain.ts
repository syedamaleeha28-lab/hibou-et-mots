import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-thematiques/corps-humain/ (~300 words). */
export const CORPS_HUMAIN_INTRO = [
  "Le thème Corps humain de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour faire vivre le vocabulaire du corps en français. Chaque grille invite à retrouver les parties du corps que l'enfant nomme dès la maternelle : la tête et le visage — œil, oreille, nez, bouche —, le bras et la main, la jambe et le pied. Les listes s'ouvrent sur le cœur qui bat, l'estomac après le repas, la peau qui protège, les cheveux à coiffer et la dent qui pousse — autant de mots utiles en sciences, en langage et en vie quotidienne.",
  "Ces puzzles deviennent une activité éducative légère autour du corps : pointer une partie sur un schéma, compléter une chanson, préparer une séquence hygiène sans surcharge d'écriture. Trouver un mot caché fixe la forme orthographique du mot entier — main, pied, tête — et soutient la lecture en maternelle comme au CP. Le vocabulaire corps humain progresse avec l'âge : mots courts d'abord, puis estomac, oreille ou cheveux lorsque l'élève entre en cycle 2.",
  "En classe, les enseignants utilisent les grilles en sciences, en langage ou après un album sur le corps : « montre où se trouve le mot que tu viens de trouver ». Les familles impriment un PDF pour occuper un créneau calme ou accompagner une visite chez le médecin. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les séries alternent tête et membres, sens et organes, pour garder de la variété. Croisez le thème avec un niveau scolaire — maternelle ou CP — ou explorez le thème Famille pour relier corps et proches.",
].join("\n\n")

export const CORPS_HUMAIN_META_DESCRIPTION =
  "Mots mêlés et mots cachés corps humain gratuits : tête, main, pied, bras, œil, nez, bouche, cœur. Vocabulaire corps et sciences — à imprimer ou à jouer en ligne."

export const CORPS_HUMAIN_FAQ: FaqItem[] = [
  {
    question: "Quelles parties du corps figurent dans les grilles ?",
    answer:
      "Les listes Corps humain mêlent tête, main, pied, bras, jambe, œil, oreille, nez, bouche, cœur, estomac, peau, cheveux ou dent, selon la grille choisie.",
  },
  {
    question: "Ce thème Corps humain convient-il à la maternelle ?",
    answer:
      "Oui, commencez par main, pied, tête ou nez en grilles courtes de mots mêlés Corps humain en grandes lettres — idéal en PS, MS et GS.",
  },
  {
    question: "Comment utiliser ce thème en sciences au primaire ?",
    answer:
      "Distribuez une grille Corps humain avant ou après un schéma du corps : les élèves repèrent le vocabulaire pendant un temps calme.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés Corps humain ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Corps humain : partie en ligne ou PDF A4 avec corrigé pour la maison et la classe.",
  },
  {
    question: "Existe-t-il des grilles Corps humain par niveau scolaire ?",
    answer:
      "Oui, croisez le thème Corps humain avec un niveau via les pages École ou choisissez une difficulté facile pour les plus jeunes.",
  },
]

export const CORPS_HUMAIN_EXPLORE_LINK_LABELS = [
  { href: gradePath("maternelle"), label: "Mots mêlés Maternelle", hint: "Premières parties du corps en grandes lettres" },
  { href: themePath("famille"), label: "Thème Famille", hint: "Relier corps et proches" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste anatomique" },
  { href: ROUTES.ecoleHub, label: "Mots mêlés École", hint: "Parcours par niveau scolaire" },
  { href: themePath("sport"), label: "Thème Sport", hint: "Variez avec le mouvement du corps" },
] as const
