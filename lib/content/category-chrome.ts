import { Download, Printer, Search } from "lucide-react"
import type { HowToPlayStep } from "@/components/templates/shared/how-to-play-block"

/**
 * Optional CategoryTemplate chrome overrides, keyed by category slug.
 * Same idea as ILLUSTRATION_COPY_OVERRIDES: this is DATA, not per-page
 * conditionals in the template. The lookup works with zero entries — hubs
 * that are absent keep the generic grid heading and HowToPlay copy.
 *
 * NEW: now also keyed by locale. The "hub-imprimer" slug is shared
 * between the French print hub and the PT-BR print hub
 * (/caca-palavras-para-imprimir/) — this override was French-only and
 * leaking onto the PT-BR page (it's what produced "Mots mêlés à
 * imprimer en PDF" as that page's grid heading). howToPlay isn't
 * duplicated for pt-BR: HowToPlayBlock is suppressed entirely for
 * PT-BR category pages (see category-template.tsx), so only
 * gridHeading needs a PT-BR entry here.
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

const CATEGORY_CHROME_OVERRIDES_PT: Record<string, CategoryChromeOverride> = {
  "hub-imprimer": {
    gridHeading: "Caça-palavras para imprimir em PDF",
    // No howToPlay entry — that block doesn't render on PT-BR category
    // pages at all right now (suppressed, see category-template.tsx).
  },
}

export function getCategoryChrome(
  slug: string,
  locale: "fr" | "pt-BR" = "fr",
): CategoryChromeOverride {
  if (locale === "pt-BR") return CATEGORY_CHROME_OVERRIDES_PT[slug] ?? {}
  return CATEGORY_CHROME_OVERRIDES[slug] ?? {}
}
