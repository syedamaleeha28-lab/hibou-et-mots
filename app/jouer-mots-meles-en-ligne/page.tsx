import type { Metadata } from "next"
import { ToolOnlinePlayTemplate } from "@/components/templates/tools"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"
import { ROUTES } from "@/lib/seo/routes"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: ROUTES.jouer,
    title: "Jouer aux mots mêlés en ligne — Grilles gratuites",
    description:
      "Joue gratuitement aux mots mêlés en ligne : choisis un thème, une difficulté et trouve tous les mots avec le chronomètre. Idéal pour les enfants et la classe.",
  })
}

export default function JouerEnLignePage() {
  return <ToolOnlinePlayTemplate />
}
