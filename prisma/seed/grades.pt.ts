/**
 * PT-BR grade reference data (Brazilian Ensino Fundamental, 1º–9º ano).
 * Required as real Grade rows, not just category metadata — Category.gradeId
 * is a foreign key, and resolveCategoryPath's GRADE branch reads
 * input.grade.slug (populated via that relation) to build each grade
 * page's URL. Without this, every individual grade category would
 * silently resolve to the hub URL instead of its own page.
 *
 * `order` deliberately extends past the French model's 0–6 range (up to
 * 8, for 9 grades vs French's 7) — GRADE_WORD_LENGTH in the puzzle
 * engine only has entries for orders 0–6, so orders 7–8 fall through to
 * that function's existing default { min: 3, max: 12 } rather than a
 * grade-tailored range. Accepted as-is rather than adding entries to
 * that shared file — see the note in category-constants.ts on keeping
 * the puzzle engine's GradeSlug/GRADE_ORDER/GRADE_DEFAULT_GRID_SIZE
 * French-only.
 */
export const gradeSeedPt = [
  {
    slug: "1-ano",
    name: "1º Ano",
    ageRange: "6 anos",
    order: 0,
    defaultGridSize: 8,
    seoTitle: "Caça-Palavras 1º Ano Grátis para Imprimir | Hibou & Mots",
    metaDescription:
      "Caça-palavras para o 1º ano do ensino fundamental: grades 8×8, palavras curtas, PDF grátis com gabarito.",
    introText:
      "Grades de caça-palavras pensadas para o 1º ano, com palavras curtas e vocabulário escolar acessível.",
  },
  {
    slug: "2-ano",
    name: "2º Ano",
    ageRange: "7 anos",
    order: 1,
    defaultGridSize: 8,
    seoTitle: "Caça-Palavras 2º Ano Grátis para Imprimir | Hibou & Mots",
    metaDescription:
      "Caça-palavras para o 2º ano: grades 8×8, vocabulário de leitura inicial, PDF grátis com gabarito.",
    introText:
      "Grades calibradas para o 2º ano, ideais para reforçar a leitura das primeiras palavras.",
  },
  {
    slug: "3-ano",
    name: "3º Ano",
    ageRange: "8 anos",
    order: 2,
    defaultGridSize: 10,
    seoTitle: "Caça-Palavras 3º Ano Grátis para Imprimir | Hibou & Mots",
    metaDescription:
      "Caça-palavras 3º ano: grades 10×10, vocabulário adequado, imprimíveis e jogáveis online.",
    introText:
      "Uma seleção de caça-palavras para o 3º ano, com grades 10×10 e vocabulário escolar progressivo.",
  },
  {
    slug: "4-ano",
    name: "4º Ano",
    ageRange: "9 anos",
    order: 3,
    defaultGridSize: 10,
    seoTitle: "Caça-Palavras 4º Ano Grátis para Imprimir | Hibou & Mots",
    metaDescription:
      "Caça-palavras 4º ano: grades 10×10, palavras mais longas, atividades grátis para imprimir.",
    introText:
      "Grades de caça-palavras para o 4º ano, com vocabulário enriquecido para a compreensão de leitura.",
  },
  {
    slug: "5-ano",
    name: "5º Ano",
    ageRange: "10 anos",
    order: 4,
    defaultGridSize: 12,
    seoTitle: "Caça-Palavras 5º Ano Grátis para Imprimir | Hibou & Mots",
    metaDescription:
      "Caça-palavras 5º ano: grades 12×12 com diagonais, PDF grátis com gabarito para a sala de aula.",
    introText:
      "Caça-palavras para o 5º ano, com grades 12×12, vocabulário mais exigente e diagonais.",
  },
  {
    slug: "6-ano",
    name: "6º Ano",
    ageRange: "11 anos",
    order: 5,
    defaultGridSize: 12,
    seoTitle: "Caça-Palavras 6º Ano Grátis para Imprimir | Hibou & Mots",
    metaDescription:
      "Caça-palavras 6º ano: grades 12×12, direções invertidas, grátis para imprimir com solução.",
    introText:
      "Grades de caça-palavras para o 6º ano, com diagonais, palavras invertidas e vocabulário do fundamental II.",
  },
  {
    slug: "7-ano",
    name: "7º Ano",
    ageRange: "12 anos",
    order: 6,
    defaultGridSize: 15,
    seoTitle: "Caça-Palavras 7º Ano Grátis para Imprimir | Hibou & Mots",
    metaDescription: "Caça-palavras para o 7º ano: grades 15×15, todas as direções, vocabulário do fundamental II.",
    introText: "Grades para o 7º ano com maior desafio de vocabulário e grades maiores.",
  },
  {
    slug: "8-ano",
    name: "8º Ano",
    ageRange: "13 anos",
    order: 7,
    defaultGridSize: 15,
    seoTitle: "Caça-Palavras 8º Ano Grátis para Imprimir | Hibou & Mots",
    metaDescription: "Caça-palavras para o 8º ano: grades 15×15, vocabulário avançado, grátis para imprimir.",
    introText: "Grades para o 8º ano com vocabulário mais amplo e grades grandes.",
  },
  {
    slug: "9-ano",
    name: "9º Ano",
    ageRange: "14 anos",
    order: 8,
    defaultGridSize: 15,
    seoTitle: "Caça-Palavras 9º Ano Grátis para Imprimir | Hibou & Mots",
    metaDescription:
      "Caça-palavras para o 9º ano: grades 15×15, vocabulário de fim do fundamental, grátis para imprimir.",
    introText: "Grades para o 9º ano, encerrando o ensino fundamental com vocabulário avançado.",
  },
] as const

export type GradeSlugPt = (typeof gradeSeedPt)[number]["slug"]
