import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, seasonalPath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-fetes-saisons/paques/ (~300 words). */
export const PAQUES_INTRO = [
  "Le thème Pâques de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour retrouver le vocabulaire de cette fête de printemps en français. Chaque grille rassemble les mots que les enfants associent à Pâques : l'œuf en chocolat, les cloches qui reviennent de Rome, le lapin et la poule, le poussin tout jaune, le panier pour la chasse aux œufs, et l'agneau du repas de Pâques. Les listes s'ouvrent aussi sur le dimanche de Pâques, la jonquille qui fleurit au même moment et la cocotte en chocolat offerte aux plus petits.",
  "Ces puzzles deviennent une activité éducative légère pour accompagner les vacances de printemps : occuper un moment calme avant la chasse aux œufs, préparer une carte de Pâques ou réviser le vocabulaire saisonnier avant les grandes vacances. Trouver un mot caché fixe la forme orthographique du mot entier — cloche, lapin, panier — et prolonge en douceur les apprentissages de lecture sans donner l'impression de « faire l'école » pendant les vacances.",
  "En classe, les enseignants utilisent les grilles Pâques juste avant les vacances de printemps, en complément d'un album sur le renouveau ou d'une activité de arts plastiques autour des œufs décorés. Les familles impriment un PDF pour les longs trajets ou une après-midi pluvieuse. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les grilles Pâques alternent objets de la chasse aux œufs et animaux du printemps pour garder de la variété. Croisez le thème avec un niveau scolaire — CP ou CE1 — ou explorez le thème Printemps pour prolonger la saison au-delà de la fête elle-même.",
].join("\n\n")

export const PAQUES_META_DESCRIPTION =
  "Mots mêlés et mots cachés de Pâques gratuits : œuf, cloches, lapin, poule, panier, chasse aux œufs. À imprimer en PDF ou à jouer en ligne, pour la maison et la classe."

export const PAQUES_FAQ: FaqItem[] = [
  {
    question: "Quels mots retrouve-t-on dans les grilles de Pâques ?",
    answer:
      "Les listes Pâques mêlent œuf, cloches, chocolat, lapin, poule, poussin, panier, chasse aux œufs, agneau et jonquille, selon la grille choisie.",
  },
  {
    question: "Ce thème Pâques convient-il aux enfants de maternelle et de CP ?",
    answer:
      "Oui, commencez par œuf, lapin ou poule en grilles courtes et grandes lettres — idéal en maternelle et au CP, avant de passer à des mots plus longs comme chocolat ou panier en CE1.",
  },
  {
    question: "Comment utiliser ce thème en classe avant les vacances de printemps ?",
    answer:
      "Distribuez une grille Pâques en dernière séance avant les vacances, en complément d'un album sur le printemps ou d'une activité manuelle autour des œufs décorés — un moment calme et festif à la fois.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés de Pâques ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Pâques : partie en ligne immédiate ou PDF A4 avec corrigé pour la maison, la classe ou un trajet en voiture.",
  },
  {
    question: "Existe-t-il des grilles de Pâques par niveau scolaire ?",
    answer:
      "Oui, croisez le thème Pâques avec un niveau via les pages École, ou choisissez la difficulté facile pour les plus jeunes et moyenne pour les enfants qui lisent déjà couramment.",
  },
]

export const PAQUES_EXPLORE_LINK_LABELS = [
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Grilles Pâques adaptées aux premiers lecteurs" },
  { href: seasonalPath("printemps"), label: "Thème Printemps", hint: "Prolonger la saison au-delà de Pâques" },
  { href: seasonalPath("carnaval"), label: "Thème Carnaval", hint: "Une autre fête de la même période" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de Pâques" },
  { href: themePath("famille"), label: "Thème Famille", hint: "Pour un repas de Pâques en famille" },
] as const
