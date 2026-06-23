import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, comboPath, gradePath, seasonalPath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-fetes-saisons/halloween/ (~300 words). */
export const HALLOWEEN_INTRO = [
  "Le thème Halloween de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés Halloween pour enrichir le vocabulaire d'automne en français. Chaque grille plonge dans l'ambiance d'octobre : une citrouille sculptée brille sur le perron, un fantôme flotte entre les branches, une sorcière s'envole sur son balai pendant qu'un vampire attend le crépuscule. Les chauve-souris tournent autour du clocher, l'araignée tisse sa toile dans l'angle de la fenêtre et le squelette s'anime pour la parade — des mots que les enfants croisent dans les décorations, les déguisements et les histoires du soir.",
  "Les listes conviennent à une activité Halloween calme, en classe comme à la maison avant la fête des bonbons. Trouver un mot caché renforce la mémoire visuelle du mot entier et soutient la lecture en maternelle comme au primaire, sans transformer la soirée en exercice rébarbatif. Maternelle et CP débutent avec des grilles courtes ; CE1 et CE2 ajoutent diagonales et monstres au vocabulaire plus imagé.",
  "En octobre, les enseignants impriment les PDF pour la dernière semaine d'automne : échauffement avant une lecture effrayante, fiche distribuée après l'atelier déguisement ou support pour un goûter festif. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression simple. Les grilles varient d'une série à l'autre — château hanté, forêt sombre, soirée monstres — pour conserver la surprise.",
  "Hibou&Mots reste gratuit, sans inscription. Explorez aussi CE1 × Halloween si vous cherchez une liste calibrée à la classe, ou basculez vers le thème Noël lorsque décembre arrive. Le lexique d'Halloween relie ainsi le programme de français à une fête que les enfants attendent avec impatience — du premier déguisement aux bonbons glissés dans le panier.",
].join("\n\n")

export const HALLOWEEN_META_DESCRIPTION =
  "Mots mêlés et mots cachés Halloween gratuits : citrouille, fantôme, sorcière, vampire, bonbons, déguisement. Vocabulaire Halloween à imprimer ou à jouer en ligne pour la maternelle et le primaire."

export const HALLOWEEN_FAQ: FaqItem[] = [
  {
    question: "Quels mots d'Halloween figurent dans les grilles ?",
    answer:
      "Les listes Halloween mêlent le lexique d'octobre : citrouille, fantôme, sorcière, vampire, chauve-souris, monstre, bonbons, déguisement, araignée ou squelette, selon la grille choisie.",
  },
  {
    question: "Quand utiliser ces mots cachés Halloween en classe ?",
    answer:
      "Idéal en octobre sur la page Halloween : activité calme après un atelier déguisement ou fiche à distribuer avant la Toussaint.",
  },
  {
    question: "Ces grilles conviennent-elles aux plus jeunes ?",
    answer:
      "Oui : commencez par des grilles Halloween faciles en maternelle ou CP — citrouille, bonbons, fantôme — sans vocabulaire trop anxiogène.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les mots mêlés Halloween ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Halloween : partie en ligne ou PDF A4 avec corrigé pour la maison et la classe.",
  },
  {
    question: "Existe-t-il des grilles Halloween par niveau scolaire ?",
    answer:
      "Oui, croisez le thème avec un niveau — par exemple CE1 × Halloween — pour une liste calibrée à la classe, ou choisissez une difficulté facile pour les débutants.",
  },
]

export const HALLOWEEN_EXPLORE_LINK_LABELS = [
  { href: comboPath("ce1", "halloween"), label: "Mots mêlés CE1 × Halloween", hint: "Vocabulaire Halloween calibré pour le CE1" },
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Grilles adaptées aux premières classes" },
  { href: ROUTES.fetesHub, label: "Fêtes & Saisons", hint: "Noël, Pâques, Carnaval et plus" },
  { href: seasonalPath("noel"), label: "Mots mêlés Noël", hint: "Poursuivre avec la fête de fin d'année" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé pour la classe ou la maison" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans préparation" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de mots d'Halloween" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
] as const
