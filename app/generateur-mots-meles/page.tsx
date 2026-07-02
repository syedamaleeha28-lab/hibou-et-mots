import type { Metadata } from "next"
import { ToolGeneratorTemplate } from "@/components/templates/tools"
import { GeneratorEditorial } from "@/components/templates/tools/generator-editorial"
import { SchemaJsonLd } from "@/components/seo"
import { GENERATOR_FAQ } from "@/lib/content/phase1"
import { buildStaticPageMetadata } from "@/lib/seo/metadata"
import { buildFaqPageSchema, buildSchemaGraph, buildSoftwareApplicationSchema, GENERATOR_FEATURE_LIST, buildContentWebPageSchema } from "@/lib/seo/schema"
import { ROUTES } from "@/lib/seo/routes"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMetadata({
    path: ROUTES.generateur,
    title: "Générateur de Mots Mêlés Gratuit - Créez Votre Grille",
    description:
      "Créez votre propre grille de mots mêlés en quelques secondes : choisissez vos mots, la taille et la difficulté. Générateur 100% gratuit, sans inscription.",
  })
}

export default function GenerateurPage() {
  const faqPage = buildFaqPageSchema(GENERATOR_FAQ)
  const schemaGraph = buildSchemaGraph([
    buildSoftwareApplicationSchema({
      name: "Générateur de mots mêlés Hibou&Mots",
      description:
        "Créez une grille de mots mêlés personnalisée en français avec aperçu en direct, sans inscription.",
      path: ROUTES.generateur,
      featureList: GENERATOR_FEATURE_LIST,
    }),
    buildContentWebPageSchema({
      path: ROUTES.generateur,
      name: "Générateur de Mots Mêlés Gratuit - Créez Votre Grille",
      description:
        "Créez votre propre grille de mots mêlés en quelques secondes : choisissez vos mots, la taille et la difficulté. Générateur 100% gratuit, sans inscription.",
    }),
    ...(faqPage ? [faqPage] : []),
  ])

  return (
    <>
      <SchemaJsonLd data={schemaGraph} />
      <ToolGeneratorTemplate variant="page" />
      <GeneratorEditorial />
    </>
  )
}
