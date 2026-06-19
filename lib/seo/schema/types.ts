export type ItemListSchema = {
  "@context": "https://schema.org"
  "@type": "ItemList"
  name: string
  numberOfItems: number
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    url: string
    name: string
  }>
}

export type FaqPageSchema = {
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity: Array<{
    "@type": "Question"
    name: string
    acceptedAnswer: {
      "@type": "Answer"
      text: string
    }
  }>
}

export type CreativeWorkSchema = {
  "@context": "https://schema.org"
  "@type": "CreativeWork"
  name: string
  description?: string
  url: string
  inLanguage: string
  genre?: string
  educationalLevel?: string
  learningResourceType?: string
  isAccessibleForFree?: boolean
  image?: string
}

export type CategorySchemaPayload = {
  itemList: ItemListSchema
  faqPage?: FaqPageSchema
}

export type PuzzleSchemaPayload = {
  creativeWork: CreativeWorkSchema
  faqPage?: FaqPageSchema
}
