import { describe, it, expect } from "vitest"
import { splitIntoParagraphChunks, splitParagraphsIntoChunks, splitTeaserAndRest } from "../../lib/content/paragraph-utils"

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim()
}

describe("splitIntoParagraphChunks", () => {
  it("never loses or alters any content (lossless round-trip)", () => {
    const text =
      "Le thème Animaux de Hibou&Mots rassemble des mots mêlés gratuits et des jeux de mots cachés animaux pour enrichir le vocabulaire animaux en français. Chaque puzzle propose une chasse aux lettres : retrouver le lion, le tigre ou l'éléphant dans une grille de savane, repérer girafe et zèbre parmi les herbivores, puis glisser vers le singe quand la jungle monte à la surface. D'autres séries glissent côté ferme avec des animaux domestiques familiers — vache, mouton, poule — pendant que des grilles « océan » introduisent dauphin, baleine ou requin pour varier les milieux."
    const chunks = splitIntoParagraphChunks(text)
    expect(normalize(chunks.join(" "))).toBe(normalize(text))
  })

  it("splits a multi-sentence paragraph into one chunk per sentence", () => {
    const text = "Première phrase ici. Deuxième phrase ici. Troisième phrase ici."
    const chunks = splitIntoParagraphChunks(text)
    expect(chunks).toEqual([
      "Première phrase ici.",
      "Deuxième phrase ici.",
      "Troisième phrase ici.",
    ])
  })

  it("returns a single chunk for a single-sentence paragraph", () => {
    expect(splitIntoParagraphChunks("Une seule phrase ici.")).toEqual(["Une seule phrase ici."])
  })

  it("handles empty or whitespace-only input safely", () => {
    expect(splitIntoParagraphChunks("")).toEqual([])
    expect(splitIntoParagraphChunks("   ")).toEqual([])
  })

  it("falls back to the whole trimmed text if no sentence punctuation is found", () => {
    expect(splitIntoParagraphChunks("pas de ponctuation ici")).toEqual(["pas de ponctuation ici"])
  })

  it("produces reasonably short chunks (under ~260 chars, roughly 3-4 lines) for real content", () => {
    const text =
      "Les listes distinguent volontiers animaux sauvages et animaux domestiques afin d'ancrer le lexique là où l'enfant vit ou rêve. Trouver un mot caché dans la grille fixe la silhouette orthographique du mot entier ; c'est une activité éducative qui soutient la lecture en maternelle comme les premières années du primaire, sans la lourdeur d'une dictée."
    const chunks = splitIntoParagraphChunks(text)
    chunks.forEach((chunk) => expect(chunk.length).toBeLessThan(260))
  })
})

describe("splitParagraphsIntoChunks", () => {
  it("flattens multiple source paragraphs, each further chunked, staying lossless", () => {
    const paragraphs = [
      "Phrase A un. Phrase A deux.",
      "Phrase B un. Phrase B deux. Phrase B trois.",
    ]
    const chunks = splitParagraphsIntoChunks(paragraphs)
    expect(chunks).toHaveLength(5)
    expect(normalize(chunks.join(" "))).toBe(normalize(paragraphs.join(" ")))
  })
})

describe("splitTeaserAndRest", () => {
  it("puts the first chunk in teaser and everything else in rest, losing nothing", () => {
    const paragraphs = [
      "Phrase un ici. Phrase deux ici. Phrase trois ici. Phrase quatre ici.",
    ]
    const { teaser, rest } = splitTeaserAndRest(paragraphs, 1)
    expect(teaser).toEqual(["Phrase un ici."])
    expect(rest).toEqual(["Phrase deux ici.", "Phrase trois ici.", "Phrase quatre ici."])
    expect(normalize([...teaser, ...rest].join(" "))).toBe(normalize(paragraphs.join(" ")))
  })

  it("supports a multi-chunk teaser", () => {
    const paragraphs = ["Un. Deux. Trois. Quatre."]
    const { teaser, rest } = splitTeaserAndRest(paragraphs, 2)
    expect(teaser).toEqual(["Un.", "Deux."])
    expect(rest).toEqual(["Trois.", "Quatre."])
  })

  it("rest is empty when there's only one chunk total", () => {
    const { teaser, rest } = splitTeaserAndRest(["Une seule phrase ici."], 1)
    expect(teaser).toEqual(["Une seule phrase ici."])
    expect(rest).toEqual([])
  })
})
