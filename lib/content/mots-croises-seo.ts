import { CheckCircle2, HelpCircle, PenLine } from "lucide-react"
import type { HowToPlayStep } from "@/components/templates/shared/how-to-play-block"
import type { FaqItem } from "@/lib/db/types/page-data"

/**
 * Content written to match the REAL mechanic confirmed in
 * lib/mini-crossword/grids.ts: this is not a traditional newspaper-style
 * crossword with many interlocking across+down entries. Each grid has
 * exactly ONE across entry (a longer central word) and several short
 * down entries, each crossing one letter of that central word. Force 3's
 * TIER_COPY already describes this correctly ("un mot central de cinq
 * lettres et cinq définitions verticales à croiser") — this content
 * extends that same accurate framing rather than describing a generic
 * crossword that doesn't match what's actually on the page.
 */

export const MOTS_CROISES_INTRO_PARAGRAPHS: string[] = [
  "Nos mini mots croisés suivent un format un peu différent des grilles de journaux : un mot central, plus long, sert de colonne vertébrale à la grille, et chaque lettre de ce mot est le point de départ d'un petit mot vertical à deviner grâce à sa définition. Pas de grande grille à remplir — l'objectif est de compléter les définitions qui entourent le mot central pour le faire apparaître.",
  "Ce format convient particulièrement bien aux enfants qui découvrent les mots croisés : moins intimidant qu'une grille de journal, il permet de se concentrer sur quelques définitions à la fois tout en gardant le plaisir de croiser des mots. Cinq niveaux de difficulté, de Force 1 à Force 5, font progresser la taille du mot central et le nombre de définitions, du plus simple au plus exigeant.",
]

export const MOTS_CROISES_HOW_TO_PLAY: {
  eyebrow: string
  title: string
  description: string
  steps: HowToPlayStep[]
} = {
  eyebrow: "Comment jouer",
  title: "3 étapes pour réussir un mini mots croisés",
  description:
    "Le principe : devine les petits mots grâce à leur définition, et découvre le mot central qu'ils dessinent ensemble.",
  steps: [
    {
      icon: HelpCircle,
      title: "Lis les définitions",
      text: "Chaque définition correspond à un petit mot vertical, aligné avec une lettre du mot central.",
    },
    {
      icon: PenLine,
      title: "Complète les mots verticaux",
      text: "Devine chaque mot grâce à sa définition et inscris-le dans la grille, lettre par lettre.",
    },
    {
      icon: CheckCircle2,
      title: "Découvre le mot central",
      text: "Une fois les mots verticaux complétés, le mot central se lit horizontalement au milieu de la grille.",
    },
  ],
}

export const MOTS_CROISES_FAQ: FaqItem[] = [
  {
    question: "Quelle est la différence avec un mots croisés classique ?",
    answer:
      "Nos mini mots croisés utilisent un format compact : un seul mot central, entouré de petites définitions verticales qui croisent chacune une de ses lettres. C'est plus rapide à résoudre qu'une grande grille de journal, tout en gardant le principe de croiser les mots.",
  },
  {
    question: "À partir de quel âge peut-on commencer les mots croisés ?",
    answer:
      "Dès le CE1-CE2 pour le niveau Force 1, qui utilise une petite grille et un vocabulaire courant. Les niveaux suivants conviennent ensuite aux enfants plus à l'aise, jusqu'au collège pour Force 4 et 5.",
  },
  {
    question: "Comment choisir son niveau de difficulté ?",
    answer:
      "Force 1 est le plus accessible, avec un mot central court et peu de définitions. La difficulté augmente progressivement jusqu'à Force 5, avec un mot central plus long et davantage de définitions à croiser.",
  },
  {
    question: "Peut-on imprimer les grilles de mots croisés ?",
    answer:
      "Oui, toutes nos grilles de mini mots croisés sont disponibles gratuitement en PDF à imprimer, en plus de la version jouable en ligne.",
  },
]
