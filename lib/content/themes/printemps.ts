import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, seasonalPath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-fetes-saisons/printemps/ (~300 words). */
export const PRINTEMPS_INTRO = [
  "Le thème Printemps de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour retrouver le vocabulaire du renouveau en français. Chaque grille rassemble les mots de la saison qui réveille la nature : les fleurs qui s'ouvrent, les bourgeons sur les branches, les oiseaux qui reviennent, un nid douillet, le papillon léger, le jardin qui reverdit et l'abeille qui butine. Les listes s'ouvrent aussi sur la pluie de printemps, l'arc-en-ciel qui suit et le muguet du premier mai.",
  "Ces puzzles deviennent une activité éducative légère pour accompagner l'arrivée des beaux jours : observer un jardin, planter des graines en classe ou simplement profiter d'un moment calme entre deux averses. Trouver un mot caché fixe la forme orthographique du mot entier — fleur, oiseau, jardin — et prolonge en douceur les apprentissages de lecture pendant que la nature reprend vie dehors.",
  "En classe, les enseignants utilisent les grilles Printemps après un atelier sur le cycle des plantes, une sortie au jardin ou une observation d'oiseaux dans la cour. Les familles impriment un PDF pour une après-midi entre deux giboulées ou pour accompagner une plantation de graines à la maison. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les grilles Printemps alternent nature et jardin pour garder de la variété. Croisez le thème avec un niveau scolaire — CP ou CE1 — ou explorez le thème Pâques, qui tombe souvent à la même période de l'année.",
].join("\n\n")

export const PRINTEMPS_META_DESCRIPTION =
  "Mots mêlés et mots cachés de printemps gratuits : fleurs, bourgeons, oiseaux, nid, papillon, jardin. À imprimer en PDF ou à jouer en ligne, pour la maison et la classe."

export const PRINTEMPS_FAQ: FaqItem[] = [
  {
    question: "Quels mots retrouve-t-on dans les grilles de Printemps ?",
    answer:
      "Les listes Printemps mêlent fleurs, bourgeons, oiseaux, nid, papillon, jardin, arc-en-ciel, graines, abeille et muguet, selon la grille choisie.",
  },
  {
    question: "Ce thème Printemps convient-il aux enfants de maternelle et de CP ?",
    answer:
      "Oui, commencez par nid, fleur ou abeille en grilles courtes et grandes lettres — idéal en maternelle et au CP, avant des mots plus longs comme papillon ou bourgeons en CE1.",
  },
  {
    question: "Comment utiliser ce thème Printemps en classe ?",
    answer:
      "Distribuez une grille Printemps après un atelier sur le cycle des plantes, une sortie au jardin ou une observation d'oiseaux dans la cour de récréation.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés de Printemps ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Printemps : partie en ligne immédiate ou PDF A4 avec corrigé pour la maison ou la classe.",
  },
  {
    question: "Existe-t-il des grilles de Printemps par niveau scolaire ?",
    answer:
      "Oui, croisez le thème Printemps avec un niveau via les pages École, ou choisissez la difficulté facile pour les plus jeunes.",
  },
]

export const PRINTEMPS_EXPLORE_LINK_LABELS = [
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Grilles Printemps adaptées aux premiers lecteurs" },
  { href: seasonalPath("paques"), label: "Thème Pâques", hint: "Une fête de la même saison" },
  { href: seasonalPath("ete"), label: "Thème Été", hint: "La saison qui suit le printemps" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de printemps" },
  { href: themePath("meteo"), label: "Thème Météo", hint: "Pour parler de la pluie et du soleil" },
] as const
