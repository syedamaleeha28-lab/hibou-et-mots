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
    <>
      <Hero />
      <FeaturedCategories />
      <PopularPuzzles />
      <GradeLevels />
      <PrintablePdfs />
      <PuzzleGenerator />
    </>
  )
}
