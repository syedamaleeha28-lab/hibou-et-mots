import type { LucideIcon } from "lucide-react"
import {
  Apple,
  CloudSun,
  Globe2,
  Heart,
  PawPrint,
  Sparkles,
  Trophy,
  TreePine,
} from "lucide-react"
import type { ColorKey } from "@/lib/content"
import { ROUTES, seasonalPath, themePath } from "@/lib/seo/routes"

export type FeaturedThemeCategory = {
  title: string
  description: string
  href: string
  icon: LucideIcon
  color: ColorKey
  countLabel: string
}

/** Homepage featured tiles — real silo URLs (not mock anchors). */
export const featuredThemeCategories: FeaturedThemeCategory[] = [
  {
    title: "Animaux",
    description: "Chat, chien, lion et toute la ménagerie.",
    href: themePath("animaux"),
    icon: PawPrint,
    color: "coral",
    countLabel: "Thème Animaux",
  },
  {
    title: "Fruits",
    description: "Pomme, fraise, banane… un panier de mots.",
    href: themePath("fruits"),
    icon: Apple,
    color: "leaf",
    countLabel: "Thème Fruits",
  },
  {
    title: "Sport",
    description: "Football, natation, judo et compagnie.",
    href: themePath("sport"),
    icon: Trophy,
    color: "teal",
    countLabel: "Thème Sport",
  },
  {
    title: "Noël",
    description: "Sapin, cadeaux et magie des fêtes.",
    href: seasonalPath("noel"),
    icon: TreePine,
    color: "sky",
    countLabel: "Thème Noël",
  },
  {
    title: "Famille",
    description: "Maman, papa, frère, sœur et maison.",
    href: themePath("famille"),
    icon: Heart,
    color: "sunny",
    countLabel: "Thème Famille",
  },
  {
    title: "Pays du Monde",
    description: "Capitales, continents et voyage.",
    href: themePath("pays-du-monde"),
    icon: Globe2,
    color: "coral",
    countLabel: "Thème Géographie",
  },
  {
    title: "Météo",
    description: "Soleil, pluie, neige et saisons.",
    href: themePath("meteo"),
    icon: CloudSun,
    color: "sky",
    countLabel: "Thème Météo",
  },
  {
    title: "Toutes les grilles",
    description: "Parcourir toutes les catégories gratuites.",
    href: ROUTES.gratuits,
    icon: Sparkles,
    color: "teal",
    countLabel: "Hub Gratuits",
  },
]
