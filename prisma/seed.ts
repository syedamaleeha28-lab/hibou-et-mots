import { PrismaClient } from "@prisma/client"
import { difficultySeed } from "./seed/difficulties"
import { gradeSeed } from "./seed/grades"
import { themeWordSeed } from "./seed/theme-words"
import { themeSeed } from "./seed/themes"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding reference data…")

  for (const grade of gradeSeed) {
    await prisma.grade.upsert({
      where: { slug: grade.slug },
      create: grade,
      update: {
        name: grade.name,
        ageRange: grade.ageRange,
        order: grade.order,
        defaultGridSize: grade.defaultGridSize,
        seoTitle: grade.seoTitle,
        metaDescription: grade.metaDescription,
        introText: grade.introText,
      },
    })
  }
  console.log(`  ✓ ${gradeSeed.length} grades`)

  for (const difficulty of difficultySeed) {
    await prisma.difficulty.upsert({
      where: { slug: difficulty.slug },
      create: difficulty,
      update: {
        name: difficulty.name,
        gridSizeMin: difficulty.gridSizeMin,
        gridSizeMax: difficulty.gridSizeMax,
        wordCountMin: difficulty.wordCountMin,
        wordCountMax: difficulty.wordCountMax,
        directions: [...difficulty.directions],
      },
    })
  }
  console.log(`  ✓ ${difficultySeed.length} difficulties`)

  const themeIdBySlug = new Map<string, string>()

  for (const theme of themeSeed) {
    const record = await prisma.theme.upsert({
      where: { slug: theme.slug },
      create: {
        slug: theme.slug,
        name: theme.name,
        group: theme.group,
        isSeasonal: theme.isSeasonal,
        activeDateStart: theme.activeDateStart,
        activeDateEnd: theme.activeDateEnd,
        seoTitle: `Mots Mêlés ${theme.name} — Grilles Gratuites à Imprimer`,
        metaDescription: `Découvrez des grilles de mots mêlés sur le thème ${theme.name}, gratuites, imprimables en PDF et jouables en ligne.`,
        introText: `Une sélection de mots mêlés sur le thème ${theme.name}, à imprimer ou à jouer directement en ligne.`,
      },
      update: {
        name: theme.name,
        group: theme.group,
        isSeasonal: theme.isSeasonal,
        activeDateStart: theme.activeDateStart,
        activeDateEnd: theme.activeDateEnd,
      },
    })
    themeIdBySlug.set(theme.slug, record.id)
  }
  console.log(`  ✓ ${themeSeed.length} themes`)

  let wordCount = 0
  for (const theme of themeSeed) {
    const themeId = themeIdBySlug.get(theme.slug)
    if (!themeId) continue

    await prisma.themeWord.deleteMany({ where: { themeId } })

    const words = themeWordSeed.filter((w) => w.themeSlug === theme.slug)
    if (words.length > 0) {
      await prisma.themeWord.createMany({
        data: words.map((w) => ({
          themeId,
          word: w.word,
          length: w.length,
          minGradeOrder: w.minGradeOrder,
        })),
      })
      wordCount += words.length
    }
  }
  console.log(`  ✓ ${wordCount} theme words`)

  console.log("Seed complete.")
}

main()
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
