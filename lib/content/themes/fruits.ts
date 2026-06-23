import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"

/** Unique editorial intro for /mots-meles-thematiques/fruits/ (~300 words). */
export const FRUITS_INTRO = [
  "Le thème Fruits de Hibou&Mots propose des mots mêlés gratuits et des jeux de mots cachés pour faire vivre le vocabulaire fruits en français. Chaque grille invite à retrouver des noms gourmands du quotidien : la pomme croquante et la poire du verger, la banane et l'orange dans le panier, le raisin en grappe, la fraise et la cerise d'été. Les listes s'ouvrent aussi sur kiwi, ananas et mangue pour les saveurs plus lointaines, et la pastèque — mot long très visible — conclut souvent une série estivale.",
  "Ces puzzles deviennent une activité éducative légère autour de l'alimentation : nommer un fruit, l'associer à une couleur ou à une saison, sans transformer le cours en fiche rébarbative. Trouver un mot caché ancre la forme orthographique du mot entier ; c'est un complément ludique à la lecture en maternelle et au primaire. Le vocabulaire fruits progresse avec l'âge — mots courts d'abord, puis ananas, mangue ou pastèque lorsque l'élève lit déjà des syllabes multiples.",
  "En classe, les enseignants utilisent les grilles avant une dégustation, après une sortie au marché ou dans une séquence « alimentation équilibrée » du cycle 2. Les familles impriment un PDF pour un goûter du mercredi ou pour préparer une liste de courses imaginaire. Chaque puzzle se joue en ligne ou s'exporte en PDF A4 avec corrigé, en noir et blanc pour une impression économique.",
  "Hibou&Mots reste gratuit, sans inscription. Les séries alternent verger français, fruits d'été et fruits exotiques pour garder de la variété. Croisez le thème avec un niveau scolaire — maternelle, CP ou CE1 — ou choisissez une difficulté facile, moyenne ou difficile selon la classe. Le lexique alimentaire devient ainsi un fil concret entre programme de français et vie quotidienne à la cantine comme à la maison.",
].join("\n\n")

export const FRUITS_META_DESCRIPTION =
  "Mots mêlés et mots cachés fruits gratuits : pomme, poire, banane, orange, fraise, kiwi, mangue. Vocabulaire fruits et activité éducative sur l'alimentation — à imprimer ou à jouer en ligne."

export const FRUITS_FAQ: FaqItem[] = [
  {
    question: "Quels fruits figurent dans les grilles de ce thème ?",
    answer:
      "Les listes mêlent fruits courants et plus exotiques : pomme, poire, banane, orange, raisin, fraise, kiwi, ananas, mangue ou pastèque, selon la grille choisie.",
  },
  {
    question: "Comment utiliser ce thème autour de l'alimentation en classe ?",
    answer:
      "Distribuez une grille avant une dégustation, après une sortie au marché ou dans une séquence sur l'alimentation équilibrée : les élèves repèrent le vocabulaire fruits pendant un temps calme.",
  },
  {
    question: "À quel niveau proposer ces mots mêlés fruits ?",
    answer:
      "Dès la maternelle avec des grilles Fruits courtes ; le CP et le CE1 accueillent ananas, mangue ou pastèque, avec un vocabulaire fruits plus riche.",
  },
  {
    question: "Peut-on jouer en ligne ou imprimer les grilles Fruits ?",
    answer:
      "Les deux modes sont disponibles sur la rubrique Fruits : partie en ligne ou PDF A4 avec corrigé pour la maison et la classe.",
  },
  {
    question: "Le vocabulaire fruits inclut-il des fruits exotiques ?",
    answer:
      "Oui, certaines grilles ajoutent kiwi, ananas ou mangue aux fruits de verger, pour élargir le lexique sans quitter un niveau adapté à l'âge.",
  },
]

export const FRUITS_EXPLORE_LINK_LABELS = [
  { href: gradePath("maternelle"), label: "Mots mêlés Maternelle", hint: "Premiers mots courts : pomme, poire, kiwi" },
  { href: gradePath("cp"), label: "Mots mêlés CP", hint: "Vocabulaire fruits adapté au cycle 2" },
  { href: ROUTES.enfants, label: "Mots mêlés Enfants", hint: "Toutes les grilles pour les 3–12 ans" },
  { href: ROUTES.imprimer, label: "Mots mêlés à imprimer", hint: "PDF A4 avec corrigé pour la classe ou la maison" },
  { href: ROUTES.jouer, label: "Jouer en ligne", hint: "Partie immédiate sans impression" },
  { href: ROUTES.generateur, label: "Générateur de grilles", hint: "Composez votre propre liste de fruits" },
  { href: ROUTES.ecoleHub, label: "Mots mêlés École", hint: "Parcours par niveau de la maternelle à la 6e" },
  { href: themePath("animaux"), label: "Thème Animaux", hint: "Variez avec un autre thème nature" },
] as const
