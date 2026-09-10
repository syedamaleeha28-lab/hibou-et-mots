import { Download, Printer, Search } from "lucide-react"
import type { HowToPlayStep } from "@/components/templates/shared/how-to-play-block"

/**
 * Optional CategoryTemplate chrome overrides, keyed by category slug.
 * Same idea as ILLUSTRATION_COPY_OVERRIDES: this is DATA, not per-page
 * conditionals in the template. The lookup works with zero entries — hubs
 * that are absent keep the generic grid heading and HowToPlay copy.
 */
export type CategoryHowToPlayOverride = {
  eyebrow?: string
  title?: string
  description?: string
  steps?: HowToPlayStep[]
}

export type CategoryChromeOverride = {
  gridHeading?: string
  howToPlay?: CategoryHowToPlayOverride
}

const CATEGORY_CHROME_OVERRIDES: Record<string, CategoryChromeOverride> = {
  "hub-imprimer": {
    gridHeading: "Mots mêlés à imprimer en PDF",
    howToPlay: {
      eyebrow: "PDF",
      title: "Comment télécharger et imprimer une grille",
      description: "",
      steps: [
        {
          icon: Search,
          title: "Choisissez une grille",
          text: "Choisissez une grille dans le catalogue ci-dessous.",
        },
        {
          icon: Download,
          title: "Téléchargez le PDF",
          text: "Cliquez sur « Télécharger le PDF » depuis la page du puzzle.",
        },
        {
          icon: Printer,
          title: "Imprimez en A4",
          text: "Imprimez en format A4 — la grille sur la première page, le corrigé sur la seconde.",
        },
      ],
    },
  },
}

export function getCategoryChrome(slug: string): CategoryChromeOverride {
  return CATEGORY_CHROME_OVERRIDES[slug] ?? {}
}
