import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, seasonalPath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-thematiques/meteo/ (~300 words). */
export const METEO_INTRO = [
  "Le thème Météo de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés météo pour enrichir le vocabulaire du temps qu'il fait en français. Chaque grille fait circuler les phénomènes du ciel : la pluie qui tambourine sur la vitre, la neige qui recouvre le jardin, le soleil qui réchauffe la cour de récréation, le nuage gris qui annonce l'averse. Le vent secoue les branches, l'orage gronde à l'horizon, le brouillard enveloppe la campagne le matin, la tempête secoue les volets. Les listes évoquent aussi l'arc-en-ciel après l'averse, la grêle rare mais mémorable, la canicule estivale et la saison qui cadre chaque phénomène.",
  "Ces puzzles s'intègrent en activité éducative autour des sciences ou de la géographie : observer le ciel, relier un mot à une carte des nuages, mesurer la température au thermomètre de la classe. Trouver un mot caché fixe l'orthographe du mot entier — utile en CP pour les mots courts comme pluie ou vent, puis en CE1 pour brouillard, tempête ou météorologie lorsque l'élève lit des termes plus longs. Le vocabulaire météo progresse avec l'âge et les saisons scolaires.",
  "En classe, les enseignants distribuent une grille avant un cahier des sciences, après une sortie météo ou en début de séance lors d'une unité sur les saisons. Les familles impriment un PDF pour un mercredi pluvieux ou pour commenter les bulletins météo du journal. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression simple.",
  "Hibou&Mots reste gratuit, sans inscription. Les séries alternent temps calme et phénomènes spectaculaires pour garder de la variété. Croisez le thème avec un niveau scolaire ou explorez les fêtes saisonnières — été, hiver, rentrée — pour relier météo et calendrier scolaire.",
].join("\n\n")

export const METEO_META_DESCRIPTION =
  "Mots mêlés et mots cachés météo gratuits : pluie, neige, soleil, nuage, vent, orage, tempête, arc-en-ciel. Vocabulaire météo et sciences — à imprimer ou à jouer en ligne."

export const METEO_FAQ: FaqItem[] = [
  {
    question: "Quel lexique météo retrouve-t-on dans les grilles ?",
    answer:
      "Les listes Météo mêlent pluie, neige, soleil, nuage, vent, orage, brouillard, tempête, arc-en-ciel, grêle, canicule ou saison, selon la grille choisie.",
  },
  {
    question: "Quand utiliser le thème Météo en classe ?",
    answer:
      "Lors d'une séquence sciences ou géographie sur le temps qu'il fait : distribuez une grille Météo en activité calme ou après une observation du ciel.",
  },
  {
    question: "Ce thème Météo convient-il aux plus jeunes ?",
    answer:
      "Oui : commencez par pluie, soleil ou vent en maternelle, puis progressez vers brouillard, tempête ou température au CE1 et au CE2.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés Météo ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Météo : partie en ligne ou PDF A4 avec corrigé pour la maison et la classe.",
  },
  {
    question: "Peut-on relier Météo aux saisons scolaires ?",
    answer:
      "Oui, explorez aussi les thèmes Été, Hiver ou Rentrée dans Fêtes & Saisons pour croiser vocabulaire météo et calendrier de l'année.",
  },
]

export const METEO_EXPLORE_LINK_LABELS = [
  { href: seasonalPath("ete"), label: "Mots mêlés Été", hint: "Chaleur, vacances et soleil" },
  { href: ROUTES.fetesHub, label: "Fêtes & Saisons", hint: "Noël, Halloween, Pâques et saisons" },
  { href: gradePath("ce1"), label: "Mots mêlés CE1", hint: "Vocabulaire météo adapté au cycle 2" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste météo" },
  { href: ROUTES.ecoleHub, label: "Mots mêlés École", hint: "Parcours par niveau scolaire" },
  { href: themePath("famille"), label: "Thème Famille", hint: "Variez avec la vie quotidienne" },
] as const
