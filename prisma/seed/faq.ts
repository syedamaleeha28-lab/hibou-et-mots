import type { FaqItem } from "@/lib/db/types/page-data"
import type { CategoryType } from "@/lib/db/types/page-data"

type FaqTemplateSlot =
  | "grade"
  | "theme"
  | "combo"
  | "difficulty"
  | "audience"
  | "hub"
  | "seasonal"
  | "press"
  | "static"

const FAQ_PLACEHOLDERS: Record<FaqTemplateSlot, FaqItem[]> = {
  hub: [
    {
      question: "Combien de grilles gratuites proposez-vous ?",
      answer:
        "Notre bibliothèque grandit chaque semaine avec de nouvelles grilles à imprimer et à jouer en ligne, toutes gratuites.",
    },
    {
      question: "Comment trouver un mots mêlés par niveau ou par thème ?",
      answer:
        "Parcourez les sous-catégories ci-dessous ou utilisez la recherche pour trouver rapidement la grille idéale.",
    },
  ],
  grade: [
    {
      question: "Pour quel niveau scolaire sont ces mots mêlés ?",
      answer:
        "Ces grilles sont conçues pour le niveau indiqué sur la page, avec un vocabulaire et une taille de grille adaptés.",
    },
    {
      question: "Puis-je imprimer ces mots mêlés gratuitement ?",
      answer: "Oui, toutes les grilles sont gratuites à imprimer en PDF pour la classe ou la maison.",
    },
  ],
  theme: [
    {
      question: "Quels mots trouve-t-on dans ces grilles ?",
      answer:
        "Les mots sont liés au thème de la page pour rendre le jeu plus amusant et éducatif.",
    },
    {
      question: "Ces mots mêlés conviennent-ils aux enfants ?",
      answer:
        "Oui, la difficulté est indiquée sur chaque grille. Choisissez « Facile » pour les plus jeunes.",
    },
  ],
  seasonal: [
    {
      question: "Quand utiliser ces mots mêlés de fête ?",
      answer:
        "Ces grilles sont parfaites avant les vacances, en classe ou en famille, pour célébrer la saison indiquée.",
    },
    {
      question: "Les grilles sont-elles adaptées à l'école ?",
      answer: "Oui, elles peuvent servir d'activité calme en maternelle, au primaire ou en loisirs créatifs.",
    },
  ],
  combo: [
    {
      question: "Qu'est-ce qu'un mots mêlés combiné niveau + thème ?",
      answer:
        "C'est une sélection de grilles qui croisent un niveau scolaire et un thème précis, pour un vocabulaire ciblé.",
    },
    {
      question: "Puis-je accéder aux grilles du niveau ou du thème seul ?",
      answer: "Oui, utilisez les liens vers la catégorie niveau ou thème pour explorer toutes les grilles.",
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
      answer: "Oui, plus la difficulté augmente, plus la grille est grande et contient de mots à trouver.",
    },
  ],
  audience: [
    {
      question: "Ces mots mêlés sont-ils adaptés à mon public ?",
      answer:
        "Chaque page cible un public précis — enfants, adultes ou seniors — avec un vocabulaire adapté.",
    },
    {
      question: "Puis-je jouer en ligne ou imprimer ?",
      answer: "Les deux ! Jouez directement sur le site ou téléchargez le PDF pour imprimer.",
    },
  ],
  press: [
    {
      question: "Ces grilles reprennent-elles le style des magazines ?",
      answer:
        "Nos grilles s'inspirent des formats populaires des journaux et magazines de mots mêlés, adaptés au web et au PDF.",
    },
  ],
  static: [
    {
      question: "Ces ressources sont-elles gratuites ?",
      answer: "Oui, toutes les ressources et grilles liées sur cette page sont gratuites.",
    },
    {
      question: "Puis-je les utiliser en classe ?",
      answer:
        "Oui, les enseignants peuvent imprimer et distribuer les grilles pour leurs élèves sans inscription.",
    },
  ],
}

export function faqPlaceholderFor(
  type: CategoryType,
  options: { isHub?: boolean; isSeasonal?: boolean; isStaticSupport?: boolean },
): FaqItem[] {
  if (options.isStaticSupport) return FAQ_PLACEHOLDERS.static
  if (options.isHub) return FAQ_PLACEHOLDERS.hub
  if (type === "SEASONAL" || options.isSeasonal) return FAQ_PLACEHOLDERS.seasonal
  switch (type) {
    case "GRADE":
      return FAQ_PLACEHOLDERS.grade
    case "THEME":
      return FAQ_PLACEHOLDERS.theme
    case "COMBO":
      return FAQ_PLACEHOLDERS.combo
    case "DIFFICULTY":
      return FAQ_PLACEHOLDERS.difficulty
    case "AUDIENCE":
      return FAQ_PLACEHOLDERS.audience
    case "PRESS_BRAND":
      return FAQ_PLACEHOLDERS.press
    default:
      return FAQ_PLACEHOLDERS.hub
  }
}
