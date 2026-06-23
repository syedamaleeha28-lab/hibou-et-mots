import type { CategoryType, FaqItem } from "@/lib/db/types/page-data"
import { getCategoryFaq } from "@/lib/content/category-faqs"

type FaqTemplateSlot = "grade" | "theme" | "combo" | "difficulty" | "audience" | "hub" | "seasonal" | "press"

const FAQ_TEMPLATES: Record<FaqTemplateSlot, FaqItem[]> = {
  grade: [
    {
      question: "Pour quel niveau scolaire sont ces mots mêlés ?",
      answer:
        "Ces grilles sont conçues pour le niveau indiqué sur la page, avec un vocabulaire et une taille de grille adaptés aux élèves de cette classe.",
    },
    {
      question: "Puis-je imprimer ces mots mêlés gratuitement ?",
      answer:
        "Oui, toutes les grilles sont gratuites à imprimer en PDF pour une utilisation en classe ou à la maison.",
    },
    {
      question: "Comment corriger la grille ?",
      answer:
        "Ouvrez la page du puzzle pour afficher la solution, ou utilisez la liste des mots à trouver pour vérifier les réponses des élèves.",
    },
  ],
  theme: [
    {
      question: "Quels mots trouve-t-on dans ces grilles ?",
      answer:
        "Les mots sont liés au thème de la page — animaux, sport, nature, etc. — pour rendre le jeu de mots cachés plus amusant et éducatif.",
    },
    {
      question: "Ces mots mêlés conviennent-ils aux enfants ?",
      answer:
        "Oui, la difficulté est indiquée sur chaque grille. Choisissez « Facile » pour les plus jeunes ou « Moyen » pour un défi supplémentaire.",
    },
    {
      question: "Puis-je créer ma propre grille sur ce thème ?",
      answer:
        "Utilisez notre générateur gratuit pour composer une grille personnalisée avec vos propres mots.",
    },
  ],
  seasonal: [
    {
      question: "Quand utiliser ces mots mêlés de fête ?",
      answer:
        "Ces grilles sont parfaites avant les vacances, en classe ou en famille, pour célébrer la saison ou la fête indiquée.",
    },
    {
      question: "Les grilles sont-elles adaptées à l'école ?",
      answer:
        "Oui, elles peuvent servir d'activité calme en maternelle, au primaire ou en loisirs créatifs.",
    },
  ],
  combo: [
    {
      question: "Qu'est-ce qu'un mots mêlés combiné niveau + thème ?",
      answer:
        "C'est une sélection de grilles qui croisent un niveau scolaire et un thème précis, pour un vocabulaire parfaitement ciblé.",
    },
    {
      question: "Puis-je accéder aux grilles du niveau ou du thème seul ?",
      answer:
        "Oui, utilisez les liens vers la catégorie niveau ou thème pour explorer toutes les grilles disponibles.",
    },
  ],
  difficulty: [
    {
      question: "Quelle difficulté choisir ?",
      answer:
        "Facile pour débuter, Moyen pour un peu de challenge, Difficile pour les experts, et Géant pour les très grandes grilles.",
    },
    {
      question: "La difficulté change-t-elle la taille de la grille ?",
      answer:
        "Oui, plus la difficulté augmente, plus la grille est grande et contient de mots à trouver.",
    },
  ],
  audience: [
    {
      question: "Ces mots mêlés sont-ils adaptés à mon public ?",
      answer:
        "Chaque page cible un public précis — enfants, adultes ou seniors — avec un vocabulaire et une présentation adaptés.",
    },
    {
      question: "Puis-je jouer en ligne ou imprimer ?",
      answer:
        "Les deux ! Jouez directement sur le site ou téléchargez le PDF pour imprimer.",
    },
  ],
  hub: [
    {
      question: "Combien de grilles gratuites proposez-vous ?",
      answer:
        "Notre bibliothèque grandit chaque semaine avec de nouvelles grilles à imprimer et à jouer en ligne, toutes gratuites.",
    },
    {
      question: "Comment trouver un mots mêlés par niveau ou par thème ?",
      answer:
        "Parcourez les sous-catégories ci-dessous ou utilisez la recherche pour trouver rapidement la grille de mots cachés idéale.",
    },
  ],
  press: [
    {
      question: "Ces grilles reprennent-elles le style des magazines ?",
      answer:
        "Nos grilles s'inspirent des formats populaires des journaux et magazines de mots mêlés, adaptés au format web et PDF.",
    },
  ],
}

export function faqSlotForCategoryType(type: CategoryType, isHub: boolean): FaqTemplateSlot {
  if (isHub) return "hub"
  switch (type) {
    case "GRADE":
      return "grade"
    case "THEME":
      return "theme"
    case "SEASONAL":
      return "seasonal"
    case "COMBO":
      return "combo"
    case "DIFFICULTY":
      return "difficulty"
    case "AUDIENCE":
      return "audience"
    case "PRESS_BRAND":
      return "press"
    default:
      return "hub"
  }
}

export function resolveCategoryFaq(
  slug: string,
  type: CategoryType,
  storedFaq: FaqItem[] | null | undefined,
  isHub: boolean,
): FaqItem[] {
  if (storedFaq && storedFaq.length > 0) return storedFaq
  const specific = getCategoryFaq(slug)
  if (specific) return specific
  return FAQ_TEMPLATES[faqSlotForCategoryType(type, isHub)]
}

export function resolvePuzzleFaq(storedFaq: FaqItem[] | null | undefined): FaqItem[] {
  if (storedFaq && storedFaq.length > 0) return storedFaq
  return [
    {
      question: "Comment jouer à ce mots mêlés ?",
      answer:
        "Trouvez tous les mots cachés dans la grille. Les mots peuvent être lus horizontalement, verticalement ou en diagonale, dans les deux sens.",
    },
    {
      question: "Puis-je imprimer cette grille ?",
      answer:
        "Oui, utilisez le bouton « Imprimer » ou téléchargez le PDF pour une version papier optimisée.",
    },
    {
      question: "Où voir la solution ?",
      answer:
        "Cliquez sur « Voir la solution » pour révéler les emplacements des mots dans la grille.",
    },
  ]
}

export const CATEGORY_PAGE_SIZE = 24
