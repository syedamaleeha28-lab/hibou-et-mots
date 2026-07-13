import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, seasonalPath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-fetes-saisons/ete/ (~300 words). */
export const ETE_INTRO = [
  "Le thème Été de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour retrouver le vocabulaire des grandes vacances en français. Chaque grille rassemble les mots de la saison chaude : le soleil qui tape, la plage et le sable, la mer où l'on se baigne, la glace qui fond vite, le parasol planté dans le sable, le maillot de bain et la crème solaire indispensable avant de sortir. Les listes s'ouvrent aussi sur les vacances tant attendues et le barbecue du soir.",
  "Ces puzzles deviennent une activité éducative légère pour occuper les longues journées d'été : un moment calme à l'ombre, une activité de camping ou de colonie de vacances, ou simplement de quoi patienter avant la baignade. Trouver un mot caché fixe la forme orthographique du mot entier — plage, soleil, glace — et évite que le vocabulaire scolaire ne s'efface complètement pendant deux mois de coupure.",
  "En classe, les enseignants utilisent les grilles Été lors de la dernière semaine de juin, en guise d'activité calme avant les grandes vacances ou pendant une séquence sur les saisons. Les familles impriment un PDF pour la voiture, le camping ou la plage elle-même — la grille supporte bien le sable et le soleil, contrairement à un écran. Chaque puzzle se joue aussi en ligne ou s'exporte en PDF A4 avec corrigé.",
  "Hibou&Mots reste gratuit, sans inscription. Les grilles Été alternent vocabulaire de la plage et de la maison de vacances pour garder de la variété. Croisez le thème avec un niveau scolaire — CP ou CE1 — ou explorez le thème Printemps pour couvrir toute la belle saison.",
].join("\n\n")

export const ETE_META_DESCRIPTION =
  "Mots mêlés et mots cachés d'été gratuits : soleil, plage, mer, vacances, glace, parasol. À imprimer en PDF ou à jouer en ligne, pour la maison, le camping ou la classe."

export const ETE_FAQ: FaqItem[] = [
  {
    question: "Quels mots retrouve-t-on dans les grilles d'Été ?",
    answer:
      "Les listes Été mêlent soleil, plage, mer, vacances, glace, parasol, maillot de bain, crème solaire, sable et barbecue, selon la grille choisie.",
  },
  {
    question: "Ce thème Été convient-il aux enfants de maternelle et de CP ?",
    answer:
      "Oui, commencez par mer, glace ou sable en grilles courtes et grandes lettres — idéal en maternelle et au CP, avant des mots plus longs comme parasol ou vacances en CE1.",
  },
  {
    question: "Quand utiliser ce thème Été en classe ?",
    answer:
      "Lors de la dernière semaine de juin ou pendant une séquence sur les saisons, en activité calme avant les grandes vacances.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés d'Été ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Été : partie en ligne immédiate ou PDF A4 avec corrigé, pratique pour le camping ou un trajet en voiture.",
  },
  {
    question: "Existe-t-il des grilles d'Été par niveau scolaire ?",
    answer:
      "Oui, croisez le thème Été avec un niveau via les pages École, ou choisissez la difficulté facile pour les plus jeunes vacanciers.",
  },
]

export const ETE_EXPLORE_LINK_LABELS = [
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Grilles Été adaptées aux premiers lecteurs" },
  { href: seasonalPath("printemps"), label: "Thème Printemps", hint: "La saison qui précède l'été" },
  { href: seasonalPath("rentree"), label: "Thème Rentrée", hint: "Après les vacances d'été" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé, idéal pour le camping" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste d'été" },
  { href: themePath("meteo"), label: "Thème Météo", hint: "Pour parler du soleil et de la chaleur" },
] as const
