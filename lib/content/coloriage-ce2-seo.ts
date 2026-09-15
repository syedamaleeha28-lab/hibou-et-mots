import { MousePointerClick, Palette, Sparkles } from "lucide-react"
import type { HowToPlayStep } from "@/components/templates/shared/how-to-play-block"
import type { FaqItem } from "@/lib/db/types/page-data"

export const COLORIAGE_CE2_INTRO_PARAGRAPHS: string[] = [
  "En CE2, les enfants savent déjà colorier soigneusement et reconnaissent facilement les chiffres — c'est le bon moment pour proposer des coloriages magiques un peu plus riches, avec davantage de zones et de couleurs à identifier. Contrairement aux coloriages magiques de maternelle, à seulement deux couleurs, les modèles pour le CE2 utilisent généralement trois à cinq couleurs, avec des formes plus détaillées à reconnaître.",
  "Le principe reste le même : chaque zone du dessin porte un numéro, et une légende indique quelle couleur correspond à quel numéro. Ce qui change, c'est la complexité du dessin lui-même — plus de zones, des formes moins évidentes au premier coup d'œil, ce qui demande un peu plus d'attention pour bien associer chaque numéro à la bonne couleur.",
  "C'est une activité idéale pour un moment calme après l'école, en complément d'autres exercices scolaires, ou tout simplement pour le plaisir de voir un dessin se révéler progressivement.",
]

export const COLORIAGE_CE2_HOW_TO_PLAY: {
  eyebrow: string
  title: string
  description: string
  steps: HowToPlayStep[]
} = {
  eyebrow: "Comment jouer",
  title: "3 étapes pour réussir un coloriage magique CE2",
  description:
    "Le principe reste simple, avec un peu plus de zones et de couleurs à repérer qu'en maternelle.",
  steps: [
    {
      icon: Palette,
      title: "Observe la légende",
      text: "Repère les 3 à 5 couleurs de la légende, chacune associée à un numéro précis.",
    },
    {
      icon: MousePointerClick,
      title: "Colore zone par zone",
      text: "Trouve toutes les zones portant le même numéro et colore-les avec la couleur associée.",
    },
    {
      icon: Sparkles,
      title: "Révèle le dessin complet",
      text: "Continue jusqu'à ce que toutes les zones soient coloriées — le dessin apparaît entièrement.",
    },
  ],
}

export const COLORIAGE_CE2_FAQ: FaqItem[] = [
  {
    question: "En quoi les coloriages magiques CE2 sont-ils différents de ceux de maternelle ?",
    answer:
      "Ils utilisent davantage de couleurs (3 à 5 au lieu de 2) et des dessins avec plus de zones à identifier, ce qui correspond mieux au niveau d'attention et de reconnaissance des chiffres d'un enfant de CE2.",
  },
  {
    question: "Faut-il déjà bien colorier pour faire un coloriage magique CE2 ?",
    answer:
      "Une certaine aisance avec le coloriage aide, mais l'essentiel de la difficulté porte sur l'identification correcte des zones et des couleurs, pas sur la précision du coloriage lui-même.",
  },
  {
    question: "Les coloriages magiques CE2 sont-ils gratuits ?",
    answer:
      "Oui, comme tous nos coloriages magiques, ceux du CE2 sont gratuits, en ligne comme à imprimer en PDF.",
  },
  {
    question: "Y a-t-il des coloriages magiques pour d'autres niveaux ?",
    answer:
      "Oui, des versions plus simples à deux couleurs sont disponibles pour la maternelle et le CP sur la page principale des coloriages magiques.",
  },
]
