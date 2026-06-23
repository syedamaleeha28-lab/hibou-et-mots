import type { FaqItem } from "@/lib/db/types/page-data"

/** Phase 1 Critical — page-specific FAQs (Sprint 1). */
export const PHASE1_FAQS: Record<string, FaqItem[]> = {
  "hub-gratuits": [
    {
      question: "Faut-il créer un compte pour jouer gratuitement ?",
      answer:
        "Non, aucune inscription n'est nécessaire pour jouer en ligne, imprimer un PDF ou utiliser le générateur de grilles.",
    },
    {
      question: "Y a-t-il une limite au nombre de grilles imprimables gratuitement ?",
      answer:
        "Non, l'ensemble du catalogue publié est accessible sans limite de téléchargement ni palier payant caché.",
    },
    {
      question: "Le générateur de grilles personnalisées est-il aussi gratuit ?",
      answer:
        "Oui, créer sa propre grille avec ses propres mots est entièrement gratuit et utilisable sans limite.",
    },
    {
      question: "Y a-t-il des publicités sur les pages de jeu ?",
      answer:
        "Hibou&Mots est conçu pour les enfants et les familles : pas de publicité intrusive sur les pages de jeu et de puzzle.",
    },
  ],
  "hub-imprimer": [
    {
      question: "Le corrigé est-il inclus dans le PDF ?",
      answer:
        "Oui, chaque PDF contient la grille sur la première page et sa solution sur la page suivante, prête pour les enseignants.",
    },
    {
      question: "Faut-il une imprimante couleur ?",
      answer:
        "Non, toutes les grilles sont conçues pour une impression noir et blanc sans perte de lisibilité.",
    },
    {
      question: "Puis-je imprimer plusieurs grilles en une fois pour la classe ?",
      answer:
        "Oui, parcourez une catégorie thématique ou scolaire et téléchargez autant de mots mêlés — jeux de mots cachés — que nécessaire pour vos élèves.",
    },
  ],
  enfants: [
    {
      question: "Mon enfant de 5 ans peut-il déjà faire des mots mêlés ?",
      answer:
        "Oui, dès la maternelle avec des grilles 6×6 en grandes lettres et un vocabulaire très court, adapté aux premiers repérages visuels.",
    },
    {
      question: "Les mots mêlés aident-ils vraiment à apprendre l'orthographe ?",
      answer:
        "Ils renforcent la mémorisation visuelle du mot entier, en complément de la lecture et de la dictée à l'école.",
    },
    {
      question: "Peut-on imprimer plusieurs grilles à la fois pour la classe ?",
      answer:
        "Oui, chaque grille est disponible en PDF A4, idéale pour une distribution en classe ou un devoir maison.",
    },
  ],
  "hub-ecole": [
    {
      question: "Comment les grilles sont-elles adaptées à chaque niveau ?",
      answer:
        "La taille de la grille, la longueur des mots et les directions autorisées augmentent progressivement, du cycle 1 au collège.",
    },
    {
      question: "Les grilles suivent-elles le programme officiel ?",
      answer:
        "Elles s'appuient sur le vocabulaire courant de chaque niveau scolaire, sans être liées à un manuel précis.",
    },
    {
      question: "Y a-t-il des grilles pour la 6e ?",
      answer:
        "Oui, avec des mots plus longs, des grilles jusqu'à 15×15 et toutes les directions de lecture, y compris inversées.",
    },
  ],
}

export function getPhase1Faq(slug: string): FaqItem[] | undefined {
  return PHASE1_FAQS[slug]
}
