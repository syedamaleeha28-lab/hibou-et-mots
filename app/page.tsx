import { SiteHeader, SiteFooter } from "@/components/layout"
import {
  Hero,
  FeaturedCategories,
  PopularPuzzles,
  GradeLevels,
  PrintablePdfs,
  PuzzleGenerator,
} from "@/components/templates/home"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <FeaturedCategories />
        <PopularPuzzles />
        <GradeLevels />
        <PrintablePdfs />
        <PuzzleGenerator />
      </main>
      <SiteFooter />
    </div>
  )
}
