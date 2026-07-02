import type { Metadata } from "next"
import { ToolOnlinePlayTemplate } from "@/components/templates/tools"
import { OnlinePlayEditorial } from "@/components/templates/tools/online-play-editorial"
import { SchemaJsonLd } from "@/components/seo"
import { ONLINE_PLAY_FAQ } from "@/lib/content/phase1"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"
import { buildFaqPageSchema, buildSchemaGraph, buildSoftwareApplicationSchema, ONLINE_PLAY_FEATURE_LIST, buildContentWebPageSchema } from "@/lib/seo/schema"
import { ROUTES } from "@/lib/seo/routes"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: ROUTES.jouer,
    title: "Jouer aux Mots Mêlés en Ligne Gratuitement",
    description:
      "Jouez aux mots mêlés directement dans votre navigateur, sans téléchargement ni inscription. Des dizaines de grilles gratuites, tous niveaux.",
  })
}

export default function JouerEnLignePage() {
  const faqPage = buildFaqPageSchema(ONLINE_PLAY_FAQ)
  const schemaGraph = buildSchemaGraph([
    buildSoftwareApplicationSchema({
      name: "Jeu de mots mêlés en ligne Hibou&Mots",
      description:
        "Jouez aux mots mêlés dans votre navigateur, sans téléchargement, gratuitement.",
      path: ROUTES.jouer,
      featureList: ONLINE_PLAY_FEATURE_LIST,
    }),
    buildContentWebPageSchema({
      path: ROUTES.jouer,
      name: "Jouer aux Mots Mêlés en Ligne Gratuitement",
      description:
        "Jouez aux mots mêlés directement dans votre navigateur, sans téléchargement ni inscription. Des dizaines de grilles gratuites, tous niveaux.",
    }),
    ...(faqPage ? [faqPage] : []),
  ])

  return (
    <>
      <SchemaJsonLd data={schemaGraph} />
      <ToolOnlinePlayTemplate />
      <OnlinePlayEditorial />
    </>
  )
}
