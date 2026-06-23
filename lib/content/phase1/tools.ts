import type { FaqItem } from "@/lib/db/types/page-data"

/** Phase 1 — editorial + FAQ for tool pages (no DB category). */

export const GENERATOR_FAQ: FaqItem[] = [
  {
    question: "Puis-je utiliser n'importe quels mots ?",
    answer:
      "Oui, vous pouvez saisir librement vos propres mots. Le générateur place ensuite la liste dans une grille de mots mêlés — un jeu de mots cachés — adaptée à la taille choisie.",
  },
  {
    question: "La grille générée peut-elle être imprimée ?",
    answer:
      "Oui, utilisez le bouton Imprimer ou ouvrez le générateur complet pour exporter une grille prête à l'emploi.",
  },
  {
    question: "Existe-t-il une limite au nombre de grilles que je peux créer ?",
    answer: "Non, le générateur est utilisable sans limite et sans inscription.",
  },
]

export const ONLINE_PLAY_FAQ: FaqItem[] = [
  {
    question: "Dois-je installer une application pour jouer ?",
    answer:
      "Non, le jeu fonctionne directement dans votre navigateur, sur ordinateur, tablette ou smartphone.",
  },
  {
    question: "Puis-je changer de thème en cours de partie ?",
    answer:
      "Oui, lancez une nouvelle grille avec un thème ou une difficulté différente à tout moment.",
  },
  {
    question: "Le jeu en ligne fonctionne-t-il hors connexion ?",
    answer:
      "Non, une connexion internet est nécessaire pour le mode en ligne ; pour jouer sans connexion, imprimez une grille en PDF.",
  },
]

export const HOME_FAQ: FaqItem[] = [
  {
    question: "Les mots mêlés Hibou&Mots sont-ils vraiment gratuits ?",
    answer:
      "Oui, l'intégralité des grilles publiées est accessible gratuitement, en ligne comme à l'impression, sans création de compte obligatoire.",
  },
  {
    question: "À partir de quel âge peut-on commencer les mots mêlés ?",
    answer:
      "Dès la maternelle (3–4 ans) avec des grilles courtes en grandes lettres ; la difficulté augmente ensuite jusqu'au collège, puis pour les adultes et seniors.",
  },
  {
    question: "Peut-on imprimer les grilles pour la classe ?",
    answer:
      "Oui, chaque grille est disponible en PDF A4 avec corrigé sur la deuxième page, adapté à un usage en classe ou à la maison.",
  },
  {
    question: "Comment sont créées les grilles ?",
    answer:
      "Les grilles du catalogue sont générées par notre moteur de puzzle puis vérifiées avant publication ; le générateur public permet aussi de créer des jeux de mots cachés personnalisés à la volée.",
  },
]
