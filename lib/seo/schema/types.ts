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

export const CREATIVE_WORK_SCHEMA_TYPES = ["CreativeWork", "LearningResource"] as const

export type CreativeWorkSchema = {
  "@context": "https://schema.org"
  "@type": typeof CREATIVE_WORK_SCHEMA_TYPES
  name: string
  description?: string
  url: string
  inLanguage: string
  genre?: string
  educationalLevel?: string
  learningResourceType?: string
  educationalUse?: string
  teaches?: string
  isAccessibleForFree?: boolean
  image?: string
  audience?: {
    "@type": "Audience"
    audienceType: string
  }
}

export type CollectionPageSchema = {
  "@type": "CollectionPage"
  "@id": string
  url: string
  name: string
  description?: string
  inLanguage: string
  isPartOf: { "@id": string }
  mainEntity: { "@id": string }
  numberOfItems?: number
}

export type CategorySchemaPayload = {
  itemList: ItemListSchema
  faqPage?: FaqPageSchema
}

export type PuzzleSchemaPayload = {
  creativeWork: CreativeWorkSchema
  faqPage?: FaqPageSchema
}

export type ContentSchemaPayload = {
  faqPage?: FaqPageSchema
}
