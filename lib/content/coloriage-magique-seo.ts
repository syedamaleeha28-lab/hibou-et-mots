import { MousePointerClick, Palette, Sparkles } from "lucide-react"
import type { HowToPlayStep } from "@/components/templates/shared/how-to-play-block"
import type { FaqItem } from "@/lib/db/types/page-data"

export const COLORIAGE_MAGIQUE_INTRO_PARAGRAPHS: string[] = [
  "Le coloriage magique est une activité qui associe le plaisir du dessin à l'apprentissage : chaque zone du dessin porte un numéro, et une légende indique quelle couleur correspond à quel numéro. En coloriant chaque zone avec la bonne couleur, un dessin caché apparaît petit à petit — d'où le nom « magique ».",
  "C'est une activité particulièrement adaptée aux tout-petits, dès la maternelle, car elle ne demande pas encore de savoir lire des mots entiers : reconnaître un chiffre et une couleur suffit. C'est aussi un excellent exercice de motricité fine et de concentration, dans un cadre ludique et sans pression.",
  "Nos coloriages magiques sont disponibles à imprimer gratuitement en PDF, avec les numéros déjà indiqués sur chaque zone et la légende des couleurs juste en dessous — prêts à colorier avec de vrais crayons de couleur.",
]

export const COLORIAGE_MAGIQUE_HOW_TO_PLAY: {
  eyebrow: string
  title: string
  description: string
  steps: HowToPlayStep[]
} = {
  eyebrow: "Comment jouer",
  title: "3 étapes pour réussir un coloriage magique",
  description: "Le principe du coloriage magique en quelques mots : associe chaque numéro à sa couleur.",
  steps: [
    {
      icon: Palette,
      title: "Choisis un numéro",
      text: "Regarde la légende en haut : chaque numéro correspond à une couleur précise.",
    },
    {
      icon: MousePointerClick,
      title: "Colore la bonne zone",
      text: "Trouve les zones du dessin qui portent ce numéro, et colore-les avec la couleur associée.",
    },
    {
      icon: Sparkles,
      title: "Découvre le dessin",
      text: "Continue avec chaque numéro jusqu'à ce que le dessin caché soit entièrement révélé.",
    },
  ],
}

export const COLORIAGE_MAGIQUE_FAQ: FaqItem[] = [
  {
    question: "À partir de quel âge peut-on faire un coloriage magique ?",
    answer:
      "Dès la maternelle, en particulier à partir de la moyenne section quand l'enfant reconnaît les chiffres de 1 à 3 ou 4. C'est une activité pensée pour les tout-petits, bien avant qu'ils sachent lire.",
  },
  {
    question: "Les coloriages magiques sont-ils gratuits à imprimer ?",
    answer:
      "Oui, tous nos coloriages magiques sont gratuits, en PDF prêt à imprimer, avec les numéros déjà placés sur le dessin et la légende des couleurs en dessous.",
  },
  {
    question: "Peut-on aussi jouer en ligne, sans imprimer ?",
    answer:
      "Oui, une version interactive est disponible directement sur le site : clique sur un numéro de la légende, puis sur la zone correspondante pour la colorier.",
  },
  {
    question: "Que faire si l'enfant colore une mauvaise zone ?",
    answer:
      "Rien de grave : dans notre version en ligne, cliquer sur une zone qui ne correspond pas au numéro sélectionné ne fait rien du tout — il n'y a pas d'erreur possible, seulement des zones qui attendent encore la bonne couleur.",
  },
]
