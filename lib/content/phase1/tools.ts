import type { FaqItem } from "@/lib/db/types/page-data"
import { HOME_SEMANTIC_FAQ } from "@/lib/content/home"

/** Phase 1 — editorial + FAQ for tool pages (no DB category). */

export const GENERATOR_FAQ: FaqItem[] = [
  {
    question: "Le générateur est-il vraiment gratuit ?",
    answer:
      "Oui, le générateur Hibou&Mots est entièrement gratuit, sans limite de grilles créées et sans inscription.",
  },
  {
    question: "Puis-je choisir mes propres mots pour créer une grille personnalisée ?",
    answer:
      "Oui, saisissez librement votre liste de mots — un mot par ligne ou séparés par des virgules — puis générez la grille.",
  },
  {
    question: "Puis-je télécharger ma grille en PDF après l'avoir créée ?",
    answer:
      "Oui, utilisez le bouton Imprimer ou exportez via la page mots mêlés à imprimer pour obtenir un PDF A4 avec corrigé.",
  },
  {
    question: "Combien de mots puis-je inclure dans une grille ?",
    answer:
      "Cela dépend de la taille de grille : comptez 6 à 8 mots courts pour une grille 8×8, jusqu'à 15–20 mots pour une grille 12×12 ou plus.",
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
  ...HOME_SEMANTIC_FAQ,
]
