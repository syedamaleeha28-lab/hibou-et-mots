import { CheckCircle2, MousePointerClick, PenLine, Puzzle, Repeat, ScrollText } from "lucide-react"
import type { HowToPlayStep } from "@/components/templates/shared/how-to-play-block"
import type { FaqItem } from "@/lib/db/types/page-data"

/**
 * SEO body content for the mots coupés pages, SPLIT into distinct online
 * vs. printable copy. Previously both pages imported the exact same
 * shared constants, meaning near-identical body text competed for the
 * same head term ("mots coupés") on two URLs — a self-cannibalization
 * setup diagnosed via Ahrefs content-gap + Search Console data on
 * 2026-09-01. Every block below is written specifically for its page's
 * actual intent (instant online play vs. printable/classroom use), not a
 * reworded duplicate of the other.
 */

// ---------- ONLINE (/mots-coupes/) ----------

export const MOTS_COUPES_INTRO_PARAGRAPHS_ONLINE: string[] = [
  "Le jeu des mots coupés est une variante moins connue que les mots mêlés ou les mots croisés, mais tout aussi efficace pour travailler le vocabulaire et l'orthographe. Le principe est simple : chaque mot a été coupé en deux morceaux, un début et une fin, puis tous les morceaux ont été mélangés. Le but est de retrouver quel début correspond à quelle fin pour reconstituer chaque mot en entier — directement dans le navigateur, sans rien à installer.",
  "L'avantage de la version en ligne, c'est le retour immédiat : dès qu'une paire est correcte, elle se verrouille visuellement, et il n'y a jamais besoin de vérifier une réponse dans un corrigé séparé. Cette confirmation instantanée aide particulièrement les plus jeunes joueurs à progresser par essai-erreur, sans crainte de « rater » — une association incorrecte se contente de ne pas se verrouiller, sans pénalité.",
  "Une nouvelle grille est proposée chaque jour, avec une difficulté qui varie du plus simple (mots courts de deux syllabes) au plus complexe (mots de quatre syllabes ou plus). C'est une activité rapide, pensée pour une pause de cinq minutes autant que pour une vraie session de concentration, en complément des mots mêlés et des mots croisés déjà disponibles sur le site.",
]

export const MOTS_COUPES_HOW_TO_PLAY_ONLINE: {
  eyebrow: string
  title: string
  description: string
  steps: HowToPlayStep[]
} = {
  eyebrow: "Comment jouer en ligne",
  title: "3 étapes pour réussir un mots coupés",
  description:
    "Le principe des mots coupés en quelques mots : reconstitue chaque mot en associant correctement son début et sa fin.",
  steps: [
    {
      icon: Puzzle,
      title: "Observe les morceaux",
      text: "À gauche, les débuts de mots numérotés. À droite, les fins de mots mélangées et associées à une lettre.",
    },
    {
      icon: MousePointerClick,
      title: "Associe les paires",
      text: "Clique sur un début, puis sur la fin qui lui correspond. Si la paire est correcte, elle se verrouille aussitôt.",
    },
    {
      icon: Repeat,
      title: "Recommence si besoin",
      text: "Une association incorrecte ne se verrouille pas — réessaie simplement une autre combinaison, sans pénalité.",
    },
  ],
}

export const MOTS_COUPES_FAQ_ONLINE: FaqItem[] = [
  {
    question: "C'est quoi exactement un mots coupés ?",
    answer:
      "Un mots coupés est un jeu où chaque mot d'une liste a été coupé en deux parties, mélangées avec les parties des autres mots. Le joueur doit retrouver quelle partie va avec quelle autre pour reformer chaque mot correctement.",
  },
  {
    question: "Une nouvelle grille apparaît-elle chaque jour ?",
    answer:
      "Oui, la grille change chaque jour. Reviens régulièrement pour un nouveau défi, avec un niveau de difficulté qui varie d'un jour à l'autre.",
  },
  {
    question: "Que se passe-t-il si je me trompe en jouant en ligne ?",
    answer:
      "Rien de grave : une association incorrecte ne se verrouille pas et disparaît simplement. Tu peux réessayer autant de fois que nécessaire, sans limite de tentatives.",
  },
  {
    question: "Quelle est la différence entre mots coupés et mots croisés ?",
    answer:
      "Les mots croisés se remplissent à partir de définitions, dans une grille avec des cases numérotées. Les mots coupés n'ont pas de définitions : il s'agit uniquement de réassocier des fragments de mots déjà donnés, sans avoir à deviner le mot lui-même.",
  },
]

