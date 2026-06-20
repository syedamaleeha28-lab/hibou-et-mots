import { ROUTES, absoluteUrl } from "@/lib/seo/routes"

export function buildSoftwareApplicationSchema(input: {
  name: string
  description: string
  path: string
  siteUrl?: string
  featureList?: string[]
}) {
  const url = absoluteUrl(input.path, input.siteUrl)
  return {
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url,
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    ...(input.featureList?.length ? { featureList: input.featureList } : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    inLanguage: "fr-FR",
  }
}

export const GENERATOR_FEATURE_LIST = [
  "Grilles personnalisées avec vos propres mots",
  "Aperçu en direct de la grille",
  "Réglage de la taille et de la difficulté",
  "Impression depuis le navigateur",
  "Mode grand format pour une meilleure lisibilité",
  "Utilisation gratuite sans inscription",
]

export const ONLINE_PLAY_FEATURE_LIST = [
  "Jeu dans le navigateur sans téléchargement",
  "Sélection des mots par clic sur les lettres",
  "Chronomètre intégré",
  "Choix du thème et de la difficulté",
  "Mode grand format",
  "Utilisation gratuite sans inscription",
]
