import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-thematiques/pays-du-monde/ (~300 words). */
export const PAYS_DU_MONDE_INTRO = [
  "Le thème Pays du Monde de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour retrouver le vocabulaire de la géographie en français. Chaque grille rassemble les mots que l'on croise sur une carte du monde : le nom d'un pays, sa capitale, le drapeau qui le représente, le continent auquel il appartient, un océan à traverser, une montagne ou un fleuve célèbre, et la frontière qui sépare deux territoires. Les listes s'ouvrent aussi sur le monument qui symbolise une ville et la langue que l'on y parle.",
  "Ces puzzles deviennent une activité éducative légère pour accompagner l'apprentissage de la géographie : réviser les capitales avant une interrogation, préparer un exposé sur un continent ou simplement s'amuser avec une carte du monde sous les yeux. Trouver un mot caché fixe la forme orthographique du mot entier — capitale, continent, frontière — et rend concret un vocabulaire parfois abstrait pour les élèves du primaire.",
  "En classe, les enseignants utilisent les grilles Pays du Monde après une leçon sur un continent ou une carte, pour ancrer le vocabulaire avant ou après une évaluation de géographie. Les familles impriment un PDF pour accompagner un exposé ou une simple curiosité pour les cartes. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les grilles Pays du Monde alternent pays, capitales et relief pour garder de la variété. Croisez le thème avec un niveau scolaire — CM1 ou CM2, où la géographie du monde entre au programme — ou explorez le thème Météo pour un autre angle des sciences.",
].join("\n\n")

export const PAYS_DU_MONDE_META_DESCRIPTION =
  "Mots mêlés et mots cachés Pays du Monde gratuits : pays, capitale, drapeau, continent, océan, montagne. Vocabulaire de géographie à imprimer ou à jouer en ligne."

export const PAYS_DU_MONDE_FAQ: FaqItem[] = [
  {
    question: "Quels mots retrouve-t-on dans les grilles Pays du Monde ?",
    answer:
      "Les listes Pays du Monde mêlent pays, capitale, drapeau, continent, océan, montagne, fleuve, frontière, carte du monde et monument, selon la grille choisie.",
  },
  {
    question: "Ce thème Pays du Monde convient-il au primaire ?",
    answer:
      "Oui, commencez par des grilles faciles avec des pays et continents familiers, puis progressez vers des listes plus longues incluant capitales et monuments en CM1-CM2.",
  },
  {
    question: "Comment lier ce thème au programme de géographie ?",
    answer:
      "Utilisez une grille Pays du Monde après une leçon sur un continent ou une carte, pour ancrer le vocabulaire avant ou après une évaluation.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés Pays du Monde ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Pays du Monde : partie en ligne immédiate ou PDF A4 avec corrigé pour la maison ou la classe.",
  },
  {
    question: "Existe-t-il des grilles Pays du Monde par niveau scolaire ?",
    answer:
      "Oui, croisez le thème avec un niveau via les pages École, ou choisissez la difficulté facile pour les plus jeunes élèves.",
  },
]

export const PAYS_DU_MONDE_EXPLORE_LINK_LABELS = [
  { href: gradePath("cm2"), label: "Mots mêlés CM2", hint: "Grilles Pays du Monde adaptées au programme de géographie" },
  { href: themePath("meteo"), label: "Thème Météo", hint: "Un autre angle des sciences et de la géographie" },
  { href: ROUTES.ecoleHub, label: "Mots mêlés École", hint: "Parcours par niveau scolaire" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de pays et capitales" },
  { href: ROUTES.adultes, label: "Mots mêlés Adultes", hint: "Culture générale et géographie pour tous les âges" },
] as const