// ---------- PRINTABLE (/mots-coupes-a-imprimer/) ----------

export const MOTS_COUPES_INTRO_PARAGRAPHS_PRINT: string[] = [
  "Le jeu des mots coupés se prête particulièrement bien au papier : chaque mot est coupé en deux morceaux — un début et une fin — mélangés sur la page, et il suffit d'un crayon pour relier chaque début à la fin qui lui correspond. Contrairement aux mots mêlés, où il faut repérer un mot déjà écrit dans une grille de lettres, les mots coupés demandent de reconstruire le mot soi-même en traçant un trait entre les deux bonnes moitiés.",
  "C'est un format particulièrement pratique en classe ou à la maison sans écran : une même fiche peut être distribuée à un groupe entier, plusieurs enfants peuvent travailler côte à côte sur leur propre feuille, et rien ne dépend d'une connexion ou d'une batterie. Les fiches sont conçues pour plusieurs niveaux à la fois, ce qui permet à un enseignant ou un parent d'imprimer une version plus simple pour certains élèves et une version plus corsée pour d'autres, sans changer d'activité.",
  "Chaque fiche imprimable inclut sa propre grille de mots à reconstituer, avec une mise en page pensée pour être lisible et confortable au crayon — espacements suffisants entre les colonnes, taille de texte adaptée à l'impression. Une fois terminées, les fiches peuvent être conservées comme un petit carnet d'exercices, feuille après feuille.",
]

export const MOTS_COUPES_HOW_TO_PLAY_PRINT: {
  eyebrow: string
  title: string
  description: string
  steps: HowToPlayStep[]
} = {
  eyebrow: "Comment jouer sur papier",
  title: "3 étapes pour compléter une fiche de mots coupés",
  description:
    "Le principe des mots coupés en quelques mots : relie au crayon chaque début de mot à la fin qui lui correspond.",
  steps: [
    {
      icon: ScrollText,
      title: "Repère les deux colonnes",
      text: "À gauche, les débuts de mots numérotés. À droite, les fins de mots mélangées et associées à une lettre.",
    },
    {
      icon: PenLine,
      title: "Trace un trait entre chaque paire",
      text: "Avec un crayon, relie chaque numéro à la lettre qui complète correctement le mot.",
    },
    {
      icon: CheckCircle2,
      title: "Vérifie avec le corrigé",
      text: "Une fois toutes les paires reliées, compare avec le corrigé pour t'assurer que chaque mot est complet.",
    },
  ],
}

export const MOTS_COUPES_FAQ_PRINT: FaqItem[] = [
  {
    question: "C'est quoi exactement un mots coupés ?",
    answer:
      "Un mots coupés est un exercice où chaque mot d'une liste a été coupé en deux parties, mélangées sur la page avec les parties des autres mots. Il suffit de relier au crayon chaque début à la fin qui lui correspond pour reformer tous les mots.",
  },
  {
    question: "À partir de quel âge peut-on imprimer une fiche de mots coupés ?",
    answer:
      "Dès le CE1-CE2, quand l'enfant maîtrise déjà la lecture de mots simples. C'est un bon exercice de transition entre les mots mêlés (repérer un mot déjà écrit) et des exercices d'orthographe plus avancés.",
  },
  {
    question: "Comment corriger une erreur sur la fiche imprimée ?",
    answer:
      "Le plus simple est de barrer le trait incorrect d'un coup de crayon et de tracer la bonne association juste à côté. Pour une classe entière, il est aussi possible de réimprimer une fiche vierge à tout moment.",
  },
  {
    question: "Puis-je imprimer plusieurs niveaux de difficulté à la fois ?",
    answer:
      "Oui, chaque fiche indique son niveau, et il est possible d'imprimer plusieurs fiches de niveaux différents pour une même séance — pratique pour adapter l'exercice à chaque enfant dans une classe ou une fratrie.",
  },
]
