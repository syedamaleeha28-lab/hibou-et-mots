import type { FaqItem } from "@/lib/db/types/page-data"
import { ROUTES } from "@/lib/seo/routes"

/** Homepage — synonym clarification section. */
export const HOME_SYNONYM_DIFFERENCE_TITLE = "Mots mêlés ou mots cachés : quelle différence ?"

export const HOME_SYNONYM_DIFFERENCE_PARAGRAPHS = [
  "En français, « mots mêlés » et « mots cachés » désignent le même type de jeu : une grille de lettres où l'on retrouve une liste de mots cachés horizontalement, verticalement ou en diagonale. Le premier terme insiste sur les lettres mélangées qui remplissent la grille ; le second met l'accent sur la chasse aux mots dissimulés dans ce labyrinthe.",
  "Sur Hibou&Mots, les deux expressions coexistent dans nos titres et nos pages thématiques pour faciliter la recherche — que vous tapiez « mots mêlés animaux » ou « mots cachés Noël », vous accédez aux mêmes grilles gratuites, imprimables ou jouables en ligne. Les règles de lecture (sens normal ou inversé, diagonales autorisées) sont rappelées sur chaque fiche.",
] as const

/** Homepage — editorial approach section. */
export const HOME_PEDAGOGICAL_APPROACH_TITLE = "Notre approche pédagogique"

export const HOME_PEDAGOGICAL_APPROACH_PARAGRAPHS = [
  "Chaque grille est calibrée par niveau scolaire — maternelle à 6e — avec un vocabulaire scolaire aligné sur les cycles du primaire et des thèmes du quotidien. Les listes privilégient des mots utiles en classe : champs lexicaux du programme, saisonnier, géographie ou sport, sans surcharge visuelle pour les plus jeunes.",
  "Les enseignants et les parents peuvent imprimer un PDF avec corrigé, lancer une partie en ligne ou composer une fiche sur mesure via le générateur. Notre guide pédagogique détaille comment en tirer parti pour la lecture, l'orthographe et la compréhension écrite ; des grilles adaptées existent aussi pour les adultes et les seniors.",
] as const

/** Internal links surfaced in new homepage semantic sections. */
export const HOME_SEMANTIC_LINKS = [
  { href: ROUTES.pedagogie, label: "Guide pédagogique des mots mêlés" },
  { href: ROUTES.solutions, label: "Solutions et règles des mots mêlés" },
  { href: ROUTES.seniors, label: "Mots mêlés pour les seniors" },
] as const

/** Additional homepage FAQ items (semantic coverage). */
export const HOME_SEMANTIC_FAQ: FaqItem[] = [
  {
    question: "Quelle est la différence entre mots mêlés et mots cachés ?",
    answer:
      "Ce sont deux noms pour le même jeu de lettres : retrouver des mots dissimulés dans une grille. « Mots mêlés » évoque les lettres entremêlées ; « mots cachés » insiste sur la recherche. Hibou&Mots propose les deux formulations pour vous orienter vers les mêmes grilles gratuites.",
  },
  {
    question: "Les mots mêlés aident-ils les enfants dyslexiques ?",
    answer:
      "Utilisés sans chronomètre, avec des listes courtes et des grilles en grandes lettres, les mots mêlés peuvent soutenir le repérage visuel et la mémorisation des formes de mots dans un cadre ludique et peu anxiogène. Ce n'est pas un dispositif thérapeutique : adaptez la difficulté, validez les progrès et complétez avec l'accompagnement prévu à l'école. Notre guide pédagogique propose des repères par niveau.",
  },
  {
    question: "Combien de nouvelles grilles sont ajoutées ?",
    answer:
      "La bibliothèque s'enrichit régulièrement : comptez environ cinq nouvelles grilles par semaine, réparties entre thèmes, saisons et niveaux scolaires. Toutes restent gratuites, en ligne comme à l'impression, sans inscription.",
  },
]
