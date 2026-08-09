import type { CategorySeedDefinition } from "./categories"
import { HUB_CATEGORY_SLUGS } from "@/lib/db/adapters/category-constants"
import { difficultySeedPt } from "./difficulties.pt"
import { themeSeedPt } from "./themes.pt"

/**
 * PT-BR category definitions — v1 scope (matches the pages already built:
 * hub-imprimer, 2 themes, 3 difficulty levels). Hub slugs reuse the same
 * string keys as HUB_CATEGORY_SLUGS on purpose — locale is what
 * disambiguates them from the French rows of the same slug.
 */

const HUB_IMPRIMER_PT: CategorySeedDefinition = {
  locale: "pt-BR",
  slug: HUB_CATEGORY_SLUGS.imprimer,
  type: "AUDIENCE",
  h1: "Caça-Palavras para Imprimir",
  seoTitle: "Caça-Palavras para Imprimir Grátis em PDF | Hibou & Mots",
  metaDescription:
    "Centenas de grades de caça-palavras 100% grátis para imprimir em PDF, com gabarito. Ideal para casa, escola e toda a família.",
  introText:
    "Baixe e imprima grades de caça-palavras gratuitas em PDF, formato A4, com gabarito na segunda página. Escolha por tema ou por nível de dificuldade.",
  faqJson: [
    {
      question: "O caça-palavras para imprimir é realmente grátis?",
      answer: "Sim, todas as grades são 100% gratuitas, sem necessidade de cadastro.",
    },
    {
      question: "Como faço para imprimir uma grade?",
      answer:
        "Escolha uma grade, baixe o PDF e imprima em papel A4. O gabarito vem na segunda página.",
    },
  ],
  isHub: true,
}

const HUB_DIFICULTE_PT: CategorySeedDefinition = {
  locale: "pt-BR",
  slug: HUB_CATEGORY_SLUGS.difficulte,
  type: "DIFFICULTY",
  h1: "Caça-Palavras Fácil ou Difícil: Escolha o Seu Nível",
  seoTitle: "Caça-Palavras Fácil e Difícil - Todos os Níveis | Hibou & Mots",
  metaDescription:
    "Caça-palavras organizados por nível: fácil, médio e difícil. Grades grátis para imprimir.",
  introText: "Encontre a grade certa para o seu nível, do iniciante ao avançado.",
  faqJson: [
    {
      question: "Qual a diferença entre os níveis?",
      answer:
        "O tamanho da grade e o número de palavras aumentam do fácil ao difícil — veja os detalhes em cada página de nível.",
    },
  ],
  isHub: true,
}

const HUB_TEMATICOS_PT: CategorySeedDefinition = {
  locale: "pt-BR",
  slug: HUB_CATEGORY_SLUGS.thematiques,
  type: "THEME",
  h1: "Caça-Palavras Temáticos",
  seoTitle: "Caça-Palavras Temáticos - Animais, Esporte | Hibou & Mots",
  metaDescription: "Explore nossos caça-palavras por tema: animais, esporte e mais.",
  introText: "Escolha um tema e descubra grades de caça-palavras para todas as idades.",
  faqJson: [
    {
      question: "Novos temas serão adicionados?",
      answer: "Sim, novos temas são adicionados regularmente.",
    },
  ],
  isHub: true,
}

const THEME_DEFINITIONS_PT: CategorySeedDefinition[] = themeSeedPt.map((theme) => ({
  locale: "pt-BR",
  slug: theme.slug,
  type: "THEME",
  parentSlug: HUB_CATEGORY_SLUGS.thematiques,
  themeSlug: theme.slug,
  h1: `Caça-Palavras de ${theme.name}`,
  seoTitle: `Caça-Palavras de ${theme.name} — Grátis para Imprimir | Hibou & Mots`,
  metaDescription: `Caça-palavras grátis sobre ${theme.name.toLowerCase()}, para imprimir em PDF ou jogar online.`,
  introText: `Escolha uma grade de caça-palavras sobre ${theme.name.toLowerCase()} e divirta-se aprendendo novas palavras em português.`,
  faqJson: [
    {
      question: `Os caça-palavras de ${theme.name.toLowerCase()} são grátis?`,
      answer: "Sim, todas as grades deste tema são gratuitas para imprimir ou jogar online.",
    },
  ],
}))

const DIFFICULTY_DEFINITIONS_PT: CategorySeedDefinition[] = difficultySeedPt.map((level) => ({
  locale: "pt-BR",
  slug: level.slug,
  type: "DIFFICULTY",
  parentSlug: HUB_CATEGORY_SLUGS.difficulte,
  difficultySlug: level.slug,
  h1: `Caça-Palavras Nível ${level.name}`,
  seoTitle: `Caça-Palavras ${level.name} para Imprimir | Hibou & Mots`,
  metaDescription: `Grades de caça-palavras nível ${level.name.toLowerCase()}, grátis para imprimir em PDF.`,
  introText: `Grades de nível ${level.name.toLowerCase()} para praticar no seu próprio ritmo.`,
  faqJson: [
    {
      question: `Qual o tamanho das grades de nível ${level.name.toLowerCase()}?`,
      answer: `As grades variam de ${level.gridSizeMin}×${level.gridSizeMin} a ${level.gridSizeMax}×${level.gridSizeMax} letras.`,
    },
  ],
}))

export const PT_CATEGORY_SEED_DEFINITIONS: CategorySeedDefinition[] = [
  HUB_IMPRIMER_PT,
  HUB_DIFICULTE_PT,
  HUB_TEMATICOS_PT,
  ...THEME_DEFINITIONS_PT,
  ...DIFFICULTY_DEFINITIONS_PT,
]
