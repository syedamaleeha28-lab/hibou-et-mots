import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-thematiques/sciences/ (~300 words). */
export const SCIENCES_INTRO = [
  "Le thème Sciences de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour retrouver le vocabulaire scientifique du primaire en français. Chaque grille rassemble des mots familiers aux petits curieux : l'eau et l'air qui nous entourent, le soleil et la lune observés le soir, une plante qui pousse à partir d'une graine, une racine qui puise l'eau dans le sol, et l'énergie qui fait tourner le monde. Les listes s'ouvrent aussi sur la gravité, la planète, l'étoile et, pour les plus grands, la matière, la molécule et l'expérience réalisée au microscope.",
  "Ces puzzles deviennent une activité éducative légère pour accompagner la découverte des sciences : observer une graine germer, réaliser une petite expérience en classe ou simplement nourrir la curiosité pour les étoiles et les planètes. Trouver un mot caché fixe la forme orthographique du mot entier — énergie, planète, expérience — et rend concret un vocabulaire parfois abstrait pour les élèves du primaire.",
  "En classe, les enseignants utilisent les grilles Sciences après une leçon sur le vivant, la matière ou l'espace, pour ancrer le vocabulaire avant ou après une expérience. Les familles impriment un PDF pour accompagner un exposé ou simplement nourrir la curiosité scientifique à la maison. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les grilles Sciences alternent vivant, matière et espace pour garder de la variété. Croisez le thème avec un niveau scolaire — CM1 ou CM2, où les sciences prennent une place plus importante — ou explorez le thème Météo pour un autre angle des sciences du quotidien.",
].join("\n\n")

export const SCIENCES_META_DESCRIPTION =
  "Mots mêlés et mots cachés Sciences gratuits : eau, soleil, planète, énergie, expérience, matière. Vocabulaire scientifique du primaire à imprimer ou à jouer en ligne."

export const SCIENCES_FAQ: FaqItem[] = [
  {
    question: "Quels mots retrouve-t-on dans les grilles Sciences ?",
    answer:
      "Les listes Sciences mêlent eau, air, soleil, lune, plante, graine, énergie, gravité, planète et étoile, selon la grille choisie.",
  },
  {
    question: "Ce thème Sciences convient-il aux enfants de maternelle et de CP ?",
    answer:
      "Oui, commencez par eau, air ou lune en grilles courtes et grandes lettres — idéal en maternelle et au CP, avant des mots plus longs comme énergie ou expérience en CM1-CM2.",
  },
  {
    question: "Comment utiliser ce thème Sciences en classe ?",
    answer:
      "Distribuez une grille Sciences après une leçon sur le vivant, la matière ou l'espace, pour ancrer le vocabulaire avant ou après une expérience.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés Sciences ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Sciences : partie en ligne immédiate ou PDF A4 avec corrigé pour la maison ou la classe.",
  },
  {
    question: "Existe-t-il des grilles Sciences par niveau scolaire ?",
    answer:
      "Oui, croisez le thème Sciences avec un niveau via les pages École, ou choisissez la difficulté facile pour les plus jeunes élèves.",
  },
]

export const SCIENCES_EXPLORE_LINK_LABELS = [
  { href: gradePath("cm2"), label: "Mots mêlés CM2", hint: "Grilles Sciences adaptées au programme du cycle 3" },
  { href: themePath("meteo"), label: "Thème Météo", hint: "Les sciences du quotidien et du ciel" },
  { href: themePath("corps-humain"), label: "Thème Corps humain", hint: "Un autre angle des sciences du vivant" },
  { href: ROUTES.ecoleHub, label: "Mots mêlés École", hint: "Parcours par niveau scolaire" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste scientifique" },
] as const
