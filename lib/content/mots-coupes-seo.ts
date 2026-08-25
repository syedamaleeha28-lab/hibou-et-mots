import { CheckCircle2, MousePointerClick, Puzzle } from "lucide-react"
import type { HowToPlayStep } from "@/components/templates/shared/how-to-play-block"
import type { FaqItem } from "@/lib/db/types/page-data"

/**
 * SEO body content for the mots coupés pages. Was previously entirely
 * absent — the pages had a one-line description and nothing else, well
 * under any reasonable content-length threshold for a page competing
 * for a 10,000/mo head keyword. This is real, substantive copy, not
 * padding — written to actually help a visitor understand the game,
 * same standard as the mots-mêlés pages' existing content.
 */

export const MOTS_COUPES_INTRO_PARAGRAPHS: string[] = [
  "Le jeu des mots coupés est une variante moins connue que les mots mêlés ou les mots croisés, mais tout aussi efficace pour travailler le vocabulaire et l'orthographe. Le principe est simple : chaque mot a été coupé en deux morceaux, un début et une fin, puis tous les morceaux ont été mélangés. Le but est de retrouver quel début correspond à quelle fin pour reconstituer chaque mot en entier.",
  "Contrairement aux mots mêlés, où il faut repérer un mot déjà écrit dans une grille de lettres, les mots coupés demandent de reconstruire le mot soi-même à partir de fragments. Cet exercice sollicite une mémoire orthographique différente : l'enfant doit visualiser mentalement comment les syllabes s'assemblent, ce qui renforce la reconnaissance des structures de mots plus longs.",
  "Nos grilles de mots coupés sont pensées pour progresser par niveau, du plus simple (mots courts de deux syllabes) au plus complexe (mots de quatre syllabes ou plus). C'est une activité idéale à la maison comme en classe, en complément des mots mêlés et des mots croisés déjà disponibles sur le site.",
]

export const MOTS_COUPES_HOW_TO_PLAY: {
  eyebrow: string
  title: string
  description: string
  steps: HowToPlayStep[]
} = {
  eyebrow: "Comment jouer",
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
      text: "Clique sur un début, puis sur la fin qui lui correspond. Si la paire est correcte, elle se verrouille.",
    },
    {
      icon: CheckCircle2,
      title: "Reconstitue tous les mots",
      text: "Continue jusqu'à ce que chaque début ait retrouvé sa fin — tous les mots sont alors complets.",
    },
  ],
}

export const MOTS_COUPES_FAQ: FaqItem[] = [
  {
    question: "C'est quoi exactement un mots coupés ?",
    answer:
      "Un mots coupés est un jeu où chaque mot d'une liste a été coupé en deux parties, mélangées avec les parties des autres mots. Le joueur doit retrouver quelle partie va avec quelle autre pour reformer chaque mot correctement.",
  },
  {
    question: "À partir de quel âge peut-on jouer aux mots coupés ?",
    answer:
      "Dès le CE1-CE2, quand l'enfant maîtrise déjà la lecture de mots simples. C'est un bon exercice de transition entre les mots mêlés (repérer un mot déjà écrit) et des exercices d'orthographe plus avancés.",
  },
  {
    question: "Les grilles de mots coupés sont-elles gratuites ?",
    answer:
      "Oui, toutes nos grilles de mots coupés sont gratuites, en ligne comme en PDF à imprimer, sans création de compte nécessaire.",
  },
  {
    question: "Quelle est la différence entre mots coupés et mots croisés ?",
    answer:
      "Les mots croisés se remplissent à partir de définitions, dans une grille avec des cases numérotées. Les mots coupés n'ont pas de définitions : il s'agit uniquement de réassocier des fragments de mots déjà donnés, sans avoir à deviner le mot lui-même.",
  },
]
