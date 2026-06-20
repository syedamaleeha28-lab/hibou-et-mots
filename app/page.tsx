import type { Metadata } from "next"
import {
  FeaturedCategories,
  GradeLevels,
  Hero,
  HomeChooseGridSection,
  HomeFaq,
  HomePedagogySection,
  HomeSeoIntro,
  HomeSiloLinks,
  PopularPuzzles,
  PrintablePdfs,
  PuzzleGenerator,
} from "@/components/templates/home"
import { SchemaJsonLd } from "@/components/seo"
import { buildHomeMetadata } from "@/lib/seo/metadata"
import { buildHomePageSchemaGraph } from "@/lib/seo/schema/home"

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata()
}

export default function Home() {
  const schemaGraph = buildHomePageSchemaGraph()

  return (
    <>
      <SchemaJsonLd data={schemaGraph} />
      <Hero />
      <HomeSeoIntro />
      <HomeSiloLinks />
      <FeaturedCategories />
      <PopularPuzzles />
      <HomePedagogySection />
      <HomeChooseGridSection />
      <GradeLevels />
      <PrintablePdfs />
      <PuzzleGenerator />
      <HomeFaq />
    </>
  )
}
