import type { LucideIcon } from "lucide-react"
import {
  Apple,
  Bird,
  Briefcase,
  Calculator,
  Globe2,
  Landmark,
  Leaf,
  Music,
  PawPrint,
  Rocket,
  Shirt,
  Trophy,
} from "lucide-react"
import { ROUTES, gradePath, themePath } from "@/lib/seo/routes"

export type ColorKey = "coral" | "teal" | "sunny" | "sky" | "leaf"

export type Category = {
  title: string
  description: string
  count: number
  icon: LucideIcon
  color: ColorKey
}

export const categories: Category[] = [
  {
    title: "Les Animaux",
    description: "Chat, lion, dauphin et toute la ménagerie.",
    count: 48,
    icon: PawPrint,
    color: "coral",
  },
  {
    title: "Les Fruits & Légumes",
    description: "Pomme, carotte, fraise... un panier de mots.",
    count: 36,
    icon: Apple,
    color: "leaf",
  },
  {
    title: "L'Espace",
    description: "Planètes, fusées et étoiles à explorer.",
    count: 24,
    icon: Rocket,
    color: "sky",
  },
  {
    title: "La Nature",
    description: "Arbres, fleurs et saisons à découvrir.",
    count: 40,
    icon: Leaf,
    color: "teal",
  },
  {
    title: "Les Oiseaux",
    description: "Hibou, mésange, hirondelle et leurs amis.",
    count: 22,
    icon: Bird,
    color: "sunny",
  },
  {
    title: "Le Sport",
    description: "Football, natation, judo et compagnie.",
    count: 30,
    icon: Trophy,
    color: "coral",
  },
  {
    title: "La Musique",
    description: "Notes, instruments et grands compositeurs.",
    count: 26,
    icon: Music,
    color: "sky",
  },
  {
    title: "Les Métiers",
    description: "Boulanger, pompier, vétérinaire et plus.",
    count: 34,
    icon: Briefcase,
    color: "teal",
  },
  {
    title: "Les Vêtements",
    description: "Manteau, écharpe, chaussures pour tous.",
    count: 20,
    icon: Shirt,
    color: "sunny",
  },
  {
    title: "Les Mathématiques",
    description: "Nombres, formes et vocabulaire du calcul.",
    count: 28,
    icon: Calculator,
    color: "leaf",
  },
  {
    title: "La Géographie",
    description: "Pays, fleuves, montagnes et capitales.",
    count: 32,
    icon: Globe2,
    color: "coral",
  },
  {
    title: "L'Histoire de France",
    description: "Châteaux, rois et grandes inventions.",
    count: 18,
    icon: Landmark,
    color: "sky",
  },
]

export type Difficulty = "Facile" | "Moyen" | "Difficile"

export type Puzzle = {
  title: string
  theme: string
  words: number
  size: string
  difficulty: Difficulty
  plays: string
  color: ColorKey
  words_preview: string[]
}

export const popularPuzzles: Puzzle[] = [
  {
    title: "Les Animaux de la Ferme",
    theme: "Animaux",
    words: 10,
    size: "10 × 10",
    difficulty: "Facile",
    plays: "12,4k",
    color: "coral",
    words_preview: ["VACHE", "POULE", "MOUTON", "CHEVAL", "COCHON"],
  },
  {
    title: "Le Système Solaire",
    theme: "Espace",
    words: 12,
    size: "12 × 12",
    difficulty: "Moyen",
    plays: "9,1k",
    color: "sky",
    words_preview: ["MARS", "VENUS", "SATURNE", "TERRE", "JUPITER"],
  },
  {
    title: "Fruits d'Été",
    theme: "Fruits",
    words: 8,
    size: "8 × 8",
    difficulty: "Facile",
    plays: "15,7k",
    color: "leaf",
    words_preview: ["FRAISE", "CERISE", "PECHE", "MELON", "ABRICOT"],
  },
  {
    title: "Les Instruments",
    theme: "Musique",
    words: 12,
    size: "12 × 12",
    difficulty: "Moyen",
    plays: "6,8k",
    color: "teal",
    words_preview: ["PIANO", "VIOLON", "FLUTE", "GUITARE", "BATTERIE"],
  },
  {
    title: "Capitales du Monde",
    theme: "Géographie",
    words: 14,
    size: "14 × 14",
    difficulty: "Difficile",
    plays: "4,2k",
    color: "sunny",
    words_preview: ["PARIS", "ROME", "MADRID", "BERLIN", "OTTAWA"],
  },
  {
    title: "Les Petites Bêtes",
    theme: "Nature",
    words: 10,
    size: "10 × 10",
    difficulty: "Facile",
    plays: "8,9k",
    color: "coral",
    words_preview: ["ABEILLE", "FOURMI", "PAPILLON", "ESCARGOT", "COCCINELLE"],
  },
]

export type Grade = {
  level: string
  age: string
  description: string
  gridSize: string
  color: ColorKey
}

export const grades: Grade[] = [
  {
    level: "Maternelle",
    age: "3 – 5 ans",
    description: "Grilles 6×6, grandes lettres et mots de 3 lettres.",
    gridSize: "6 × 6",
    color: "coral",
  },
  {
    level: "CP – CE1",
    age: "6 – 8 ans",
    description: "Grilles 8×8, vocabulaire de lecture du quotidien.",
    gridSize: "8 × 8",
    color: "sunny",
  },
  {
    level: "CE2 – CM1",
    age: "8 – 10 ans",
    description: "Grilles 10×10 avec diagonales et thèmes variés.",
    gridSize: "10 × 10",
    color: "teal",
  },
  {
    level: "CM2 – Collège",
    age: "10 – 14 ans",
    description: "Grilles 14×14, mots longs et directions inversées.",
    gridSize: "14 × 14",
    color: "sky",
  },
]

export type Pdf = {
  title: string
  pages: number
  level: string
  color: ColorKey
  href: string
}

export const pdfPacks: Pdf[] = [
  {
    title: "Cahier de Vacances — Animaux",
    pages: 20,
    level: "CP – CE1",
    color: "coral",
    href: themePath("animaux"),
  },
  {
    title: "Pack Saisons & Nature",
    pages: 16,
    level: "CE2 – CM1",
    color: "leaf",
    href: ROUTES.fetesHub,
  },
  {
    title: "Spécial Sciences",
    pages: 24,
    level: "CM2 – Collège",
    color: "sky",
    href: themePath("corps-humain"),
  },
  {
    title: "Premiers Mots — Maternelle",
    pages: 12,
    level: "Maternelle",
    color: "sunny",
    href: gradePath("maternelle"),
  },
]
