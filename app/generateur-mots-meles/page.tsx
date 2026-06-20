import type { Metadata } from "next"
import { ToolGeneratorTemplate } from "@/components/templates/tools"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"
import { ROUTES } from "@/lib/seo/routes"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: ROUTES.generateur,
    title: "Générateur de mots mêlés — Crée ta grille gratuite",
    description:
      "Générateur de mots mêlés gratuit en français : choisis un thème, personnalise tes mots, règle la taille et joue en ligne ou imprime ta grille.",
  })
}

export default function GenerateurPage() {
  return <ToolGeneratorTemplate variant="page" />
}
