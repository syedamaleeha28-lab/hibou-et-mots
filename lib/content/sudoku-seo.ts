import { CheckCircle2, Grid3x3, Hash } from "lucide-react"
import type { HowToPlayStep } from "@/components/templates/shared/how-to-play-block"
import type { FaqItem } from "@/lib/db/types/page-data"

export const SUDOKU_INTRO_PARAGRAPHS: string[] = [
  "Le sudoku est un jeu de logique qui se joue sur une grille de 9×9 cases, elle-même divisée en neuf carrés de 3×3. Le but est de remplir chaque case avec un chiffre de 1 à 9, de façon à ce qu'un même chiffre n'apparaisse jamais deux fois dans une même ligne, une même colonne, ou un même carré de 3×3.",
  "Contrairement à ce qu'on pourrait penser, le sudoku ne demande aucune connaissance en calcul : c'est un pur exercice de logique et d'observation, ce qui en fait une activité accessible dès le CP, à condition de commencer par des grilles simples avec beaucoup de chiffres déjà placés.",
  "Nos grilles sont proposées en deux niveaux : facile, avec de nombreux chiffres déjà remplis pour bien démarrer, et difficile, pour ceux qui veulent un vrai défi de concentration. Chaque grille a une solution unique — un vrai sudoku n'a jamais deux façons différentes d'être complété.",
]

export const SUDOKU_HOW_TO_PLAY: {
  eyebrow: string
  title: string
  description: string
  steps: HowToPlayStep[]
} = {
  eyebrow: "Comment jouer",
  title: "3 étapes pour réussir un sudoku",
  description: "Les règles du sudoku en quelques mots : logique, observation, et aucune case en double.",
  steps: [
    {
      icon: Grid3x3,
      title: "Observe la grille",
      text: "Repère les chiffres déjà présents dans chaque ligne, colonne et carré de 3×3 — ce sont tes indices.",
    },
    {
      icon: Hash,
      title: "Place les chiffres",
      text: "Remplis une case vide avec un chiffre de 1 à 9 qui n'apparaît pas déjà dans sa ligne, sa colonne ou son carré.",
    },
    {
      icon: CheckCircle2,
      title: "Complète sans erreur",
      text: "Continue jusqu'à ce que toute la grille soit remplie, sans qu'aucun chiffre ne se répète.",
    },
  ],
}

export const SUDOKU_FAQ: FaqItem[] = [
  {
    question: "Comment jouer au sudoku pour la première fois ?",
    answer:
      "Commence par une grille facile, avec beaucoup de chiffres déjà donnés. Cherche d'abord les lignes, colonnes ou carrés où il ne manque qu'un seul chiffre — c'est souvent le point de départ le plus simple.",
  },
  {
    question: "Le sudoku est-il adapté aux enfants ?",
    answer:
      "Oui, dès le CP avec des grilles simples. C'est une excellente activité pour développer la concentration et le raisonnement logique, sans avoir besoin de savoir calculer — seuls des chiffres de 1 à 9 sont utilisés, comme de simples symboles.",
  },
  {
    question: "Y a-t-il toujours une seule solution possible ?",
    answer:
      "Oui, un vrai sudoku a toujours exactement une seule solution valide. Toutes nos grilles ont été vérifiées pour garantir cette unicité avant publication.",
  },
  {
    question: "Peut-on imprimer les grilles de sudoku ?",
    answer:
      "Oui, toutes nos grilles sont disponibles en PDF à imprimer gratuitement, en plus de la version jouable en ligne.",
  },
]
