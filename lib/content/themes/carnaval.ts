import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, seasonalPath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-fetes-saisons/carnaval/ (~300 words). */
export const CARNAVAL_INTRO = [
  "Le thème Carnaval de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour retrouver le vocabulaire haut en couleur de cette fête de février en français. Chaque grille rassemble les mots du défilé : le déguisement choisi avec soin, le masque qui cache le visage, les confettis qui volent, le costume de clown, le char décoré et les paillettes qui brillent. Les listes s'ouvrent aussi sur la fanfare qui accompagne le défilé, la majorette et le fameux Mardi gras, point culminant de la période.",
  "Ces puzzles deviennent une activité éducative légère pour accompagner la période du Carnaval, entre janvier et mars selon les régions : préparer un déguisement, décorer un masque en carton ou simplement patienter avant les vacances d'hiver. Trouver un mot caché fixe la forme orthographique du mot entier — masque, déguisement, confettis — et prolonge en douceur les apprentissages de lecture dans une ambiance festive plutôt que scolaire.",
  "En classe, les enseignants utilisent les grilles Carnaval en février ou mars, avant les vacances d'hiver, pour ancrer le lexique festif après un atelier déguisement ou un défilé dans la cour de récréation. Les familles impriment un PDF pour occuper un mercredi après-midi ou accompagner la préparation d'un costume. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les grilles Carnaval alternent vocabulaire du défilé et des costumes pour garder de la variété. Croisez le thème avec un niveau scolaire — CP ou CE1 — ou explorez le thème Pâques pour prolonger les fêtes du début d'année vers le printemps.",
].join("\n\n")

export const CARNAVAL_META_DESCRIPTION =
  "Mots mêlés et mots cachés de Carnaval gratuits : déguisement, masque, défilé, confettis, costume, char. À imprimer en PDF ou à jouer en ligne, pour la maison et la classe."

export const CARNAVAL_FAQ: FaqItem[] = [
  {
    question: "Quels mots retrouve-t-on dans les grilles de Carnaval ?",
    answer:
      "Les listes Carnaval mêlent déguisement, masque, défilé, confettis, costume, char, fanfare, clown, paillettes et majorette, selon la grille choisie.",
  },
  {
    question: "Ce thème Carnaval convient-il aux enfants de maternelle et de CP ?",
    answer:
      "Oui, commencez par masque, char ou clown en grilles courtes et grandes lettres — idéal en maternelle et au CP, avant des mots plus longs comme déguisement ou confettis en CE1.",
  },
  {
    question: "Quand utiliser ce thème Carnaval en classe ?",
    answer:
      "En février ou mars, avant les vacances d'hiver, pour ancrer le lexique Carnaval après un atelier déguisement ou un défilé dans la cour de récréation.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés de Carnaval ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Carnaval : partie en ligne immédiate ou PDF A4 avec corrigé pour la maison, la classe ou un mercredi après-midi.",
  },
  {
    question: "Existe-t-il des grilles de Carnaval par niveau scolaire ?",
    answer:
      "Oui, croisez le thème Carnaval avec un niveau via les pages École, ou choisissez la difficulté facile pour les plus jeunes.",
  },
]

export const CARNAVAL_EXPLORE_LINK_LABELS = [
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Grilles Carnaval adaptées aux premiers lecteurs" },
  { href: seasonalPath("paques"), label: "Thème Pâques", hint: "Poursuivre les fêtes vers le printemps" },
  { href: seasonalPath("printemps"), label: "Thème Printemps", hint: "La saison qui suit le Carnaval" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de Carnaval" },
  { href: themePath("couleurs"), label: "Thème Couleurs", hint: "Pour associer costumes et couleurs" },
] as const
